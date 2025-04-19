'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Activity } from '@/types/activity'
import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiTrash2, FiArrowLeft, FiPlus, FiArrowRight } from 'react-icons/fi'
import { COMPANION_OPTIONS } from '@/types/form'
import Image from 'next/image'
import ActivityModal from '@/components/ActivityModal'
import Link from 'next/link'
import { Category, DEFAULT_CATEGORY, normalizeCategory } from '@/constants/categories'
import SwipeableActivityCard from '@/components/program/SwipeableActivityCard'
import { Database } from '@/types/database'

interface Program {
  id: string;
  title: string;
  description: string;
  activities: Activity[];
  imageurl: string;
  createdAt: Date;
  updatedAt: Date;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  companion: string;
  coverImage?: string;
  moods?: string[];
}

interface RawActivity {
  id: string | number
  title: string
  description: string
  address: string
  price: string | number
  category?: string
  image_url?: string
}

interface GroupedActivities {
  [key: string]: Activity[]
}

function validateAndTransformProgram(data: any): Program {
  if (!data?.id || !data?.destination || !data?.start_date || !data?.end_date || !data?.budget || !data?.companion) {
    throw new Error('Invalid program data: missing required fields')
  }

  return {
    id: data.id,
    title: data.title || `Séjour à ${data.destination}`,
    description: data.description || '',
    imageurl: data.imageurl || '',
    createdAt: new Date(data.created_at || Date.now()),
    updatedAt: new Date(data.updated_at || Date.now()),
    destination: data.destination,
    start_date: data.start_date,
    end_date: data.end_date,
    budget: data.budget,
    companion: data.companion,
    activities: (data.activities || []).map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      address: activity.address,
      price: activity.price,
      imageurl: activity.imageurl,
      category: activity.category,
      city: activity.city
    })),
    coverImage: data.coverImage,
    moods: data.moods
  }
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
  
  return {
    url: cityImages[destination] || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    alt: `Vue de ${destination || 'la ville'}`
  }
}

export default function ProgramEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [program, setProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  useEffect(() => {
    async function fetchProgram() {
      try {
        const supabase = createClient()
        if (!supabase) {
          throw new Error('Erreur de connexion à Supabase')
        }

        type ProgramWithActivities = Database['public']['Tables']['programs']['Row'] & {
          program_activities: Array<{
            activities: Database['public']['Tables']['activities']['Row']
          }>
        }

        // Récupérer le programme avec ses activités
        const { data: rawProgramData, error: programError } = await supabase
          .from('programs')
          .select(`
            *,
            program_activities (
              activities (
                id,
                title,
                description,
                price,
                address,
                imageurl,
                category,
                city
              )
            )
          `)
          .eq('id', params.id)
          .single<ProgramWithActivities>()

        if (programError) {
          if (programError.code === 'PGRST116') {
            notFound()
            return
          }
          throw programError
        }

        if (!rawProgramData) {
          notFound()
          return
        }

        // Transformer les données pour avoir les activités directement dans le programme
        const transformedProgram = {
          ...rawProgramData,
          activities: rawProgramData.program_activities?.map(pa => pa.activities) || []
        }

        const validatedProgram = validateAndTransformProgram(transformedProgram)
        setProgram(validatedProgram)
      } catch (error) {
        console.error('Error fetching program:', error)
        if (error instanceof Error && error.message === 'Authentication required') {
          router.push(`/login?redirect=/program/${params.id}`)
          return
        }
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgram()
  }, [params.id, router])

  const handleDeleteActivity = async (activityId: string) => {
    if (!program) return

    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error('Erreur de connexion à Supabase')
      }
      
      // Supprimer le lien dans program_activities
      const { error: deleteError } = await supabase
        .from('program_activities')
        .delete()
        .eq('program_id', program.id)
        .eq('activity_id', activityId)

      if (deleteError) {
        console.error('Erreur lors de la suppression de l\'activité:', deleteError)
        throw deleteError
      }

      // Mettre à jour l'état local
      setProgram(prev => {
        if (!prev) return null
        return {
          ...prev,
          activities: prev.activities.filter(a => a.id !== activityId)
        }
      })
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

  const groupedActivities = groupActivitiesByCategory(
    program.activities.map(activity => ({
      ...activity,
      category: activity.category || 'other'
    }))
  )

  return (
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
          <h1 className="text-3xl font-bold mb-2">{program.title}</h1>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-white" />
            <span>{program.destination}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/program/${program.id}/add-activity`}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FiPlus className="mr-2" />
            Ajouter une activité
          </Link>
        </div>

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

      {Object.entries(groupedActivities).map(([category, activities]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{CATEGORY_LABELS[category] || category}</h2>
          <div className="space-y-4">
            {activities.map((activity) => (
              <SwipeableActivityCard
                key={activity.id}
                activity={activity}
                onDelete={handleDeleteActivity}
              />
            ))}
          </div>
        </div>
      ))}

      {selectedActivity && (
        <ActivityModal
          activity={{
            ...selectedActivity,
            imageurl: selectedActivity.imageurl || getDestinationImage(program.destination).url
          }}
          activities={program.activities}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  )
}

function isProgram(data: any): data is Program {
  return (
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
  )
} 