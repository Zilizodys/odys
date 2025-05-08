'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Activity } from '@/types/activity'
import { FormData } from '@/types/form'
import { getActivitiesByCriteria } from '@/lib/supabase/activities'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { FiX, FiHeart } from 'react-icons/fi'

export default function RestaurantSuggestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [restaurants, setRestaurants] = useState<Activity[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [savedRestaurants, setSavedRestaurants] = useState<Activity[]>([])

  const city = searchParams.get('city')
  const budget = searchParams.get('budget')
  const programId = searchParams.get('program')
  const dayIndex = searchParams.get('day')
  const slotIndex = searchParams.get('slot')

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!city) {
        setError('Ville manquante')
        setLoading(false)
        return
      }

      try {
        const activitiesByCategory = await getActivitiesByCriteria({
          destination: city,
          startDate: null,
          endDate: null,
          budget: budget ? parseInt(budget) : null,
          companion: null,
          moods: ['food', 'romantic']
        })
        
        // Filtrer pour ne garder que les restaurants
        const allRestaurants = Object.values(activitiesByCategory).flat()
        
        const filteredRestaurants = allRestaurants.filter(
          (activity: Activity) => ['restaurant', 'gastronomie'].includes(activity.category.toLowerCase())
        )
        
        setRestaurants(filteredRestaurants)
      } catch (err) {
        setError('Erreur lors de la récupération des suggestions')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [city, budget, programId, dayIndex, slotIndex])

  const handleSwipe = useCallback((direction: number | PanInfo) => {
    const currentRestaurant = restaurants[currentIndex]
    if (!currentRestaurant) return

    if (typeof direction === 'number') {
      if (direction > 0) {
        localStorage.setItem('selectedRestaurant', JSON.stringify({
          restaurant: currentRestaurant,
          dayIndex,
          slotIndex
        }))
        if (programId) {
          router.push(`/program/${programId}`)
        } else {
          router.back()
        }
        return
      }
      const nextIndex = currentIndex + 1
      if (nextIndex >= restaurants.length) {
        if (programId) {
          router.push(`/program/${programId}`)
        } else {
          router.back()
        }
      } else {
        setCurrentIndex(nextIndex)
      }
    } else {
      if (direction.offset.x > 100) {
        localStorage.setItem('selectedRestaurant', JSON.stringify({
          restaurant: currentRestaurant,
          dayIndex,
          slotIndex
        }))
        if (programId) {
          router.push(`/program/${programId}`)
        } else {
          router.back()
        }
        return
      } else if (direction.offset.x < -100) {
        const nextIndex = currentIndex + 1
        if (nextIndex >= restaurants.length) {
          if (programId) {
            router.push(`/program/${programId}`)
          } else {
            router.back()
          }
        } else {
          setCurrentIndex(nextIndex)
        }
      }
    }
  }, [restaurants, currentIndex, router, programId, dayIndex, slotIndex])

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
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Retour
        </button>
      </div>
    )
  }

  const currentRestaurant = restaurants[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-md mx-auto px-4 pt-8 pb-2 w-full flex-1">
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
          Choisissez un restaurant
        </h2>
        <div className="text-center text-sm text-gray-500 mb-2">
          {restaurants.length - currentIndex} suggestion{restaurants.length - currentIndex > 1 ? 's' : ''} restante{restaurants.length - currentIndex > 1 ? 's' : ''}
        </div>
        <div className="mt-8 min-h-[350px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentRestaurant ? (
              <motion.div
                key={currentRestaurant.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                onPanEnd={(_, info) => handleSwipe(info)}
                className="relative w-full"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.9}
                    className="relative bg-white rounded-xl shadow-md overflow-hidden mb-8 max-w-2xl w-full"
                  >
                    <div className="relative h-64 w-full">
                      <ImageWithFallback
                        src={currentRestaurant.imageurl || '/images/fallback/restaurantfallback.png'}
                        alt={currentRestaurant.title}
                        fill
                        className="object-cover rounded-t-xl"
                        priority
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{currentRestaurant.title}</h3>
                          <p className="text-sm text-gray-500">{currentRestaurant.address}</p>
                        </div>
                        <span className="text-indigo-600 font-medium text-lg">{currentRestaurant.price}€</span>
                      </div>
                      <p className="text-gray-600 text-base mb-4">{currentRestaurant.description}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Aucun restaurant disponible</p>
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Retour
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Boutons fixes en bas de la page */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center gap-12 z-30 pointer-events-none">
        <div className="flex gap-12 pointer-events-auto">
          <button
            onClick={() => handleSwipe(-1)}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg hover:bg-red-50 transition-colors border-2 border-red-500"
          >
            <FiX className="w-10 h-10 text-red-500" />
          </button>
          <button
            onClick={() => handleSwipe(1)}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg hover:bg-green-50 transition-colors border-2 border-green-500"
          >
            <FiHeart className="w-10 h-10 text-green-500" />
          </button>
        </div>
      </div>
    </div>
  )
} 