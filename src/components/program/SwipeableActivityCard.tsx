import { motion, PanInfo, useAnimation, AnimatePresence } from 'framer-motion'
import { Activity, getActivityImageUrl } from '@/types/activity'
import { FiMapPin, FiClock, FiDollarSign, FiTrash2, FiLink } from 'react-icons/fi'
import { useState, useRef } from 'react'
import Link from 'next/link'

export interface SwipeableActivityCardProps {
  activity: Activity
  onDelete: (id: string) => void
  onClick?: (activity: Activity) => void
  programId?: string
  isUsedInProgram?: boolean
  programDay?: number
  programSlot?: number
}

export default function SwipeableActivityCard({ 
  activity, 
  onDelete, 
  onClick,
  programId,
  isUsedInProgram,
  programDay,
  programSlot 
}: SwipeableActivityCardProps) {
  const controls = useAnimation()
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const [offsetX, setOffsetX] = useState(0)

  const handleDragEnd = async (event: any, info: PanInfo) => {
    setIsDragging(false)
    const offset = info.offset.x
    const velocity = info.velocity.x
    setOffsetX(offset)

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
      {/* Fond delete animé, sous la card */}
      <AnimatePresence>
        {offsetX < -10 && (
          <motion.div
            key="delete-bg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-0 bottom-0 w-[100px] h-full flex items-center justify-center z-0"
          >
            <button
              onClick={handleDeleteClick}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-50 border border-gray-200 transition-colors"
              aria-label="Supprimer l'activité"
            >
              <FiTrash2 size={24} className="text-red-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        className="relative bg-white rounded-xl overflow-hidden z-10 border border-gray-100 cursor-pointer transition-transform hover:scale-[1.02]"
        animate={controls}
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.15}
        dragListener={true}
        dragDirectionLock={true}
        style={{
          touchAction: 'pan-y',
          background: offsetX < -10 ? '#ffeaea' : 'white', // fond rouge clair si drag
          transition: 'background 0.2s'
        }}
        onDrag={(e, info) => {
          console.log('drag offsetX:', info.offset.x);
          if (info.offset.x > 0) {
            setOffsetX(0);
          } else {
            setOffsetX(info.offset.x);
          }
        }}
        onDragEnd={handleDragEnd}
        initial={{ x: 0 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
      >
        {activity.imageurl && (
          <div className="w-full h-32 relative mb-2">
            <img
              src={getActivityImageUrl(activity.imageurl)}
              alt={activity.title}
              className="object-cover w-full h-full rounded-t-xl"
            />
          </div>
        )}
        <div className="p-5 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{activity.title}</h3>
            {isUsedInProgram && programId && (
              <div 
                className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
              >
                <FiLink className="w-3 h-3" />
                <span>Jour {programDay}</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{activity.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {activity.address && (
              <span className="flex items-center gap-1">
                <FiMapPin className="w-4 h-4" />
                <span className="truncate max-w-[160px] md:max-w-[220px]">{activity.address}</span>
              </span>
            )}
            {activity.duration && (
              <span className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                <span>{activity.duration}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <FiDollarSign className="w-4 h-4" />
              <span>{activity.price === 0 ? 'Gratuit' : `${activity.price}€`}</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}