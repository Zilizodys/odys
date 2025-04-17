'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import ActivityCard from '@/components/suggestions/ActivityCard'
import { createClient } from '@/lib/supabase/client'
import { activities as localActivities } from '@/data/activities'

interface Activity {
  id: string
  title: string
  description: string
  price: number
  address: string
  imageurl: string
  category: string
  city: string
}

// Mapping des moods vers les catégories
const MOOD_TO_CATEGORY: Record<string, string> = {
  'romantic': 'Gastronomie',
  'cultural': 'culture',
  'adventure': 'sport',
  'party': 'vie nocturne',
  'relaxation': 'nature'
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
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0)
  const [savedActivities, setSavedActivities] = useState<Activity[]>([])
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

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

  const currentMood = moods[currentMoodIndex]
  const currentCategory = currentMood ? MOOD_TO_CATEGORY[currentMood] : null

  useEffect(() => {
    const loadActivities = async () => {
      if (!currentCategory) return
      
      setIsLoading(true)
      try {
        const supabase = createClient()
        
        // Récupérer les données du formulaire pour la ville
        const formDataStr = localStorage.getItem('formData')
        const formData = formDataStr ? JSON.parse(formDataStr) : null
        const city = formData?.destination || ''

        console.log('Chargement des activités pour la ville:', city)
        console.log('Catégorie actuelle:', currentCategory)

        if (!city) {
          console.error('Ville manquante')
          return
        }

        // Récupérer les activités de Supabase
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .ilike('city', city)
          .ilike('category', currentCategory)
          .limit(5)

        if (error) {
          console.error('Erreur Supabase:', error)
          throw error
        }

        let activitiesToUse = data || []
        
        // Si on a moins de 5 activités, utiliser les données locales
        if (activitiesToUse.length < 5) {
          const filteredLocalActivities = localActivities.filter(
            activity => 
              activity.city.toLowerCase() === city.toLowerCase() && 
              activity.category.toLowerCase() === currentCategory.toLowerCase()
          )
          activitiesToUse = filteredLocalActivities
        }

        if (activitiesToUse.length > 0) {
          console.log('Activités à utiliser:', activitiesToUse)
          console.log('Nombre total d\'activités:', activitiesToUse.length)
          setActivities(activitiesToUse)
        } else {
          console.log('Aucune activité trouvée pour la ville:', city)
          setActivities([])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error)
        setActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [currentCategory])

  const currentActivity = activities[currentActivityIndex]
  const isLastActivity = currentActivityIndex === activities.length - 1
  const isLastMood = currentMoodIndex === moods.length - 1

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'romantic': return 'Gastronomie'
      case 'cultural': return 'Culture'
      case 'adventure': return 'Sport'
      case 'party': return 'Vie nocturne'
      case 'relaxation': return 'Nature'
      default: return mood
    }
  }

  const saveProgram = async (activities: Activity[]) => {
    try {
      // Récupérer les données du formulaire
      const formDataStr = localStorage.getItem('formData')
      if (!formDataStr) {
        console.error('Données du formulaire non trouvées')
        return false
      }

      let formData
      try {
        formData = JSON.parse(formDataStr)
      } catch (e) {
        console.error('Erreur lors du parsing des données du formulaire:', e)
        return false
      }

      // Si on a un programId, on met à jour le programme existant
      if (programId) {
        const supabase = createClient()
        const { error } = await supabase
          .from('programs')
          .update({ activities: [...savedActivities, ...activities] })
          .eq('id', programId)

        if (error) {
          console.error('Erreur lors de la mise à jour du programme:', error)
          return false
        }

        // Rediriger vers la page du programme
        router.push(`/program/${programId}`)
        return true
      }

      // Sinon, on sauvegarde les activités sélectionnées
      try {
        localStorage.setItem('savedActivities', JSON.stringify(activities))
        return true
      } catch (e) {
        console.error('Erreur lors de la sauvegarde des activités:', e)
        return false
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du programme:', error)
      return false
    }
  }

  const handleSwipe = useCallback(async (swipeDirection: 'left' | 'right') => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(swipeDirection)
    
    let newSavedActivities = savedActivities
    if (swipeDirection === 'right' && currentActivity) {
      newSavedActivities = [...savedActivities, currentActivity]
      setSavedActivities(newSavedActivities)
    }

    await new Promise(resolve => setTimeout(resolve, 200))

    if (isLastActivity) {
      if (isLastMood) {
        try {
          const success = await saveProgram(newSavedActivities)
          if (success) {
            // Forcer la navigation vers /summary
            window.location.href = '/summary'
            return
          } else {
            setIsAnimating(false)
            alert('Une erreur est survenue lors de la sauvegarde du programme. Veuillez réessayer.')
          }
        } catch (e) {
          console.error('Erreur lors de la sauvegarde finale:', e)
          setIsAnimating(false)
          alert('Une erreur inattendue est survenue. Veuillez réessayer.')
        }
      } else {
        setCurrentMoodIndex(prev => prev + 1)
        setCurrentActivityIndex(0)
        setDirection(null)
        setIsAnimating(false)
      }
    } else {
      setCurrentActivityIndex(prev => prev + 1)
      setDirection(null)
      setIsAnimating(false)
    }
  }, [currentActivity, isLastActivity, isLastMood, savedActivities, isAnimating])

  const handleDragEnd = useCallback((_: any, { offset }: PanInfo) => {
    const swipe = offset.x
    if (Math.abs(swipe) > 100) {
      handleSwipe(swipe > 0 ? 'right' : 'left')
    }
  }, [handleSwipe])

  // Supprimer la redirection vers /generate si on a un programId
  useEffect(() => {
    const formDataStr = localStorage.getItem('formData')
    if (!moods.length && !programId) {
      router.push('/generate')
      return
    }
  }, [moods, router, programId])

  if (moods.length === 0) {
    return null
  }

  if (!currentActivity) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Stepper des catégories */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {moods.map((mood, index) => (
              <div
                key={mood}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  index === currentMoodIndex
                    ? 'bg-indigo-600 text-white'
                    : index < currentMoodIndex
                    ? 'bg-indigo-100'
                    : 'bg-gray-100'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold text-center text-gray-900">
            {getMoodLabel(currentMood)}
          </h2>
        </div>

        <div className="relative h-[calc(100vh-12rem)]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`${currentMoodIndex}-${currentActivityIndex}`}
              custom={direction}
              initial={{ 
                x: direction === 'left' ? 300 : direction === 'right' ? -300 : 0,
                opacity: 0,
                scale: 0.95
              }}
              animate={{ 
                x: 0,
                opacity: 1,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }
              }}
              exit={{ 
                x: direction === 'left' ? -300 : 300,
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragEnd={handleDragEnd}
              whileDrag={{
                rotate: direction === 'left' ? -7 : direction === 'right' ? 7 : 0
              }}
              className="absolute inset-0 touch-none will-change-transform"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                <div className="relative h-[70%]">
                  <img
                    src={currentActivity.imageurl}
                    alt={currentActivity.title}
                    className="w-full h-full object-cover"
                    width={600}
                    height={400}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/600x400/e4e4e7/1f2937?text=${encodeURIComponent(currentActivity.title)}`;
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h2 className="text-2xl font-bold text-white">{currentActivity.title}</h2>
                    <p className="text-white/90">{currentActivity.category}</p>
                  </div>
                </div>
                
                <div className="p-4 space-y-2">
                  <p className="text-gray-600 line-clamp-2">{currentActivity.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500">📍 {currentActivity.address}</p>
                    <p className="text-xl font-semibold text-indigo-600">{currentActivity.price}€</p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                  <button
                    onClick={() => !isAnimating && handleSwipe('left')}
                    className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50"
                  >
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    onClick={() => !isAnimating && handleSwipe('right')}
                    className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50"
                  >
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-4 text-center text-gray-600">
          <p>Swipez à droite pour sauvegarder, à gauche pour passer</p>
          <p className="mt-1">
            {currentActivityIndex + 1} sur {activities.length} activités
          </p>
        </div>
      </main>
    </div>
  )
} 