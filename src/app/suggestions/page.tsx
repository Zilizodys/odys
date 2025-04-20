'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import ActivityCard from '@/components/suggestions/ActivityCard'
import { createClient } from '@/lib/supabase/client'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import EmptyStateCard from '@/components/suggestions/EmptyStateCard'
import MoodTabBar from '@/components/suggestions/MoodTabBar'
import ProgressBar from '@/components/suggestions/ProgressBar'
import { Activity } from '@/types/activity'

interface DatabaseActivity extends Activity {}

interface ActivityData extends Activity {}

interface ActivityWithImage extends Activity {}

interface FormData {
  destination: string
  startDate: string
  endDate: string
  budget: number
  companion: string
  moods: string[]
}

interface Program {
  formData: FormData
  activities: Activity[]
}

// Mapping des moods vers les catégories
const MOOD_TO_CATEGORY: Record<string, string> = {
  'romantic': 'gastronomie',
  'cultural': 'culture',
  'adventure': 'sport',
  'party': 'vie nocturne',
  'relaxation': 'nature'
}

// Définition des gammes de prix en fonction du budget
const getBudgetRanges = (budget: number | null): string[] => {
  if (!budget) return ['gratuit', 'budget', 'moyen', 'premium', 'luxe']
  
  switch (budget) {
    case 500: // Budget limité
      return ['gratuit', 'budget']
    case 1000: // Budget moyen
      return ['gratuit', 'budget', 'moyen']
    case 2000: // Budget élevé
      return ['gratuit', 'budget', 'moyen', 'premium', 'luxe']
    default:
      return ['gratuit', 'budget', 'moyen', 'premium', 'luxe']
  }
}

