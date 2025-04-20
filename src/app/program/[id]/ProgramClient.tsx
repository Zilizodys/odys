'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity } from '@/types/activity'
import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiArrowLeft, FiPlus } from 'react-icons/fi'
import { COMPANION_OPTIONS } from '@/types/form'
import Image from 'next/image'
import ActivityModal from '@/components/ActivityModal'
import Link from 'next/link'
import SwipeableActivityCard from '@/components/program/SwipeableActivityCard'
import { createClient } from '@/lib/supabase/client'
import CategorySection from '@/components/program/CategorySection'

interface Program {
  id: string
  title: string
  description: string
  activities: Activity[]
  imageurl: string
  created_at: string
  updated_at: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  companion: string
  cover_image?: string | null
  moods?: string[]
}

interface ProgramActivityRow {
  activity_id: string
  activities: Activity
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
  
  return {
    url: cityImages[destination] || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    alt: `Vue de ${destination || 'la ville'}`
  }
}

export default function ProgramClient({ initialProgram }: { initialProgram: Program }) {
  const router = useRouter()
  const [program, setProgram] = useState<Program>(initialProgram)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteActivity = async (activityId: string) => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      if (!supabase) {
        throw new Error('Client Supabase non initialisé')
      }

      const { error: deleteError } = await supabase
        .from('program_activities')
        .delete()
        .eq('program_id', program.id)
        .eq('activity_id', activityId)

      if (deleteError) {
        throw deleteError
      }

      setProgram(prev => ({
        ...prev,
        activities: prev.activities.filter(a => a.id !== activityId)
      }))
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'activité:', error)
      alert('Une erreur est survenue lors de la suppression de l\'activité.')
    } finally {
      setIsLoading(false)
    }
  }

  const groupedActivities = groupActivitiesByCategory(
    program.activities.map(activity => ({
      ...activity,
      category: activity.category || 'other'
    }))
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-700">
            <FiArrowLeft className="mr-2" />
            Retour au tableau de bord
          </Link>
        </div>

        <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
          <Image 
            src={getDestinationImage(program.destination).url}
            alt={getDestinationImage(program.destination).alt}
            priority={true}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{program.title || `Séjour à ${program.destination}`}</h1>
            <div className="flex items-center gap-2 text-lg">
              <FiMapPin className="text-white" />
              <span>{program.destination}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <FiClock className="text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500">Dates</p>
                <p className="font-medium">
                  Du {new Date(program.start_date).toLocaleDateString('fr-FR')} au {new Date(program.end_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium">{program.budget}€</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiUsers className="text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500">Voyageurs</p>
                <p className="font-medium">
                  {COMPANION_OPTIONS.find(option => option.value === program.companion)?.label || program.companion}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-8">
          {Object.entries(groupedActivities).map(([category, activities]) => (
            <CategorySection
              key={category}
              category={category}
              activities={activities}
              onActivityClick={setSelectedActivity}
              onActivityDelete={handleDeleteActivity}
            />
          ))}
        </div>

        {selectedActivity && (
          <ActivityModal
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
            activities={program.activities}
          />
        )}
      </div>
    </div>
  )
} 