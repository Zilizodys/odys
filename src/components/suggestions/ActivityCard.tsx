import { motion, PanInfo, useAnimation } from 'framer-motion'
import { useState } from 'react'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { Activity } from '@/types/activity'

interface ActivityCardProps {
  activity: Activity
  onDelete: (id: string) => void
  direction?: number
}

export default function ActivityCard({
  activity,
  onDelete,
  direction = 0
}: ActivityCardProps) {
  const controls = useAnimation()
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (offset < -100 || velocity < -500) {
      await controls.start({ x: "-100%", opacity: 0 })
      onDelete(activity.id)
    } else {
      controls.start({ x: 0, opacity: 1 })
    }
    setIsDragging(false)
  }

  const getImageUrl = (url: string | undefined) => {
    if (!url) return '/images/fallback/activityfallback.png'
    return url.startsWith('/') ? url : `/images/activities/${url}`
  }

  return (
    <motion.div
      animate={controls}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      className="relative bg-white rounded-xl shadow-md overflow-hidden mb-4"
    >
      <div className="relative h-48 w-full">
        <ImageWithFallback
          src={getImageUrl(activity.imageurl)}
          alt={activity.title}
          fill
          className="object-cover rounded-t-xl"
          priority={direction < 3}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
            <p className="text-sm text-gray-500">{activity.address}</p>
          </div>
          <span className="text-indigo-600 font-medium">{activity.price}€</span>
        </div>
        <p className="text-gray-600 text-sm">{activity.description}</p>
        <div className="mt-3">
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
            {activity.category}
          </span>
        </div>
      </div>
      
      {isDragging && (
        <div className="absolute inset-y-0 right-0 w-16 bg-red-500 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      )}
    </motion.div>
  )
} 