export default function SuggestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const destination = searchParams.get('destination')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const budget = searchParams.get('budget')
  const companion = searchParams.get('companion')
  const moodsParam = searchParams.get('moods')
  const moods = moodsParam ? moodsParam.split(',') : []

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [allActivities, setAllActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [savedActivities, setSavedActivities] = useState<Activity[]>([])
  const [program, setProgram] = useState<{ formData: any; activities: Activity[] } | null>(null)

  // Vérifier les paramètres requis
  useEffect(() => {
    const requiredParams = {
      destination,
      startDate,
      endDate,
      budget,
      companion
    }

    const missingParams = Object.entries(requiredParams)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingParams.length > 0) {
      console.error('Paramètres manquants:', missingParams)
      router.push('/generate?error=missing_params')
      return
    }

    // Si tous les paramètres sont présents, sauvegarder dans le localStorage
    const formData = {
      destination,
      startDate,
      endDate,
      budget: parseInt(budget!),
      companion,
      moods: moods.length > 0 ? moods : ['romantic', 'cultural', 'adventure', 'party', 'relaxation']
    }
    localStorage.setItem('formData', JSON.stringify(formData))

    // Charger les activités seulement si tous les paramètres sont présents
    loadAllActivities()
  }, [])

  const loadAllActivities = async () => {
    try {
      if (!destination) {
        console.error('Aucune destination sélectionnée')
        setError('Destination manquante')
        return
      }

      const supabase = createClient()
      if (!supabase) {
        throw new Error('Erreur de connexion à Supabase')
      }

      console.log('Chargement des activités pour:', destination)
      console.log('Catégorie actuelle:', currentCategory)

      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('city', destination.toLowerCase())

      if (activitiesError) {
        throw activitiesError
      }

      console.log('Activités trouvées:', activitiesData?.length)

      if (activitiesData && activitiesData.length > 0) {
        const groupedActivities: Record<string, Activity[]> = activitiesData.reduce((acc, activity) => {
          const category = activity.category.toLowerCase()
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(activity)
          return acc
        }, {} as Record<string, Activity[]>)

        console.log('Activités groupées par catégorie:', groupedActivities)

        const limitedActivities = Object.values(groupedActivities).flatMap(categoryActivities => {
          const shuffled = [...categoryActivities].sort(() => Math.random() - 0.5)
          return shuffled.slice(0, 10)
        })

        console.log('Activités limitées:', limitedActivities.length)
        setAllActivities(limitedActivities)
        setCurrentActivityIndex(0)
      } else {
        console.log('Aucune activité trouvée pour', destination)
        setAllActivities([])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error)
      setError('Erreur lors du chargement des activités')
      setAllActivities([])
    } finally {
      setIsLoading(false)
    }
  }

  // Si une erreur est détectée, rediriger vers la page d'accueil
  useEffect(() => {
    if (error) {
      const missingParams = Object.entries({
        destination,
        startDate,
        endDate,
        budget,
        companion
      })
        .filter(([_, value]) => !value)
        .map(([key]) => key)

      if (missingParams.length > 0) {
        router.push('/generate?error=missing_params')
      } else {
        router.push('/')
      }
    }
  }, [error])

  useEffect(() => {
    const savedFormData = localStorage.getItem('formData')
    const savedActivitiesData = localStorage.getItem('savedActivities')
    if (savedFormData && savedActivitiesData) {
      setProgram({
        formData: JSON.parse(savedFormData),
        activities: JSON.parse(savedActivitiesData)
      })
    }
  }, [])

  const currentMood = moods[currentMoodIndex]
  const currentCategory = currentMood ? MOOD_TO_CATEGORY[currentMood] : null

  const handleNextCategory = useCallback(() => {
    if (currentMoodIndex < moods.length - 1) {
      setCurrentMoodIndex(prev => prev + 1)
      setCurrentActivityIndex(0)
      setDirection(0)
    } else {
      saveProgram(savedActivities)
    }
  }, [currentMoodIndex, moods.length, savedActivities])

  useEffect(() => {
    if (allActivities.length > 0 && currentCategory) {
      console.log('Filtrage des activités pour la catégorie:', currentCategory)
      const filtered = allActivities.filter(activity => 
        activity.category.toLowerCase() === currentCategory.toLowerCase()
      )
      console.log('Activités filtrées trouvées:', filtered.length)
      setFilteredActivities(filtered)
      setCurrentActivityIndex(0)
    } else {
      setFilteredActivities([])
    }
  }, [allActivities, currentCategory])

  const currentActivity = filteredActivities[currentActivityIndex]
  const isLastActivity = currentActivityIndex === filteredActivities.length - 1
  const isLastMood = currentMoodIndex === moods.length - 1

  const handleDelete = (id: string) => {
    const activity = allActivities.find(a => a.id === id)
    if (activity) {
      setSavedActivities(prev => {
        if (!prev.some(a => a.id === activity.id)) {
          return [...prev, activity]
        }
        return prev
      })
    }
    
    if (isLastActivity && !isLastMood) {
      handleNextCategory()
    } else if (!isLastActivity) {
      setCurrentActivityIndex(prev => prev + 1)
      setDirection(0)
    } else if (activity) {
      const allSavedActivities = [...savedActivities]
      if (!allSavedActivities.some(a => a.id === activity.id)) {
        allSavedActivities.push(activity)
      }
      saveProgram(allSavedActivities)
    }
  }

  const handleSwipe = useCallback((direction: number | PanInfo) => {
    let swipeDirection: number;
    
    if (typeof direction === 'number') {
      swipeDirection = direction;
    } else {
      const threshold = 50;
      swipeDirection = direction.offset.x > threshold ? 1 : direction.offset.x < -threshold ? -1 : 0;
    }

    if (swipeDirection !== 0) {
      setDirection(swipeDirection);

      if (swipeDirection === 1) {
        // Swipe right - save activity
        const activityToSave = filteredActivities[currentActivityIndex];
        setSavedActivities(prev => [...prev, activityToSave]);
      }

      // Move to next activity
      if (currentActivityIndex < filteredActivities.length - 1) {
        setTimeout(() => {
          setCurrentActivityIndex(prev => prev + 1);
          setDirection(0);
        }, 200);
      } else if (currentMoodIndex < moods.length - 1) {
        // Move to next category if available
        setTimeout(() => {
          setCurrentMoodIndex(prev => prev + 1);
          setCurrentActivityIndex(0);
          setDirection(0);
        }, 200);
      } else {
        // Save program if we're done with all categories
        saveProgram(savedActivities);
      }
    }
  }, [currentActivityIndex, filteredActivities, currentMoodIndex, moods.length, savedActivities]);

  const saveProgram = async (activities: Activity[]) => {
    try {
      console.log('Début de la sauvegarde du programme avec', activities.length, 'activités')
      
      const supabase = createClient()
      if (!supabase) {
        throw new Error('Erreur de connexion à Supabase')
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', userError)
        throw userError
      }
      if (!user) {
        console.error('Aucun utilisateur connecté')
        throw new Error('Utilisateur non connecté')
      }
      console.log('Utilisateur récupéré:', user.id)

      const formData = JSON.parse(localStorage.getItem('formData') || '{}')
      console.log('Données du formulaire récupérées:', formData)
      
      // Créer le programme
      const programData = {
        user_id: user.id,
        destination: formData.destination,
        start_date: formData.startDate,
        end_date: formData.endDate,
        budget: formData.budget,
        companion: formData.companion,
        activities: JSON.stringify(activities)
      }
      console.log('Données du programme à créer:', programData)

      const { data: createdProgram, error: programError } = await supabase
        .from('programs')
        .insert(programData)
        .select()
        .single()

      if (programError) {
        console.error('Erreur lors de la création du programme:', programError)
        throw programError
      }
      if (!createdProgram) {
        console.error('Aucun programme créé')
        throw new Error('Erreur lors de la création du programme')
      }
      console.log('Programme créé avec succès:', createdProgram)

      // Créer les liens entre le programme et les activités
      const programActivities = activities.map((activity, index) => ({
        program_id: createdProgram.id,
        activity_id: activity.id,
        order_index: index
      }))
      console.log('Création des liens programme-activités:', programActivities)

      const { error: linkError } = await supabase
        .from('program_activities')
        .insert(programActivities)

      if (linkError) {
        console.error('Erreur lors de la création des liens programme-activités:', linkError)
        throw linkError
      }
      console.log('Liens programme-activités créés avec succès')

      // Nettoyer les données temporaires
      localStorage.removeItem('savedActivities')
      localStorage.removeItem('formData')
      console.log('Données temporaires nettoyées')

      // Rediriger vers la page du programme
      console.log('Redirection vers la page du programme:', createdProgram.id)
      router.push(`/program/${createdProgram.id}`)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du programme:', error)
      alert('Une erreur est survenue lors de la sauvegarde du programme.')
    }
  }

  const getMoodLabel = (mood: string): string => {
    const moodLabels: Record<string, string> = {
      'romantic': 'Gastronomie',
      'cultural': 'Culture',
      'adventure': 'Sport',
      'party': 'Vie nocturne',
      'relaxation': 'Nature'
    }
    return moodLabels[mood] || mood
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!isLoading && !error && (
        <>
          <div className="mb-8">
            <MoodTabBar
              moods={moods}
              currentMoodIndex={currentMoodIndex}
              getMoodLabel={getMoodLabel}
            />
            <div className="mt-4">
              <ProgressBar
                currentIndex={currentActivityIndex}
                totalItems={filteredActivities.length}
              />
            </div>
          </div>
          <AnimatePresence mode="wait">
            {currentActivity ? (
              <ActivityCard
                key={currentActivity.id}
                activity={currentActivity}
                onDelete={handleDelete}
                direction={direction}
                onSwipe={handleSwipe}
              />
            ) : (
              <EmptyStateCard
                categoryLabel={getMoodLabel(currentMood)}
                isLastCategory={currentMoodIndex === moods.length - 1}
                onNext={handleNextCategory}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
} 