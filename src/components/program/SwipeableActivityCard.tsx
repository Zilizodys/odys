import { motion, PanInfo, useAnimation } from 'framer-motion'
import { Activity } from '@/types/activity'
import { FiMapPin, FiClock, FiDollarSign, FiTrash2 } from 'react-icons/fi'
import { useState, useRef } from 'react'

export interface SwipeableActivityCardProps {
  activity: Activity
  onDelete: (id: string) => void
  onClick?: (activity: Activity) => void
}

export default function SwipeableActivityCard({ activity, onDelete, onClick }: SwipeableActivityCardProps) {
  const controls = useAnimation()
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)

  const handleDragEnd = async (event: any, info: PanInfo) => {
    setIsDragging(false)
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (offset < -50) {
      await controls.start({ x: -100 }) // Révéler le bouton de suppression
      setIsOpen(true)
    } else {
      controls.start({ x: 0 })
      setIsOpen(false)
    }
  }

  const handleDeleteClick = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      await controls.start({ x: '-100%', opacity: 0 })
      onDelete(activity.id)
    } else {
      controls.start({ x: 0 })
      setIsOpen(false)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) {
      const diffX = Math.abs(e.touches[0].clientX - startXRef.current)
      const diffY = Math.abs(e.touches[0].clientY - e.touches[0].clientY)
      
      // Si le mouvement est plus horizontal que vertical, on active le drag
      if (diffX > diffY && diffX > 10) {
        setIsDragging(true)
      }
    }
  }

  const handleClick = () => {
    if (!isDragging && onClick) {
      onClick(activity)
    }
  }

  return (
    <div className="relative">
      <div 
        className="absolute right-0 top-0 bottom-0 w-[100px] bg-red-500 flex items-center justify-center cursor-pointer rounded-lg"
        onClick={handleDeleteClick}
      >
        <FiTrash2 className="w-6 h-6 text-white" />
      </div>
      
      <motion.div
        className="relative bg-white rounded-lg shadow-sm overflow-hidden z-10 border border-gray-100 cursor-pointer"
        animate={controls}
        drag={isDragging ? "x" : false}
        dragConstraints={{ left: isOpen ? -100 : 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        initial={{ x: 0 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
      >
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{activity.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FiMapPin className="w-4 h-4" />
              <span>{activity.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiDollarSign className="w-4 h-4" />
              <span>{activity.price}€</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 