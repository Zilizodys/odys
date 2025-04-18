'use client';

import { Activity, getActivityImageUrl } from '@/types/activity'
import { FiMapPin, FiDollarSign, FiX, FiNavigation, FiCalendar } from 'react-icons/fi'
import { useEffect, useState, Fragment, useRef } from 'react'
import ImageWithFallback from './ui/ImageWithFallback'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'

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
        src={getActivityImageUrl(activity.imageurl || '')}
        alt={`Photo de l'activité ${activity.title}`}
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

  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="relative h-64 w-full">
                  <Image
                    src={getActivityImageUrl(activity.imageurl || '')}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                    onClick={onClose}
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div>
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                      {activity.title}
                    </Dialog.Title>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1 text-gray-500">
                        <FiMapPin className="text-indigo-500" />
                        <span>{activity.address}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <FiDollarSign className="text-indigo-500" />
                        <span>{activity.price}€</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{activity.description}</p>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    Fermer
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

// Composant pour afficher une version simplifiée de la carte d'activité
function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="relative h-64">
        <ImageWithFallback
          src={getActivityImageUrl(activity.imageurl || '')}
          alt={`Photo de l'activité ${activity.title}`}
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