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
import { FormData } from '@/types/form'
import { getActivitiesByCriteria } from '@/lib/supabase/activities'

interface DatabaseActivity extends Activity {}

export default function SuggestionsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activitiesByCategory, setActivitiesByCategory] = useState<Record<string, Activity[]>>({})
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [savedActivities, setSavedActivities] = useState<Activity[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const type = searchParams.get('type')
  const [swipeState, setSwipeState] = useState<{ id: string; direction: 'left' | 'right' } | null>(null)
  const [pendingSwipe, setPendingSwipe] = useState<null | { id: string, direction: 'left' | 'right' }>(null)
  const [pendingActivity, setPendingActivity] = useState<Activity | null>(null)

  // Si c'est une suggestion de restaurant, rediriger vers la page dédiée
  useEffect(() => {
    console.log('Type de suggestion:', type)
    if (type === 'restaurant') {
      console.log('Redirection vers la page des restaurants avec params:', {
        type,
        city: searchParams.get('city'),
        budget: searchParams.get('budget'),
        program: searchParams.get('program'),
        day: searchParams.get('day'),
        slot: searchParams.get('slot')
      })
      router.push(`/suggestions/restaurants?${searchParams.toString()}`)
      return
    }
  }, [type, router, searchParams])

  // Récupérer les données du formulaire depuis localStorage
  const formData = useMemo(() => {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem('formData')
    return data ? JSON.parse(data) as FormData : null
  }, [])

  // Mapping mood → catégorie d'activité (doit matcher le mapping du back)
  const moodToCategory: Record<string, string> = {
    romantic: 'romantique',
    cultural: 'culture',
    adventure: 'sport',
    party: 'vie nocturne',
    relaxation: 'nature',
    shopping: 'shopping',
    wellness: 'bien-etre',
    food: 'gastronomie',
    sport: 'sport',
    nature: 'nature'
  }

  // Passe à la catégorie suivante
  const goToNextCategory = useCallback(() => {
    const currentIdx = categories.indexOf(currentCategory)
    if (currentIdx < categories.length - 1) {
      setCurrentCategory(categories[currentIdx + 1])
      setCurrentIndex(0)
    } else {
      // Dernière catégorie : sauvegarder les activités likées et aller à la page de résumé
      localStorage.setItem('savedActivities', JSON.stringify(savedActivities))
      router.push('/summary')
    }
  }, [categories, currentCategory, router, savedActivities])

  useEffect(() => {
    const fetchActivities = async () => {
      if (!formData) {
        setError('Données du formulaire manquantes')
        setLoading(false)
        return
      }

      try {
        const activitiesByCategory = await getActivitiesByCriteria(formData)
        // Log debug : afficher toutes les catégories présentes dans les activités brutes
        const allRawCategories = Object.keys(activitiesByCategory)
        console.log('Catégories présentes dans les activités brutes (avant filtrage):', allRawCategories)
        // Récupérer les activités déjà sélectionnées
        let alreadySelected: Activity[] = []
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('savedActivities')
          if (saved) {
            try {
              alreadySelected = JSON.parse(saved)
            } catch {}
          }
        }
        // Filtrer les activités déjà sélectionnées (par id)
        const alreadySelectedIds = new Set(alreadySelected.map(a => a.id))
        // Filtrer les activités déjà sélectionnées dans chaque catégorie
        const filteredByCategory: Record<string, Activity[]> = {}
        Object.entries(activitiesByCategory).forEach(([category, activities]) => {
          const normCat = category && category.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
          filteredByCategory[normCat] = activities.filter(
            activity => !alreadySelectedIds.has(activity.id)
          )
        })
        setActivitiesByCategory(filteredByCategory)
        // Définir la liste des catégories à partir des clés qui ont des activités
        const cats = Object.keys(filteredByCategory).filter(cat => filteredByCategory[cat] && filteredByCategory[cat].length > 0)
        setCategories(cats)
        // Définir la première catégorie comme catégorie courante
        if (cats.length > 0) {
          setCurrentCategory(cats[0])
        }
        // Log des catégories disponibles
        console.log('Catégories disponibles (normalisées):', cats)
        console.log('Contenu complet de activitiesByCategory (après filtrage):', filteredByCategory)
      } catch (err) {
        console.error('Erreur lors de la récupération des activités:', err)
        setError('Erreur lors de la récupération des suggestions')
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [formData])

  // Quand on swipe ou delete, si on a fini la catégorie, on passe à la suivante
  const handleSwipe = useCallback((direction: number | PanInfo) => {
    const currentActivities = activitiesByCategory[currentCategory.toLowerCase()] || []
    if (typeof direction === 'number') {
      if (direction > 0) {
        // Swipe droite = sauvegarder
        const activityToSave = currentActivities[currentIndex]
        if (activityToSave) {
          setSavedActivities(prev => [...prev, activityToSave])
        }
      }
      const nextIndex = currentIndex + 1
      if (nextIndex >= currentActivities.length) {
        goToNextCategory()
      } else {
        setCurrentIndex(nextIndex)
      }
    } else {
      if (direction.offset.x > 100) {
        // Swipe droite = sauvegarder
        const activityToSave = currentActivities[currentIndex]
        if (activityToSave) {
          setSavedActivities(prev => [...prev, activityToSave])
        }
        const nextIndex = currentIndex + 1
        if (nextIndex >= currentActivities.length) {
          goToNextCategory()
        } else {
          setCurrentIndex(nextIndex)
        }
      } else if (direction.offset.x < -100) {
        // Swipe gauche = passer
        const nextIndex = currentIndex + 1
        if (nextIndex >= currentActivities.length) {
          goToNextCategory()
        } else {
          setCurrentIndex(nextIndex)
        }
      }
    }
  }, [activitiesByCategory, currentCategory, currentIndex, goToNextCategory])

  const handleDelete = (id: string) => {
    const currentActivities = activitiesByCategory[currentCategory.toLowerCase()] || []
    const activity = currentActivities[currentIndex]
    if (activity) {
      setSavedActivities(prev => [...prev, activity])
    }
    const nextIndex = currentIndex + 1
    if (nextIndex >= currentActivities.length) {
      goToNextCategory()
    } else {
      setCurrentIndex(nextIndex)
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

  // Ajout : résumé de la recherche
  const getCompanionLabel = (companion: string | null) => {
    if (!companion) return ''
    const option = [
      { value: 'solo', label: 'en solo' },
      { value: 'couple', label: 'en couple' },
      { value: 'family', label: 'en famille' },
      { value: 'friends', label: 'entre amis' }
    ].find(opt => opt.value === companion)
    return option ? option.label : ''
  }

  const getResume = () => {
    if (!formData) return ''
    const dest = formData.destination ? `à ${formData.destination}` : ''
    const comp = getCompanionLabel(formData.companion)
    return `Week-end ${dest} ${comp}`.trim()
  }

  // Normalisation de la destination choisie
  const normalizedDest = (formData?.destination || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  // Filtrage des activités par ville (destination)
  const currentActivities = (activitiesByCategory[currentCategory] || []).filter(
    act => act.city && act.city.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase() === normalizedDest
  )
  const currentActivity = currentActivities[currentIndex]

  useEffect(() => {
    document.body.setAttribute('data-suggestions-page', 'true');
    return () => document.body.removeAttribute('data-suggestions-page');
  }, []);

  // Remplace handleSwipe(-1) et handleSwipe(1) par une fonction qui anime puis switche
  const handleSwipeBtn = (dir: 'left' | 'right') => {
    if (!currentActivity) return;
    setPendingSwipe({ id: currentActivity.id, direction: dir });
    setPendingActivity(currentActivity);
    setTimeout(() => {
      setPendingSwipe(null);
      setPendingActivity(null);
      handleSwipe(dir === 'right' ? 1 : -1);
    }, 350);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-md mx-auto px-4 pt-8 pb-2 w-full flex-1">
        {/* Résumé de la recherche */}
        <div className="text-center text-gray-700 text-base font-medium mb-4">
          {getResume()}
        </div>
        {/* Titre de la catégorie courante */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
          {getMoodLabel(currentCategory)}
        </h2>
        {/* Nombre de suggestions restantes */}
        <div className="text-center text-sm text-gray-500 mb-2">
          {currentActivities.length - currentIndex} suggestion{currentActivities.length - currentIndex > 1 ? 's' : ''} restante{currentActivities.length - currentIndex > 1 ? 's' : ''} dans cette catégorie
        </div>
        <ProgressBar
          currentIndex={currentIndex}
          totalItems={currentActivities.length}
        />
        <div className="mt-8 min-h-[350px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {(pendingActivity || currentActivity) ? (
              <motion.div
                key={(pendingActivity || currentActivity).id + (pendingSwipe ? '-' + pendingSwipe.direction : '')}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  x: pendingSwipe && pendingSwipe.id === (pendingActivity || currentActivity).id
                    ? pendingSwipe.direction === 'right' ? 500 : -500
                    : 0,
                  rotate: pendingSwipe && pendingSwipe.id === (pendingActivity || currentActivity).id
                    ? pendingSwipe.direction === 'right' ? 15 : -15
                    : 0,
                  opacity: 1
                }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: pendingSwipe ? 0.35 : 0.3 }}
                onPanEnd={(_, info) => handleSwipe(info)}
                className="relative w-full"
              >
                <ActivityCard
                  activity={pendingActivity || currentActivity}
                  onDelete={handleDelete}
                  onSwipe={handleSwipe}
                />
              </motion.div>
            ) : (
              <EmptyStateCard
                categoryLabel={getMoodLabel(currentCategory)}
                isLastCategory={categories.indexOf(currentCategory) === categories.length - 1}
                onNext={goToNextCategory}
              />
            )}
          </AnimatePresence>
        </div>
        {/* Bouton explicite pour passer à la catégorie suivante */}
        {currentActivities.length > 0 && currentIndex >= currentActivities.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={goToNextCategory}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Passer à la catégorie suivante
            </button>
          </div>
        )}
      </div>
      {/* Boutons fixes en bas de la page */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center gap-12 z-30 pointer-events-none">
        <div className="flex gap-12 pointer-events-auto">
          <button
            onClick={() => handleSwipeBtn('left')}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500 text-white text-4xl shadow-lg hover:bg-red-600 transition-colors border-none focus:outline-none"
            aria-label="Refuser la suggestion"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <button
            onClick={() => handleSwipeBtn('right')}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500 text-white text-4xl shadow-lg hover:bg-green-600 transition-colors border-none focus:outline-none"
            aria-label="Accepter la suggestion"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
} 