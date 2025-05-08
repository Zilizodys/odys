'use client'

import { useState, useRef, useEffect } from 'react'
import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiTrash2, FiShare2 } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity } from '@/types/activity'
import { COMPANION_OPTIONS, BUDGET_OPTIONS } from '@/types/form'
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

  const MAX_SWIPE = -120;
  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    let newOffset = clientX - startX
    if (newOffset < MAX_SWIPE) newOffset = MAX_SWIPE // Limite le glissement à la largeur du bouton
    if (newOffset > 0) newOffset = 0 // Empêche le glissement vers la droite
    setOffsetX(newOffset)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    // Si le swipe dépasse -60px, on laisse la card ouverte sur le bouton
    if (offsetX < MAX_SWIPE / 2) {
      setOffsetX(MAX_SWIPE)
    } else {
      setOffsetX(0)
    }
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
    setOffsetX(0)
    onDelete(program.id)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setOffsetX(0)

    const shareData = {
      title: program.title || `Séjour à ${program.destination}`,
      text: `Découvrez mon séjour à ${program.destination} du ${format(new Date(program.start_date), 'dd/MM/yyyy')} au ${format(new Date(program.end_date), 'dd/MM/yyyy')}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
        await navigator.clipboard.writeText(shareData.text)
        alert('Lien copié dans le presse-papier !')
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error)
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

  // Calcul du label de budget
  const budgetOption = BUDGET_OPTIONS.find(option => option.value === program.budget)
  // Calcul du budget estimé
  const estimatedBudget = program.activities?.reduce((sum, activity) => sum + (activity.price || 0), 0) || 0

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: fr })
  }

  // Ajout d'une fonction utilitaire pour la cover
  const getProgramCoverImage = (program: Program) => {
    return program.coverImage || (program as any).cover_image || getDestinationImage(program.destination)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Fond swipe to delete, FIXE */}
      <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-sm">
        <div className="absolute inset-y-0 right-0 w-[120px] flex flex-col items-center justify-center gap-4 bg-gray-50 rounded-r-3xl z-10">
          <AnimatePresence>
            {offsetX < 0 && (
              <>
                <motion.button
                  key="share"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  whileHover={{ scale: 1.1, boxShadow: "0 4px 16px rgba(80,80,180,0.10)" }}
                  onClick={handleShare}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:bg-indigo-50 border border-gray-200 transition-colors"
                  aria-label="Partager le programme"
                >
                  <FiShare2 size={24} className="text-indigo-400" />
                </motion.button>
                <motion.button
                  key="delete"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  whileHover={{ scale: 1.1, boxShadow: "0 4px 16px rgba(255,0,0,0.10)" }}
                  onClick={handleDelete}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-50 border border-gray-200 transition-colors"
                  aria-label="Supprimer le programme"
                >
                  <FiTrash2 size={24} className="text-red-400" />
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </div>
        {/* Card swipeable : image + details */}
        <div
          ref={cardRef}
          style={{ transform: `translateX(${offsetX}px)`, transition: isDragging ? 'none' : 'transform 0.2s' }}
          className="relative w-full h-full z-20 cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onClick={handleClick}
        >
          {/* Image en haut */}
          <div className="relative w-full h-[240px] rounded-t-3xl overflow-hidden">
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url('${getProgramCoverImage(program)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {/* Overlay gradient + nom destination */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <h2 className="font-bold text-white text-2xl drop-shadow mb-1">
                {program.title || `Séjour à ${program.destination}`}
              </h2>
              <div className="flex items-center gap-2 text-white">
                <FiMapPin size={20} />
                <span className="text-lg">{program.destination}</span>
              </div>
            </div>
          </div>
          {/* Détails en dessous */}
          <div className="bg-white rounded-b-3xl px-8 py-5 space-y-5">
            <div className="flex items-center gap-4">
              <FiClock className="text-indigo-600 shrink-0" size={24} />
              <div>
                <div className="text-gray-500 text-sm">Dates</div>
                <div className="text-gray-900 font-medium">
                  Du {format(new Date(program.start_date), 'dd/MM/yyyy')} au {format(new Date(program.end_date), 'dd/MM/yyyy')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-indigo-600 text-2xl shrink-0">$</div>
              <div>
                <div className="text-gray-500 text-sm">Budget</div>
                <div className="text-gray-900 font-medium">
                  {budgetOption?.label || 'Budget inconnu'}
                  {estimatedBudget > 0 && (
                    <span className="text-gray-500 text-sm"> (estimé : {estimatedBudget}€)</span>
                  )}
                </div>
              </div>
            </div>
            {companion && (
              <div className="flex items-center gap-4">
                <FiUsers className="text-indigo-600 shrink-0" size={24} />
                <div>
                  <div className="text-gray-500 text-sm">Voyageurs</div>
                  <div className="text-gray-900 flex items-center gap-1 font-medium">
                    {companion.label} {companion.icon}
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-indigo-600 text-2xl">{program.activities?.length || 0}</span>
              <span className="text-gray-900">activités sélectionnées</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgramCard 