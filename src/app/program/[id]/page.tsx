'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Activity } from '@/types/activity'
import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import { COMPANION_OPTIONS } from '@/types/form'
import Image from 'next/image'
import ActivityModal from '@/components/ActivityModal'

interface Program {
  id: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  companion: string
  activities: Activity[]
}

interface GroupedActivities {
  [key: string]: Activity[]
}

const CATEGORY_LABELS: Record<string, string> = {
  'culture': 'Culture',
  'gastronomie': 'Gastronomie',
  'sport': 'Sport',
  'vie nocturne': 'Vie nocturne',
  'nature': 'Nature'
}

interface SwipeableActivityProps {
  activity: Activity
  onDelete: (id: string) => void
}

function SwipeableActivity({ activity, onDelete, onClick }: SwipeableActivityProps & { onClick: () => void }) {
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
      onDelete(activity.id)
    }
    setOffsetX(0)
  }

  const handleClick = () => {
    if (Math.abs(offsetX) < 5) { // Si le déplacement est minimal, considérer comme un clic
      onClick()
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

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX)
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd()
      }
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging])

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
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
          <p className="text-gray-500 flex items-center gap-1 mt-1">
            <FiMapPin className="text-indigo-500" />
            {activity.address}
          </p>
          <p className="mt-2 text-gray-600 line-clamp-2">{activity.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-indigo-600">{activity.price}€</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProgramEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [program, setProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  useEffect(() => {
    const loadProgram = async () => {
      const supabase = createClient()
      
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?redirect=/program/' + params.id)
        return
      }

      // Charger le programme
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error || !data) {
        console.error('Erreur lors du chargement du programme:', error)
        router.push('/dashboard')
        return
      }

      setProgram(data)
      setIsLoading(false)
    }

    loadProgram()
  }, [params.id, router])

  const handleDeleteActivity = async (activityId: string) => {
    if (!program) return

    try {
      const updatedActivities = program.activities.filter(activity => activity.id !== activityId)
      const supabase = createClient()
      
      const { error } = await supabase
        .from('programs')
        .update({ activities: updatedActivities })
        .eq('id', program.id)

      if (error) throw error

      setProgram({ ...program, activities: updatedActivities })
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'activité:', error)
      alert('Une erreur est survenue lors de la suppression de l\'activité.')
    }
  }

  const groupActivitiesByCategory = (activities: Activity[]): GroupedActivities => {
    return activities.reduce((groups, activity) => {
      const category = activity.category.toLowerCase()
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(activity)
      return groups
    }, {} as GroupedActivities)
  }

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du programme...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Programme non trouvé.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  const companion = COMPANION_OPTIONS.find(option => option.value === program.companion)
  const groupedActivities = program ? groupActivitiesByCategory(program.activities) : {}

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 animate-slide-in"
        >
          <FiArrowLeft className="w-5 h-5" />
          Retour au tableau de bord
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 animate-slide-up">
          <div className="relative h-48">
            <Image
              src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
              alt={program.destination}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="text-3xl font-bold text-white">
                Séjour à {program.destination}
              </h1>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FiClock className="text-indigo-500" />
                <span>
                  Du {new Date(program.start_date).toLocaleDateString()}
                  {program.end_date && ` au ${new Date(program.end_date).toLocaleDateString()}`}
                </span>
              </div>
              {companion && (
                <div className="flex items-center gap-2">
                  <FiUsers className="text-indigo-500" />
                  <span className="flex items-center gap-1">
                    {companion.label} {companion.icon}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-indigo-500" />
                <span>Budget: {program.budget}€</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([category, activities], index) => (
            <div 
              key={category} 
              className="bg-white rounded-xl shadow-sm overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center justify-between">
                  <span>{CATEGORY_LABELS[category] || category}</span>
                  <span className="text-sm font-normal text-gray-500">
                    {activities.length} activité{activities.length > 1 ? 's' : ''}
                  </span>
                </h2>
              </div>
              <div className="p-4 space-y-4">
                {activities.map((activity) => (
                  <SwipeableActivity
                    key={activity.id}
                    activity={activity}
                    onDelete={handleDeleteActivity}
                    onClick={() => handleActivityClick(activity)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  )
} 