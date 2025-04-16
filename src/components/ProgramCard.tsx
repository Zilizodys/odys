import { useState, useRef, useEffect } from 'react'
import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiTrash2, FiChevronRight } from 'react-icons/fi'
import { Activity } from '@/types/activity'
import { COMPANION_OPTIONS } from '@/types/form'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ProgramCardProps {
  program: {
    id: string
    destination: string
    start_date: string
    end_date: string
    budget: number
    companion: string
    activities: Activity[]
  }
  onDelete: (id: string) => void
}

export default function ProgramCard({ program, onDelete }: ProgramCardProps) {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX - offsetX)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    const newOffset = clientX - startX
    if (newOffset < -150) return // Limite le glissement
    if (newOffset > 0) return // Empêche le glissement vers la droite
    setOffsetX(newOffset)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (offsetX < -100) {
      onDelete(program.id)
    }
    setOffsetX(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    handleDragMove(e.clientX)
  }

  const handleClick = () => {
    if (Math.abs(offsetX) < 5) { // Si le déplacement est minimal, considérer comme un clic
      router.push(`/program/${program.id}`)
    }
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd()
      }
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX)
      }
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('mousemove', handleGlobalMouseMove)

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [isDragging])

  const getDestinationImage = (destination: string) => {
    const cityImages: { [key: string]: string } = {
      'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      'Lyon': 'https://images.unsplash.com/photo-1524396309943-e03f5249f002',
      'Marseille': 'https://images.unsplash.com/photo-1544968464-9ba06f6fce3d',
    }
    return cityImages[destination] || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000'
  }

  const companion = COMPANION_OPTIONS.find(option => option.value === program.companion)

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-y-0 right-0 flex items-center justify-end bg-red-500 w-[150px]">
        <FiTrash2 className="w-6 h-6 text-white mr-8" />
      </div>

      <div
        ref={cardRef}
        style={{ transform: `translateX(${offsetX}px)` }}
        className="relative bg-white rounded-xl shadow-sm transition-transform cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div className="relative h-48 w-full">
          <Image
            src={getDestinationImage(program.destination)}
            alt={program.destination}
            fill
            className="object-cover rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <div className="absolute bottom-0 left-0 p-6">
            <h2 className="text-2xl font-bold text-white">
              Séjour à {program.destination}
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <FiClock className="text-indigo-500" />
              <span>
                Du {new Date(program.start_date).toLocaleDateString()}
                {program.end_date && ` au ${new Date(program.end_date).toLocaleDateString()}`}
              </span>
            </p>
            {companion && (
              <p className="flex items-center gap-2">
                <FiUsers className="text-indigo-500" />
                <span className="flex items-center gap-1">
                  {companion.label} {companion.icon}
                </span>
              </p>
            )}
            <p className="flex items-center gap-2">
              <FiDollarSign className="text-indigo-500" />
              <span>Budget: {program.budget}€</span>
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center justify-between">
              <span>Activités ({program.activities?.length || 0})</span>
              <FiChevronRight className="text-gray-400" />
            </h3>
            <div className="space-y-3">
              {program.activities?.slice(0, 2).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <FiMapPin className="text-indigo-500" />
                      {activity.address}
                    </p>
                  </div>
                  <span className="font-medium text-indigo-600">{activity.price}€</span>
                </div>
              ))}
              {(program.activities?.length || 0) > 2 && (
                <p className="text-sm text-gray-500 text-center">
                  +{program.activities.length - 2} autres activités
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 