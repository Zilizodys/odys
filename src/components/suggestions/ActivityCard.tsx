import { motion, PanInfo, useAnimation } from 'framer-motion'
import { useState } from 'react'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { Activity } from '@/types/activity'
import { FiX, FiHeart } from 'react-icons/fi'
import CategoryChips from './CategoryChips'

interface ActivityCardProps {
  activity: Activity
  onDelete: (id: string) => void
  direction?: number
  onSwipe?: (direction: number | PanInfo) => void
}

export default function ActivityCard({
  activity,
  onDelete,
  direction = 0,
  onSwipe
}: ActivityCardProps) {
  const controls = useAnimation()
  const [isDragging, setIsDragging] = useState(false)
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null)

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (offset < -100 || velocity < -500) {
      // Swipe gauche = passer
      await controls.start({ x: "-100%", opacity: 0 })
      if (onSwipe) {
        onSwipe(-1)
      }
    } else if (offset > 100 || velocity > 500) {
      // Swipe droite = sauvegarder
      await controls.start({ x: "100%", opacity: 0 })
      onDelete(activity.id)
    } else {
      controls.start({ x: 0, opacity: 1 })
    }
    setIsDragging(false)
    setDragDirection(null)
  }

  const handleDrag = (event: any, info: PanInfo) => {
    const offset = info.offset.x
    if (offset > 50) {
      setDragDirection('right')
    } else if (offset < -50) {
      setDragDirection('left')
    } else {
      setDragDirection(null)
    }
  }

  const getImageUrl = (url: string | undefined) => {
    if (!url) return '/images/fallback/activityfallback.png'
    return url
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={controls}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragStart={() => setIsDragging(true)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="relative bg-white rounded-xl shadow-md overflow-hidden mb-8 max-w-2xl w-full"
      >
        {/* Indicateurs de swipe */}
        <div className={`absolute left-4 top-4 z-10 transition-opacity ${dragDirection === 'left' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-red-500 text-white rounded-full p-2">
            <FiX className="w-8 h-8" />
          </div>
        </div>
        <div className={`absolute right-4 top-4 z-10 transition-opacity ${dragDirection === 'right' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-green-500 text-white rounded-full p-2">
            <FiHeart className="w-8 h-8" />
          </div>
        </div>

        {/* Image et overlays */}
        <div className="relative h-64 w-full overflow-hidden rounded-t-xl">
          <ImageWithFallback
            src={getImageUrl(activity.imageurl)}
            alt={activity.title}
            fill
            className="object-cover rounded-t-xl"
            priority={direction < 3}
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{activity.title}</h3>
              <p className="text-sm text-gray-500">{activity.address}</p>
            </div>
            <span className="text-indigo-600 font-medium text-lg">{activity.price}€</span>
          </div>
          <p className="text-gray-600 text-base mb-4">{activity.description}</p>
          <div className="mt-3">
            <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
              {activity.category}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 