'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import ActivityCard from '@/components/suggestions/ActivityCard'
import { createClient } from '@/lib/supabase/client'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import EmptyStateCard from '@/components/suggestions/EmptyStateCard'
import MoodTabBar from '@/components/suggestions/MoodTabBar'
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
  const moodsParam = searchParams.get('moods')
  const programId = searchParams.get('programId')
  const destination = searchParams.get('destination')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const budget = searchParams.get('budget')
  const companion = searchParams.get('companion')
  
  const moods = moodsParam?.split(',') || []
  
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [allActivities, setAllActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0)
  const [savedActivities, setSavedActivities] = useState<Activity[]>([])
  const [direction, setDirection] = useState<number>(0)
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [program, setProgram] = useState<Program | null>(null)

  // Si on a les paramètres du programme, on les utilise directement
  useEffect(() => {
    if (programId && destination && startDate && endDate && budget && companion) {
      const formData = {
        destination,
        startDate,
        endDate,
        budget: parseInt(budget),
        companion,
        moods: moods.length > 0 ? moods : ['romantic', 'cultural', 'adventure', 'party', 'relaxation']
      }
      localStorage.setItem('formData', JSON.stringify(formData))
    }
  }, [programId, destination, startDate, endDate, budget, companion, moods])

  useEffect(() => {
    if (destination && startDate && endDate && budget && companion) {
      const formData = {
        destination,
        startDate,
        endDate,
        budget: parseInt(budget),
        companion,
        moods: moods.length > 0 ? moods : ['romantic', 'cultural', 'adventure', 'party', 'relaxation']
      }
      localStorage.setItem('formData', JSON.stringify(formData))
    }
  }, [destination, startDate, endDate, budget, companion, moods])

  useEffect(() => {
    const savedFormData = localStorage.getItem('formData')
    const savedActivities = localStorage.getItem('savedActivities')
    if (savedFormData && savedActivities) {
      setProgram({
        formData: JSON.parse(savedFormData),
        activities: JSON.parse(savedActivities)
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

  // Charger toutes les activités au début
  useEffect(() => {
    const loadAllActivities = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        if (!supabase) {
          console.error('Erreur de connexion à Supabase')
          setAllActivities([])
          return
        }
        
        const formDataStr = localStorage.getItem('formData')
        const formData = formDataStr ? JSON.parse(formDataStr) : null
        const city = formData?.destination?.toLowerCase() || ''
        const budgetRanges = getBudgetRanges(formData?.budget)

        if (!city) {
          console.error('Ville manquante')
          setAllActivities([])
          return
        }

        const { data: activitiesData, error } = await supabase
          .from('activities')
          .select('id, title, description, price, address, imageurl, category, city')
          .eq('city', city)
          .in('price_range', budgetRanges)

        if (error) {
          console.error('Erreur Supabase:', error)
          setAllActivities([])
          return
        }

        if (activitiesData && activitiesData.length > 0) {
          // Grouper les activités par catégorie
          const groupedActivities: Record<string, DatabaseActivity[]> = activitiesData.reduce((acc, activity) => {
            const category = activity.category
            if (!acc[category]) {
              acc[category] = []
            }
            acc[category].push(activity)
            return acc
          }, {} as Record<string, DatabaseActivity[]>)

          // Pour chaque catégorie, prendre 10 activités au hasard
          const limitedActivities = Object.values(groupedActivities).flatMap(categoryActivities => {
            const shuffled = [...categoryActivities].sort(() => Math.random() - 0.5)
            return shuffled.slice(0, 10)
          })

          const formattedActivities: Activity[] = limitedActivities.map(activity => {
            // Vérifier que l'ID est un UUID valide
            const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(activity.id)
            if (!isValidUUID) {
              console.error('ID invalide détecté:', activity.id, 'pour l\'activité:', activity.title)
            }
            
            return {
              id: activity.id,
              title: activity.title,
              description: activity.description,
              price: activity.price,
              address: activity.address,
              imageurl: activity.imageurl,
              category: activity.category,
              city: activity.city
            }
          })
          
          console.log('Activités chargées:', formattedActivities)
          setAllActivities(formattedActivities)
          setCurrentActivityIndex(0)
        } else {
          setAllActivities([])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error)
        setAllActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    loadAllActivities()
  }, [])

  // Filtrer les activités par catégorie
  useEffect(() => {
    if (allActivities.length > 0 && currentCategory) {
      const filtered = allActivities.filter(activity => activity.category === currentCategory.toLowerCase())
      setFilteredActivities(filtered)
    } else {
      setFilteredActivities([])
    }
  }, [allActivities, currentCategory])

  const currentActivity = filteredActivities[currentActivityIndex]
  const isLastActivity = currentActivityIndex === filteredActivities.length - 1
  const isLastMood = currentMoodIndex === moods.length - 1

  const getMoodLabel = useCallback((mood: string) => {
    switch (mood) {
      case 'romantic': return 'Gastronomie'
      case 'cultural': return 'Culture'
      case 'adventure': return 'Sport'
      case 'party': return 'Vie nocturne'
      case 'relaxation': return 'Nature'
      default: return mood
    }
  }, [])

  const handleDelete = (id: string) => {
    console.log('handleDelete appelé avec ID:', id)
    const activity = allActivities.find(a => a.id === id)
    if (activity) {
      console.log('Activité trouvée:', activity)
      setSavedActivities(prev => {
        // Vérifier si l'activité n'est pas déjà sauvegardée
        if (!prev.some(a => a.id === activity.id)) {
          console.log('Activité sauvegardée:', activity)
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
      // On est à la dernière activité de la dernière catégorie
      const allSavedActivities = [...savedActivities]
      if (!allSavedActivities.some(a => a.id === activity.id)) {
        allSavedActivities.push(activity)
      }
      console.log('Sauvegarde du programme avec les activités:', allSavedActivities)
      saveProgram(allSavedActivities)
    }
  }

  const handleSwipe = useCallback((swipeDirection: PanInfo | number) => {
    if (!currentActivity) return;

    let direction: number;
    
    if (typeof swipeDirection === 'number') {
      direction = swipeDirection;
    } else {
      // Calculer la direction à partir du PanInfo
      direction = Math.sign(swipeDirection.offset.x);
    }

    // Appliquer la direction
    setDirection(direction);
    
    if (direction === 1) {
      // Swipe à droite - Accepter l'activité
      handleDelete(currentActivity.id);
    } else if (direction === -1) {
      // Swipe à gauche - Refuser l'activité
      if (isLastActivity) {
        handleNextCategory();
      } else {
        setCurrentActivityIndex(prev => prev + 1);
      }
    }
  }, [currentActivity, isLastActivity, handleNextCategory, handleDelete]);

  const saveProgram = async (activities: Activity[]) => {
    try {
      console.log('Début de saveProgram avec les activités:', activities)
      const supabase = createClient()
      if (!supabase) {
        console.error('Erreur de connexion à Supabase')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Utilisateur non connecté')
      }

      // Récupérer les UUIDs des activités depuis la base de données
      const { data: activitiesData, error } = await supabase
        .from('activities')
        .select('id, title')
        .in('title', activities.map(a => a.title))

      if (error) throw error

      // Créer un mapping des titres vers les UUIDs
      const titleToUuid = new Map(activitiesData?.map(a => [a.title, a.id]) || [])

      // Créer le programme
      const { data: program, error: programError } = await supabase
        .from('programs')
        .insert({
          user_id: user.id,
          title: 'Programme personnalisé',
          description: 'Programme créé à partir des suggestions'
        })
        .select()
        .single()

      if (programError) throw programError

      // Créer les liens avec les activités en utilisant les UUIDs
      const programActivities = activities.map(activity => ({
        program_id: program.id,
        activity_id: titleToUuid.get(activity.title),
        order: activities.indexOf(activity)
      }))

      const { error: linksError } = await supabase
        .from('program_activities')
        .insert(programActivities)

      if (linksError) throw linksError

      // Sauvegarder dans le localStorage
      const savedActivities = activities.map(activity => ({
        ...activity,
        id: titleToUuid.get(activity.title) || activity.id
      }))
      localStorage.setItem('savedActivities', JSON.stringify(savedActivities))
      localStorage.setItem('savedFormData', JSON.stringify(formData))

      router.push('/summary')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du programme:', error)
      setError('Une erreur est survenue lors de la sauvegarde du programme')
    }
  }

  const handleSaveProgram = async () => {
    if (!program) return

    try {
      const client = createClient()
      if (!client) {
        throw new Error('Impossible de créer le client Supabase')
      }
      const { data: { session } } = await client.auth.getSession()

      if (!session) {
        localStorage.setItem('tempProgram', JSON.stringify(program))
        router.push('/login')
        return
      }

      // Récupérer les UUIDs des activités
      const { data: activitiesData, error: activitiesError } = await client
        .from('activities')
        .select('id, title')
        .in('title', program.activities.map((activity: Activity) => activity.title))

      if (activitiesError) {
        throw activitiesError
      }

      // Créer un mapping des titres vers les UUIDs
      const activityIdMap = new Map(
        activitiesData.map(activity => [activity.title, activity.id])
      )

      // Préparer les données du programme
      const programData = {
        user_id: session.user.id,
        destination: program.formData.destination,
        start_date: program.formData.startDate,
        end_date: program.formData.endDate,
        budget: program.formData.budget,
        companion: program.formData.companion,
        activities: program.activities.map((activity: Activity) => ({
          activity_id: activityIdMap.get(activity.title),
          title: activity.title,
          description: activity.description,
          price: activity.price,
          address: activity.address,
          imageurl: activity.imageurl,
          category: activity.category
        }))
      }

      const { error: insertError } = await client
        .from('programs')
        .insert([programData])

      if (insertError) {
        throw insertError
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du programme:', error)
    }
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
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onDelete={handleDelete}
            onSwipe={handleSwipe}
          />
        ))}
      </div>
    </div>
  )
} 