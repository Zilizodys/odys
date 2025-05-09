'use client'

import React, { useState, useRef, forwardRef, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { fr } from 'date-fns/locale'
import { differenceInDays } from 'date-fns'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import { FiMapPin, FiSearch, FiCheckCircle } from 'react-icons/fi'
import Fuse from 'fuse.js'
import "react-datepicker/dist/react-datepicker.css"
import StepWrapper from '@/components/ui/StepWrapper'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  FormData, 
  INITIAL_FORM_DATA, 
  MOOD_OPTIONS, 
  COMPANION_OPTIONS, 
  BUDGET_OPTIONS,
  SUGGESTED_DESTINATIONS,
  WORLD_CITIES,
  MoodType,
  TravelCompanion
} from '@/types/form'
import { Activity } from '@/types/activity'
import { cache } from '@/lib/cache'
import { ValidationError } from '@/lib/errors'
import { API_TO_FRONTEND_CATEGORY } from '@/constants/categories'
import debounce from 'lodash/debounce'
import type { Activity as CrewActivity } from '@/types/crew'
import FormHeader from './FormHeader'
import FormFooter from './FormFooter'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

// Enregistrer la localisation française
registerLocale('fr', fr)

interface CityResponse {
  city: string
  country: string 
  source: string
  score: number
}

interface SearchResult {
  city: string
  country: string
  source: string
  score?: number
}

// Cache pour les résultats de recherche avec expiration
interface CacheEntry {
  data: SearchResult[];
  timestamp: number;
}

const CACHE_EXPIRATION = 1000 * 60 * 60; // 1 heure
const MAX_CACHE_SIZE = 100;

const searchCache: { [key: string]: CacheEntry } = {};

// Fonction pour nettoyer le cache
const cleanCache = () => {
  const now = Date.now();
  const keys = Object.keys(searchCache);
  
  // Supprimer les entrées expirées
  keys.forEach(key => {
    if (now - searchCache[key].timestamp > CACHE_EXPIRATION) {
      delete searchCache[key];
    }
  });
  
  // Limiter la taille du cache
  if (keys.length > MAX_CACHE_SIZE) {
    const sortedKeys = keys.sort((a, b) => 
      searchCache[b].timestamp - searchCache[a].timestamp
    );
    sortedKeys.slice(MAX_CACHE_SIZE).forEach(key => {
      delete searchCache[key];
    });
  }
};

// Normaliser le texte (enlever les accents, mettre en minuscule)
const normalizeText = (text: string) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// Utiliser directement le debounce de lodash
const debouncedSearch = debounce(async (query: string) => {
  try {
    const normalizedQuery = normalizeText(query)
    
    // Vérifier le cache
    if (searchCache[normalizedQuery]) {
      return searchCache[normalizedQuery]
    }

    const response = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error('Erreur lors de la recherche')
    }

    const data = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('Format de réponse invalide')
    }

    const results: SearchResult[] = data.map((item: unknown) => {
      const cityResponse = item as CityResponse
      return {
        city: cityResponse.city || '',
        country: cityResponse.country || '',
        source: cityResponse.source || '',
        score: typeof cityResponse.score === 'number' ? cityResponse.score : undefined
      }
    })
    
    searchCache[normalizedQuery] = { data: results, timestamp: Date.now() }
    return results
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    return []
  }
}, 300)

// Options de configuration pour Fuse.js
const fuseOptions = {
  keys: ['city', 'country'],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2,
  shouldSort: true,
  includeScore: true
}

