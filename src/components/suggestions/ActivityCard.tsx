import { motion, PanInfo, useAnimation } from 'framer-motion'
import { useState } from 'react'
import ImageWithFallback from '../ImageWithFallback'

export interface Activity {
  id: string
  title: string
  description: string
  price: number
  address: string
  imageUrl: string
  category: string
  duration: string
}

interface ActivityCardProps extends Activity {
  onDelete: (id: string) => void
}

export default function ActivityCard({
  id,
  title,
  description,
  price,
  address,
  imageUrl,
  category,
  onDelete
}: ActivityCardProps) {
  const controls = useAnimation()
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (offset < -100 || velocity < -500) {
      await controls.start({ x: "-100%", opacity: 0 })
      onDelete(id)
    } else {
      controls.start({ x: 0, opacity: 1 })
    }
    setIsDragging(false)
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
          src={imageUrl}
          alt={`Photo de ${title}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{address}</p>
          </div>
          <span className="text-indigo-600 font-medium">{price}€</span>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="mt-3">
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
            {category}
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