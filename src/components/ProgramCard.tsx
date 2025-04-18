'use client'

import { useState, useRef, useEffect } from 'react'
import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiTrash2 } from 'react-icons/fi'
import { Activity } from '@/types/activity'
import { COMPANION_OPTIONS } from '@/types/form'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { Program } from '@/types/program'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export interface ProgramCardProps {
  program: Program
  onDelete: (programId: string) => void
  onClick: (programId: string) => void
}

const ProgramCard = ({ program, onDelete, onClick }: ProgramCardProps) => {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const getMoodLabel = (mood: string): string => {
    const moodLabels: Record<string, string> = {
      'romantic': '💑 Romance',
      'cultural': '🎨 Culture',
      'adventure': '🏃‍♂️ Aventure',
      'party': '🎉 Fête',
      'relaxation': '🌿 Détente'
    }
    return moodLabels[mood] || mood
  }

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
      onClick(program.id)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(program.id)
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
      'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
      'Londres': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
      'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
      'Bruxelles': 'https://images.unsplash.com/photo-1581162907694-96ef5b0a75e5',
      'Madeira': 'https://images.unsplash.com/photo-1593105544559-f0adc7d8a0b1'
    }
    
    // Si la destination n'est pas dans la liste, on retourne l'image par défaut
    return cityImages[destination] || '/images/fallback/cityfallback.png'
  }

  const companion = COMPANION_OPTIONS.find(option => option.value === program.companion)

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-y-0 right-0 flex items-center justify-center bg-red-500 w-[150px]">
        <button
          onClick={handleDelete}
          className="text-white hover:text-red-500 transition-colors w-full h-full flex items-center justify-center"
        >
          <FiTrash2 size={24} />
        </button>
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
          <ImageWithFallback
            src={program.coverImage || getDestinationImage(program.destination)}
            alt={program.title}
            width={400}
            height={225}
            className="w-full h-full object-cover rounded-t-xl"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 p-10">
              <h2 className="font-bold text-white mb-1" style={{ fontSize: '28px' }}>
                {program.title || `Séjour à ${program.destination}`}
              </h2>
              <div className="flex items-center gap-2 text-white/90">
                <FiMapPin size={16} />
                <span className="text-sm">{program.destination}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <FiClock className="text-gray-400" size={18} />
              <span className="text-gray-700">
                {format(new Date(program.start_date), 'dd MMM', { locale: fr })} -{' '}
                {format(new Date(program.end_date), 'dd MMM yyyy', { locale: fr })}
              </span>
            </div>
            {companion && (
              <div className="flex items-center gap-2">
                <FiUsers className="text-gray-400" size={18} />
                <span className="text-gray-700 flex items-center gap-1">
                  {companion.label} {companion.icon}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-gray-400" size={18} />
              <span className="text-gray-700">{program.budget > 0 ? `${program.budget}€` : 'Gratuit'}</span>
            </div>
          </div>
        </div>

        <div className="px-4 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Activités sélectionnées</h3>
            <span className="text-gray-500">({program.activities?.length || 0})</span>
          </div>

          <div className="space-y-3">
            {program.activities?.slice(0, 3).map((activity) => (
              <div
                key={activity.id}
                className="p-4 bg-gray-50 rounded-xl"
              >
                <h4 className="font-medium text-gray-900 mb-2">{activity.title}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-500">
                    <FiMapPin size={14} />
                    <span className="text-sm">{activity.address}</span>
                  </div>
                  <span className="text-indigo-600 font-medium">
                    {activity.price === 0 ? 'Gratuit' : `${activity.price}€`}
                  </span>
                </div>
              </div>
            ))}
            {(program.activities?.length || 0) > 3 && (
              <div className="text-sm text-gray-500 text-center p-3 bg-gray-50 rounded-xl">
                +{program.activities.length - 3} autres activités
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgramCard 