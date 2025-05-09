import { motion, PanInfo, useAnimation, AnimatePresence } from 'framer-motion'
import { Activity, getActivityImageUrl } from '@/types/activity'
import { FiMapPin, FiClock, FiDollarSign, FiTrash2, FiLink } from 'react-icons/fi'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export interface SwipeableActivityCardProps {
  activity: Activity
  onDelete: (id: string) => void
  onClick?: (activity: Activity) => void
  programId?: string
  isUsedInProgram?: boolean
  programDay?: number
  programSlot?: number
  isOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

export default function SwipeableActivityCard({ 
  activity, 
  onDelete, 
  onClick,
  programId,
  isUsedInProgram,
  programDay,
  programSlot,
  isOpen: isOpenProp,
  onOpen,
  onClose
}: SwipeableActivityCardProps) {
  const controls = useAnimation()
  const [isOpen, setIsOpen] = useState(false)
  const dragLimit = -100

  useEffect(() => {
    if (typeof isOpenProp === 'boolean') {
      setIsOpen(isOpenProp)
      controls.start({ x: isOpenProp ? dragLimit : 0 })
    }
  }, [isOpenProp, controls])

  useEffect(() => {
    if (isOpen) {
      controls.start({ x: dragLimit })
    } else {
      controls.start({ x: 0 })
    }
  }, [isOpen, controls])

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x < -50) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const handleDeleteClick = async () => {
    await controls.start({ x: '-100%', opacity: 0 })
    onDelete(activity.id)
    setIsOpen(false)
  }

  const handleClick = () => {
    if (!isOpen && onClick) {
      onClick(activity)
    }
  }

  return (
    <div className="relative" style={{ overflow: 'visible' }}>
      {/* Bouton delete, sous la carte */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[100px] h-full flex items-center justify-center"
        style={{ zIndex: 1 }}
      >
        <button
          onClick={handleDeleteClick}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-50 border border-gray-200 transition-colors"
          aria-label="Supprimer l'activité"
        >
          <FiTrash2 size={24} className="text-red-400" />
        </button>
      </div>
      {/* La carte swipeable, au-dessus */}
      <motion.div
        className="relative bg-white shadow rounded-xl p-4 z-10 cursor-pointer select-none"
        drag="x"
        dragConstraints={{ left: dragLimit, right: 0 }}
        dragElastic={0.2}
        animate={controls}
        style={{ touchAction: 'pan-y' }}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {activity.imageurl && (
          <div className="w-full h-32 relative mb-2">
            <img
              src={getActivityImageUrl(activity.imageurl)}
              alt={activity.title}
              className="object-cover w-full h-full rounded-t-xl"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/activities/Mascot.png';
              }}
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