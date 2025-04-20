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

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: fr })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-white shadow">
        {/* Background rouge pour le swipe delete */}
        <div className="absolute inset-y-0 right-0 flex items-center justify-center bg-red-500 w-[150px]">
          <button
            onClick={handleDelete}
            className="text-white w-full h-full flex items-center justify-center"
            aria-label="Supprimer le programme"
          >
            <FiTrash2 size={24} />
          </button>
        </div>

        {/* Carte principale */}
        <div
          ref={cardRef}
          style={{ transform: `translateX(${offsetX}px)` }}
          className="relative bg-white transition-transform cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
        >
          {/* Section image avec titre */}
          <div className="relative h-[200px]">
            <ImageWithFallback
              src={program.coverImage || getDestinationImage(program.destination)}
              alt={`Photo de ${program.destination}`}
              width={400}
              height={200}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-6 left-6">
                <h2 className="font-bold text-white text-3xl mb-3">
                  {program.title || `Séjour à ${program.destination}`}
                </h2>
                <div className="flex items-center gap-2 text-white/90">
                  <FiMapPin size={20} />
                  <span className="text-lg">{program.destination}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section informations */}
          <div className="px-8 pt-16 pb-6 space-y-5">
            <div className="flex items-center gap-3">
              <FiClock className="text-indigo-600 shrink-0" size={22} />
              <div>
                <div className="text-gray-500 text-sm">Dates</div>
                <div className="text-gray-900">Du 19/04/2025 au 20/04/2025</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-indigo-600 text-2xl shrink-0">$</div>
              <div>
                <div className="text-gray-500 text-sm">Budget</div>
                <div className="text-gray-900">{program.budget}€</div>
              </div>
            </div>

            {companion && (
              <div className="flex items-center gap-3">
                <FiUsers className="text-indigo-600 shrink-0" size={22} />
                <div>
                  <div className="text-gray-500 text-sm">Voyageurs</div>
                  <div className="text-gray-900 flex items-center gap-1">
                    En couple {companion.icon}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-indigo-600 text-xl">10</span>
              <span className="text-gray-900">activités sélectionnées</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgramCard 