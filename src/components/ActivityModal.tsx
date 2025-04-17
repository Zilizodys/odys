'use client';

import { Activity, getActivityImageUrl } from '@/types/activity'
import { FiMapPin, FiDollarSign, FiX, FiNavigation, FiCalendar } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import ImageWithFallback from '@/components/ImageWithFallback'

interface ActivityModalProps {
  activity: Activity
  onClose: () => void
  activities?: Activity[]
  onNext?: () => void
  onPrevious?: () => void
}

const ActivityContent = ({ activity }: { activity: Activity }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-xl relative">
    {/* Image */}
    <div className="relative h-64">
      <ImageWithFallback
        src={getActivityImageUrl(activity.imageUrl || '')}
        alt={activity.imageAlt || `Photo de l'activité ${activity.title}`}
        fill
        className="object-cover"
        priority
      />
    </div>

    {/* Contenu */}
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{activity.title}</h2>
        <p className="text-gray-500 flex items-center gap-2">
          <FiMapPin className="text-indigo-500" />
          {activity.address}
        </p>
      </div>

      <div className="flex items-center justify-between py-4 border-y border-gray-100">
        <div className="flex items-center gap-2">
          <FiDollarSign className="text-indigo-500" />
          <span className="text-xl font-semibold">
            {activity.price === 0 ? 'Gratuit' : `${activity.price}€`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-indigo-500" />
          <span>~2h</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Description</h3>
        <p className="text-gray-600">{activity.description}</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            const searchQuery = encodeURIComponent(`réserver ${activity.title} ${activity.address}`)
            window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank')
          }}
          className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Réserver
        </button>
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activity.address)}`
            window.open(url, '_blank')
          }}
          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FiNavigation className="w-5 h-5" />
          Itinéraire
        </button>
      </div>
    </div>
  </div>
)

export default function ActivityModal({ activity, onClose, activities, onNext, onPrevious }: ActivityModalProps) {
  const [currentActivity, setCurrentActivity] = useState(activity)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentIndex = activities?.findIndex(a => a.id === currentActivity.id) ?? -1

  const handleSwitch = (direction: 'next' | 'previous') => {
    if (isAnimating || !activities?.length) return
    setIsAnimating(true)
    setDirection(direction === 'next' ? 'left' : 'right')

    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % activities.length
      : (currentIndex - 1 + activities.length) % activities.length

    const newActivity = activities[newIndex]
    
    if (direction === 'next' && onNext) {
      onNext()
    } else if (direction === 'previous' && onPrevious) {
      onPrevious()
    }

    setTimeout(() => {
      setCurrentActivity(newActivity)
      setDirection(null)
      setIsAnimating(false)
    }, 300)
  }

  useEffect(() => {
    setCurrentActivity(activity)
  }, [activity])

  // Gestionnaires d'événements tactiles
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) { // Seuil de 50px pour le swipe
      if (diff > 0) {
        handleSwitch('next')
      } else {
        handleSwitch('previous')
      }
    }

    setTouchStart(null)
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl mx-auto p-4 relative flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[102] bg-white/10 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white/20 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Container pour le carousel */}
        <div className="w-full overflow-hidden">
          <div 
            className="w-full transition-transform duration-300 ease-out"
            style={{ 
              transform: direction === 'left' ? 'translateX(-100%)' : 
                        direction === 'right' ? 'translateX(100%)' : 
                        'translateX(0)'
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <ActivityContent activity={currentActivity} />
          </div>
        </div>

        {/* Indicateurs de position */}
        {activities && activities.length > 1 && (
          <div className="flex gap-2 mt-4">
            {activities.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Composant pour afficher une version simplifiée de la carte d'activité
function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="relative h-64">
        <ImageWithFallback
          src={getActivityImageUrl(activity.imageUrl || '')}
          alt={activity.imageAlt || `Photo de l'activité ${activity.title}`}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{activity.title}</h2>
        <p className="text-gray-500 flex items-center gap-2">
          <FiMapPin className="text-indigo-500" />
          {activity.address}
        </p>
      </div>
    </div>
  )
}