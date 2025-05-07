'use client'

import { useState, useEffect, useRef } from 'react'
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
import { autoAssignActivities, ProgramPlanning, DayPlan } from '@/lib/planning/autoAssign'
import ProgramPlanningEditor from '@/components/planning/ProgramPlanningEditor'

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

function getProgramActivities(planning: ProgramPlanning): { activityId: string; day: number; slot: number }[] {
  const programActivities: { activityId: string; day: number; slot: number }[] = [];
  if (!planning || !Array.isArray(planning.days)) return programActivities;
  planning.days.forEach((day, dayIndex) => {
    if (!day.activities || !Array.isArray(day.activities)) return;
    day.activities.forEach((scheduledActivity, slotIndex) => {
      if (!scheduledActivity.activities || !Array.isArray(scheduledActivity.activities)) return;
      scheduledActivity.activities.forEach(activity => {
        if (activity && activity.id) {
          programActivities.push({
            activityId: activity.id,
            day: dayIndex + 1,
            slot: slotIndex + 1
          });
        }
      });
    });
  });
  return programActivities;
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

function ParallaxCover({ src, alt, children }: { src: string, alt: string, children: React.ReactNode }) {
  const [offset, setOffset] = useState(0);
  const [scale, setScale] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const rect = ref.current!.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const visible = Math.max(0, Math.min(1, 1 - rect.top / windowHeight));
          setOffset((visible - 0.5) * 60); // Parallaxe
          setScale(1 + visible * 0.12);    // Zoom progressif de 1 à 1.12
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '1rem',
        height: 256,
      }}
      className="mb-8"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 700px"
        style={{
          objectFit: 'cover',
          transform: `translateY(${offset}px) scale(${scale})`,
          transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 1,
          borderRadius: '1rem',
        }}
        priority
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function ProgramClient({ initialProgram }: { initialProgram: Program }) {
  const router = useRouter()
  const [program, setProgram] = useState<Program>(initialProgram)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<'planning' | 'activities'>('planning')

  // Effet pour gérer le défilement vers l'ancre
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const hash = window.location.hash
    if (hash) {
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [])

  // Générer le planning à partir des activités et des dates
  const [planning, setPlanning] = useState<ProgramPlanning>(() =>
    autoAssignActivities(
      program.activities,
      program.start_date,
      program.end_date
    )
  )

  // Ajout : synchronisation du restaurant sélectionné
  useEffect(() => {
    if (typeof window === 'undefined') return
    const selectedRestaurantStr = localStorage.getItem('selectedRestaurant')
    if (!selectedRestaurantStr) return

    try {
      const { restaurant, day, slot } = JSON.parse(selectedRestaurantStr)
      // On clone le planning
      const newPlanning = { ...planning }
      if (newPlanning.days[day] && newPlanning.days[day].activities[slot]) {
        newPlanning.days[day].activities[slot] = {
          ...newPlanning.days[day].activities[slot],
          activities: [restaurant]
        }
        setPlanning(newPlanning)
      }
    } catch (e) {
      console.error('Erreur lors de la synchronisation du restaurant:', e)
    }
  }, [planning])

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

  const groupedActivities = groupActivitiesByCategory(program.activities)
  const programActivities = getProgramActivities(planning)

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
    <div className="bg-gray-50 pb-24">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-700">
            <FiArrowLeft className="mr-2" />
            Retour au tableau de bord
          </Link>
        </div>

        <ParallaxCover src={getDestinationImage(program.destination).url} alt={getDestinationImage(program.destination).alt}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">{program.title || `Séjour à ${program.destination}`}</h1>
            <div className="flex items-center gap-2 text-lg">
              <FiMapPin className="text-white" />
              <span>{program.destination}</span>
            </div>
          </div>
        </ParallaxCover>

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

        <div className="mb-8">
          <div className="grid grid-cols-2 rounded-lg border border-gray-200 bg-white overflow-hidden">
            <button
              onClick={() => setView('planning')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                view === 'planning'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Planning
            </button>
            <button
              onClick={() => setView('activities')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                view === 'activities'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Liste des activités
            </button>
          </div>
        </div>

        {view === 'planning' ? (
          <ProgramPlanningEditor 
            planning={planning} 
            onChange={setPlanning}
            city={program.destination}
            programId={program.id}
            budget={program.budget}
          />
        ) : (
          <div className="space-y-4 pb-8">
            {Object.entries(groupedActivities).map(([category, activities]) => (
              <CategorySection
                key={category}
                category={category}
                activities={activities}
                onActivityClick={setSelectedActivity}
                onActivityDelete={handleDeleteActivity}
                programId={program.id}
                programActivities={programActivities}
              />
            ))}
          </div>
        )}

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