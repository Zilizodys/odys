'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Activity } from '@/types/activity'
import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiTrash2, FiArrowLeft, FiPlus, FiArrowRight } from 'react-icons/fi'
import { COMPANION_OPTIONS } from '@/types/form'
import Image from 'next/image'
import ActivityModal from '@/components/ActivityModal'
import Link from 'next/link'

interface Program {
  id: string
  user_id: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  companion: string
  activities: Activity[]
  title: string
  created_at: string
  updated_at: string
}

interface GroupedActivities {
  [key: string]: Activity[]
}

function groupActivitiesByCategory(activities: Activity[]): GroupedActivities {
  return activities.reduce((groups: GroupedActivities, activity) => {
    const category = activity.category || 'other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(activity)
    return groups
  }, {})
}

const CATEGORY_LABELS: Record<string, string> = {
  'culture': 'Culture',
  'gastronomie': 'Gastronomie',
  'sport': 'Sport',
  'vie nocturne': 'Vie nocturne',
  'nature': 'Nature',
  'other': 'Autres'
}

function ActivityCard({ activity, onClick }: { activity: Activity; onClick: () => void }) {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
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
  )
}

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
  
  return cityImages[destination] || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df'
}

export default function ProgramEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [program, setProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  const handleFetchProgram = async () => {
    try {
      const response = await fetch(`/api/programs/${params.id}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      
      if (
        typeof data === 'object' &&
        data !== null &&
        typeof data.id === 'string' &&
        typeof data.user_id === 'string' &&
        typeof data.destination === 'string' &&
        typeof data.start_date === 'string' &&
        typeof data.end_date === 'string' &&
        typeof data.budget === 'number' &&
        typeof data.companion === 'string' &&
        Array.isArray(data.activities) &&
        typeof data.title === 'string' &&
        typeof data.created_at === 'string' &&
        typeof data.updated_at === 'string'
      ) {
        const program: Program = {
          id: data.id,
          user_id: data.user_id,
          destination: data.destination,
          start_date: data.start_date,
          end_date: data.end_date,
          budget: data.budget,
          companion: data.companion,
          activities: data.activities,
          title: data.title,
          created_at: data.created_at,
          updated_at: data.updated_at
        }
        setProgram(program)
      } else {
        throw new Error('Invalid program data format')
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching program:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleFetchProgram()
  }, [params.id])

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

      setProgram(prev => prev ? { ...prev, activities: updatedActivities } : null)
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'activité:', error)
      alert('Une erreur est survenue lors de la suppression de l\'activité.')
    }
  }

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity)
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!program) {
    return <div>Programme non trouvé</div>
  }

  const groupedActivities = program ? groupActivitiesByCategory(program.activities.map(activity => ({
    ...activity,
    category: activity.category || 'other'
  }))) : {}

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-700">
          <FiArrowLeft className="mr-2" />
          Retour au tableau de bord
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{program.title}</h1>
        <Link
          href={`/program/${program.id}/add-activity`}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" />
          Ajouter une activité
        </Link>
      </div>

      {Object.entries(groupedActivities).map(([category, activities]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{CATEGORY_LABELS[category] || category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => handleActivityClick(activity)}
              />
            ))}
          </div>
        </div>
      ))}

      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          activities={program.activities}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  )
} 