const CustomInput = forwardRef<HTMLDivElement, { value?: string; onClick?: () => void }>(
  ({ value, onClick }, ref) => (
    <div className="relative" onClick={onClick} ref={ref}>
      <input
        type="text"
        value={value}
        readOnly
        placeholder="Sélectionnez vos dates"
        className="w-full p-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer text-gray-900 placeholder-gray-400"
      />
      <div className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
)

CustomInput.displayName = 'CustomInput'

const FORM_CACHE_KEY = 'generate_form_data'
const FORM_CACHE_TTL = 30 * 60 * 1000 // 30 minutes
const ACTIVITIES_CACHE_KEY = 'suggested_activities'
const ACTIVITIES_CACHE_TTL = 30 * 60 * 1000 // 30 minutes

// Ajout d'un skeleton loader pour les suggestions de villes
function SuggestionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

export default function GenerateForm() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const getStepFromUrl = () => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const step = parseInt(searchParams.get('step') || '1', 10)
      return Math.min(Math.max(step, 1), 5)
    }
    return 1
  }
  const [formData, setFormData] = useState<FormData>(() => {
    // Récupérer les données du cache au chargement
    const cachedData = cache.get<FormData>(FORM_CACHE_KEY, { storage: 'local' })
    return cachedData || INITIAL_FORM_DATA
  })
  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('resumeAddActivities')) {
      localStorage.removeItem('resumeAddActivities')
      return 5
    }
    return getStepFromUrl()
  })
  const [ready, setReady] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{
    city: string
    country: string
    source: string
    score?: number
  }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [destinationValidee, setDestinationValidee] = useState(false)
  const datePickerRef = useRef<any>(null)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [calendarKey, setCalendarKey] = useState(0)
  const [forceReset, setForceReset] = useState(false)

  // Initialiser Fuse.js avec la liste des villes mondiales
  const fuse = useMemo(() => new Fuse(WORLD_CITIES, fuseOptions), [])

  const fetchCitySuggestions = useCallback(async (input: string) => {
    if (!input.trim() || input.length < 2) {
      setSuggestions([])
      return
    }

    const normalizedInput = normalizeText(input)

    // Vérifier le cache
    if (searchCache[normalizedInput]) {
      setSuggestions(searchCache[normalizedInput].data)
      return
    }

    setIsLoading(true)
    try {
      // Recherche floue dans la liste prédéfinie
      const fuseResults = fuse.search(normalizedInput)
      const worldCitiesResults = fuseResults
        .filter(result => result.score && result.score < 0.4) // Filtrer les résultats trop éloignés
        .map(result => ({
          ...result.item,
          source: 'predefined',
          score: result.score
        }))

      // Rechercher dans Supabase avec une recherche plus flexible
      let dbResults: Array<{ city: string; country: string; source: string; score?: number }> = []
      
      if (supabase) {
        // Utiliser une recherche plus flexible avec ILIKE
        const { data: exactMatches, error: exactError } = await supabase
          .from('activities')
          .select('city')
          .ilike('city', `%${normalizedInput}%`)
          .limit(5)

        // Rechercher aussi avec les mots partiels
        const searchWords = normalizedInput.split(/\s+/)
        const { data: partialMatches, error: partialError } = await supabase
          .from('activities')
          .select('city')
          .or(searchWords.map(word => `city.ilike.%${word}%`).join(','))
          .limit(5)

        if (!exactError && !partialError && (exactMatches || partialMatches)) {
          const allMatches = [...(exactMatches || []), ...(partialMatches || [])]
          dbResults = Array.from(new Set(allMatches.map(item => item.city)))
            .map(city => ({
              city,
              country: 'France',
              source: 'database',
              score: exactMatches?.some(m => m.city === city) ? 0 : 0.1 // Meilleur score pour les correspondances exactes
            }))
        }
      }

      // Combiner et trier les résultats
      const allResults = [...worldCitiesResults, ...dbResults]
      const uniqueResults = Array.from(
        new Map(
          allResults
            .sort((a, b) => (a.score || 0) - (b.score || 0))
            .map(item => [item.city, item])
        ).values()
      ).slice(0, 5)

      // Mettre en cache
      searchCache[normalizedInput] = { data: uniqueResults, timestamp: Date.now() }
      setSuggestions(uniqueResults)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fuse, supabase])

  // Créer une version debounced de la fonction de recherche
  const debouncedFetchSuggestions = useCallback(
    debounce((input: string) => fetchCitySuggestions(input), 300),
    [fetchCitySuggestions]
  )

  // Mémoriser les fonctions de gestion des événements
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'number' ? Number(value) : value
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue }
      cache.set(FORM_CACHE_KEY, updated, {
        storage: 'local',
        ttl: FORM_CACHE_TTL
      })
      return updated
    })
    setDestinationValidee(false)
    if (name === 'destination') {
      if (value.trim().length >= 2) {
        debouncedFetchSuggestions(value)
      } else {
        setSuggestions([])
      }
    }
  }, [debouncedFetchSuggestions])

  const handleMoodToggle = useCallback((mood: MoodType) => {
    setFormData(prev => {
      const moods = prev.moods || []
      const updated = {
        ...prev,
        moods: moods.includes(mood)
          ? moods.filter(m => m !== mood)
          : [...moods, mood]
      }
      cache.set(FORM_CACHE_KEY, updated, {
        storage: 'local',
        ttl: FORM_CACHE_TTL
      })
      return updated
    })
  }, [])

  const handleNext = useCallback(async () => {
    if (currentStep < 5) {
      setDirection('right')
      setCurrentStep(prev => prev + 1)
      return
    }

    try {
      localStorage.setItem('formData', JSON.stringify(formData))
      router.push('/suggestions')
    } catch (error) {
      setError('Erreur lors de la sauvegarde des critères')
    }
  }, [currentStep, formData, router])

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setDirection('left')
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  // Mémoriser les valeurs calculées
  const progress = useMemo(() => ((currentStep - 1) / 4) * 100, [currentStep])

  const isNextDisabled = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !destinationValidee
      case 2:
        return !(dateRange && dateRange.from && dateRange.to)
      case 3:
        return !formData.companion
      case 4:
        return formData.budget === null || formData.budget === undefined
      case 5:
        return formData.moods?.length === 0
      default:
        return false
    }
  }, [currentStep, destinationValidee, dateRange, formData])

  // Nettoyer le cache périodiquement
  useEffect(() => {
    const cacheCleanupInterval = setInterval(() => {
      cleanCache()
    }, 1000 * 60 * 5) // Nettoyer toutes les 5 minutes

    return () => clearInterval(cacheCleanupInterval)
  }, [])

  const handleDestinationSelect = (destination: string) => {
    setFormData(prev => ({ ...prev, destination }))
    setSuggestions([])
    setDestinationValidee(true)
  }

  const handleDestinationSubmit = () => {
    if (formData.destination.trim().length > 0) {
      setDirection('right')
      setCurrentStep(prev => prev + 1)
      setDestinationValidee(false)
    }
  }

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  const handleDateSelect = (type: 'start' | 'end', date: Date | null) => {
    if (!date) return

    const newFormData = { ...formData }
    
    // Formater la date en ISO string et garder seulement la partie date
    const formatDate = (d: Date) => d.toISOString().split('T')[0]
    
    if (type === 'start') {
      newFormData.startDate = formatDate(date)
      // Si la date de fin est avant la nouvelle date de début, on l'ajuste
      if (newFormData.endDate && new Date(newFormData.endDate) < date) {
        const adjustedDate = new Date(date.getTime())
        adjustedDate.setDate(date.getDate() + 1)
        newFormData.endDate = formatDate(adjustedDate)
      }
    } else {
      newFormData.endDate = formatDate(date)
      // Si la date de début n'est pas définie, on la met un jour avant
      if (!newFormData.startDate) {
        const adjustedDate = new Date(date.getTime())
        adjustedDate.setDate(date.getDate() - 1)
        newFormData.startDate = formatDate(adjustedDate)
      }
    }

    setFormData(newFormData)
    // Mise à jour du cache
    cache.set(FORM_CACHE_KEY, newFormData, { ttl: FORM_CACHE_TTL, storage: 'local' })
  }

  // Reset dateRange à chaque changement d'étape (sauf si on reste sur l'étape 2)
  useEffect(() => {
    if (currentStep !== 2) {
      setDateRange(undefined)
    }
  }, [currentStep])

  // Synchronise formData quand la plage est complète
  useEffect(() => {
    if (dateRange && dateRange.from && dateRange.to) {
      updateFormData('startDate', dateRange.from.toISOString().split('T')[0])
      updateFormData('endDate', dateRange.to.toISOString().split('T')[0])
    }
  }, [dateRange])

  const handleStartNow = () => {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    setDateRange({ from: today, to: tomorrow })
    updateFormData('startDate', today.toISOString().split('T')[0])
    updateFormData('endDate', tomorrow.toISOString().split('T')[0])
  }

  const handleCalendarClose = () => {
    setIsCalendarOpen(false)
  }

  const getFormattedDateRange = () => {
    if (formData.startDate && formData.endDate) {
      return `${new Date(formData.startDate).toLocaleDateString('fr-FR')} - ${new Date(formData.endDate).toLocaleDateString('fr-FR')}`
    }
    return ''
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          const selectedCity = suggestions[highlightedIndex]
          updateFormData('destination', selectedCity.city)
          setSuggestions([])
          handleDestinationSelect(selectedCity.city)
        } else if (formData.destination.trim().length > 0) {
          setDestinationValidee(true)
        }
        break
      case 'Escape':
        setSuggestions([])
        setHighlightedIndex(-1)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Sauvegarder les données du formulaire
      localStorage.setItem('formData', JSON.stringify(formData))

      // Envoyer les données à Crew AI
      const response = await fetch('/api/crew/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'API')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la génération des suggestions')
      }

      // Sauvegarder les activités suggérées
      localStorage.setItem('savedActivities', JSON.stringify(data.activities))

      // Rediriger vers la page des suggestions
      router.push(`/suggestions?${new URLSearchParams({
        destination: formData.destination || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        budget: formData.budget?.toString() || '',
        companion: formData.companion || '',
        moods: formData.moods?.join(',') || ''
      })}`)
    } catch (error) {
      console.error('Erreur:', error)
      setError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const validateFormData = (data: FormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    // Validation de la destination
    if (!data.destination) {
      errors.push('Veuillez sélectionner une destination')
    }

    // Validation des dates
    if (!data.startDate || !data.endDate) {
      errors.push('Veuillez sélectionner vos dates de voyage')
    } else {
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const startDate = new Date(data.startDate)
        const endDate = new Date(data.endDate)

        // Vérifier que les dates sont valides
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          errors.push('Les dates sélectionnées sont invalides')
        } else {
          if (startDate < today) {
            errors.push('La date de début doit être dans le futur')
          }
          if (endDate < startDate) {
            errors.push('La date de fin doit être après la date de début')
          }
        }
      } catch (error) {
        console.error('Erreur lors de la validation des dates:', error)
        errors.push('Format de date invalide')
      }
    }

    // Validation du budget
    if (!data.budget || data.budget <= 0) {
      errors.push('Veuillez sélectionner un budget valide')
    }

    // Validation du type de voyage
    if (!data.companion) {
      errors.push('Veuillez sélectionner un type de voyage')
    }

    // Validation des ambiances
    if (!data.moods || data.moods.length === 0) {
      errors.push('Veuillez sélectionner au moins une ambiance')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const updateFormData = (name: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    // On ne force plus setCurrentStep(5) ici, car c'est géré à l'init
    setReady(true)
  }, [])

  // Ajout : pré-remplissage depuis localStorage (clé 'formData')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localFormData = localStorage.getItem('formData')
      if (localFormData) {
        try {
          const parsed = JSON.parse(localFormData)
          if (parsed.destination) {
            setFormData(prev => ({ ...prev, destination: parsed.destination }))
            // Forcer la validation si une destination est présente
            setDestinationValidee(true)
          }
        } catch (e) { /* ignore */ }
      }
      // Vérifier si la destination doit être validée automatiquement (flag spécifique)
      if (localStorage.getItem('destinationValidee') === 'true') {
        setDestinationValidee(true)
        localStorage.removeItem('destinationValidee')
      }
    }
  }, [])

  // Préchargement des suggestions populaires dès le montage
  useEffect(() => {
    setSuggestions(SUGGESTED_DESTINATIONS.map(dest => ({
      city: dest.city,
      country: dest.country,
      source: 'popular',
      score: 1
    })));
  }, []);

  // Mémorisation des étapes pour éviter les re-rendus inutiles
  const Step1 = useMemo(() => (
    <StepWrapper key="step1" title="Où veux-tu partir ?" direction={direction}>
      <div className="space-y-2 pt-1">
        <p className="text-sm text-gray-500 text-left mb-0">
          Entrez la ville ou le pays de votre choix
        </p>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={setInputRef}
            type="text"
            name="destination"
            placeholder="Ex: Paris, Tokyo, New York..."
            value={formData.destination}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
          />
          {destinationValidee && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiCheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
          {/* Suggestions d'autocomplétion */}
          {isLoading ? <SuggestionsSkeleton /> : null}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700 mb-0">
            Destinations populaires
          </p>
          <div className="grid grid-cols-2 gap-1">
            {SUGGESTED_DESTINATIONS.map((destination) => (
              <button
                key={destination.city}
                onClick={() => {
                  if (formData.destination === destination.city) {
                    updateFormData('destination', '')
                  } else {
                    handleDestinationSelect(destination.city)
                  }
                }}
                className={`py-2 px-2 rounded-lg border flex items-center space-x-1 transition-colors text-sm ${
                  formData.destination === destination.city
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{destination.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-sm">{destination.city}</div>
                  <div className="text-xs text-gray-500">{destination.country}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </StepWrapper>
  ), [formData.destination, suggestions, direction, isLoading, destinationValidee]);

  const Step2 = useMemo(() => (
    <StepWrapper key="step2" title="Quand veux tu partir ?" direction={direction}>
      <div className="space-y-3 pt-2">
        <p className="text-sm text-gray-500">
          Choisissez les dates de votre voyage. Cela nous aidera à planifier l'itinéraire parfait pour votre séjour.
        </p>
        <div className="-mx-4">
          <div className="bg-indigo-50 rounded-xl overflow-hidden mb-2">
            <button
              onClick={handleStartNow}
              className="w-full flex items-center justify-center gap-2 p-3 text-indigo-600 hover:bg-indigo-100 transition-colors text-base"
            >
              <span className="text-xl">🚀</span>
              <span className="font-medium">Partir maintenant</span>
            </button>
          </div>
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={handleDateRangeSelect}
            disabled={{ before: new Date() }}
            showOutsideDays
            className="rounded-2xl border border-gray-100 bg-white p-2 shadow-none w-full"
            modifiersClassNames={{
              selected: 'bg-blue-500 text-white rounded-full',
              range_start: 'bg-blue-500 text-white rounded-full',
              range_end: 'bg-blue-500 text-white rounded-full',
              range_middle: 'bg-blue-100 text-blue-700 rounded-md',
              today: 'border border-blue-500',
              disabled: 'text-gray-300'
            }}
            weekStartsOn={1}
            locale={fr}
          />
        </div>
      </div>
    </StepWrapper>
  ), [direction, dateRange]);

  const Step3 = useMemo(() => (
    <StepWrapper key="step3" title="Avec qui voyages-tu ?" direction={direction}>
      <div className="space-y-2 pt-2">
        <p className="text-gray-500 mb-1 text-sm">
          Sélectionnez le type de voyage qui vous correspond le mieux
        </p>
        <div className="grid grid-cols-2 gap-2">
          {COMPANION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                if (formData.companion === option.value) {
                  updateFormData('companion', null)
                } else {
                  updateFormData('companion', option.value)
                }
              }}
              className={`p-3 rounded-lg border-2 flex flex-col items-center transition-colors duration-150 text-sm ${
                formData.companion === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <span className="text-xl mb-1">{option.icon}</span>
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </StepWrapper>
  ), [direction, formData.companion]);

  const Step4 = useMemo(() => (
    <StepWrapper key="step4" title="Quel est votre budget ?" direction={direction}>
      <div className="space-y-2 pt-2">
        <p className="text-gray-500 mb-1 text-sm">
          Choisissez le budget qui correspond à votre voyage
        </p>
        <div className="grid grid-cols-2 gap-2">
          {BUDGET_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                if (formData.budget === option.value) {
                  updateFormData('budget', null)
                } else {
                  updateFormData('budget', option.value)
                }
              }}
              className={`p-3 rounded-lg border text-sm ${
                formData.budget === option.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              <div className="text-xl mb-1">{option.icon}</div>
              <div className="font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>
    </StepWrapper>
  ), [direction, formData.budget]);

  const Step5 = useMemo(() => (
    <StepWrapper key="step5" title="Ambiances souhaitées" direction={direction}>
      <div className="space-y-2 pt-2">
        <p className="text-gray-500 mb-1 text-sm">
          Sélectionnez une ou plusieurs ambiances qui correspondent à vos envies pour ce voyage.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                const moodValue = option.value as MoodType;
                updateFormData('moods', 
                  formData.moods.includes(moodValue)
                    ? formData.moods.filter(mood => mood !== moodValue)
                    : [...formData.moods, moodValue]
                )
              }}
              className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                formData.moods.includes(option.value as MoodType)
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              <span className="text-2xl mb-2">{option.icon}</span>
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </StepWrapper>
  ), [direction, formData.moods]);

  if (!ready) {
    return null
  }

  return (
    <>
      <div className="max-w-md mx-auto flex flex-col flex-1 bg-white pb-24 mt-[120px]">
      <FormHeader
        currentStep={currentStep}
        totalSteps={5}
        onPrevious={handlePrevious}
      />
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Génération des suggestions en cours...</p>
          </div>
        </div>
      )}
      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur lors de la génération des suggestions
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                {error.includes('Token') && (
                  <p className="mt-2">
                    Le service de suggestions n'est pas correctement configuré. Veuillez contacter le support technique.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Form steps */}
        <div className="px-4">
        <AnimatePresence initial={false} mode="wait">
          {currentStep === 1 && Step1}
          {currentStep === 2 && Step2}
          {currentStep === 3 && Step3}
          {currentStep === 4 && Step4}
          {currentStep === 5 && Step5}
        </AnimatePresence>
      <FormFooter
        currentStep={currentStep}
        totalSteps={5}
        onPrevious={handlePrevious}
        onNext={currentStep === 1 ? handleDestinationSubmit : handleNext}
        isNextDisabled={isNextDisabled}
        isLoading={isLoading}
      />
    </div>
      </div>
    </>
  )
}