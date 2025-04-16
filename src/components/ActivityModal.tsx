import { Activity } from '@/types/activity'
import { FiMapPin, FiDollarSign, FiX, FiNavigation, FiCalendar } from 'react-icons/fi'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

interface ActivityModalProps {
  activity: Activity
  onClose: () => void
}

export default function ActivityModal({ activity, onClose }: ActivityModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activity.address)}`
    window.open(url, '_blank')
  }

  const handleReservation = () => {
    const searchQuery = encodeURIComponent(`réserver ${activity.title} ${activity.address}`)
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="relative h-64">
          <Image
            src={activity.imageUrl}
            alt={activity.title}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white/20 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        </div>

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
              <span className="text-xl font-semibold">{activity.price}€</span>
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
              onClick={handleReservation}
              className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Réserver
            </button>
            <button
              onClick={handleNavigate}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiNavigation className="w-5 h-5" />
              Itinéraire
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}