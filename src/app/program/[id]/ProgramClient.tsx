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
import { Pencil } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMotionValue, useAnimation } from 'framer-motion'

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
  coverImage?: string | null
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

const BUDGET_OPTIONS = [
  { value: 0, label: 'Gratuit' },
  { value: 1, label: 'Petit budget' },
  { value: 2, label: 'Modéré' },
  { value: 3, label: 'Luxe' },
]

export default function ProgramClient({ initialProgram }: { initialProgram: Program }) {
  const router = useRouter()
  const [program, setProgram] = useState<Program>(initialProgram)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<'planning' | 'activities'>('planning')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const [hasReachedBottom, setHasReachedBottom] = useState(false)
  const lastScrollY = useRef(0)

  // Masquer le header global sur la page programme
  useEffect(() => {
    document.body.setAttribute('data-program-page', 'true');
    return () => document.body.removeAttribute('data-program-page');
  }, []);

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
          ...newPlanning.days[slot],
          activities: [restaurant]
        }
        setPlanning(newPlanning)
      }
    } catch (e) {
      console.error('Erreur lors de la synchronisation du restaurant:', e)
    }
  }, [planning])

  // Gestion de la visibilité du bouton sticky selon le scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const atBottom = (window.innerHeight + currentScrollY) >= (document.body.scrollHeight - 24)
      if (atBottom && !hasReachedBottom) {
        setHasReachedBottom(true)
        setShowStickyCTA(false)
        return
      } else if (!atBottom && hasReachedBottom) {
        setHasReachedBottom(false)
      }
      // Sticky visible si on n'est pas en bas, qu'on scrolle vers le haut, et qu'on n'est pas tout en haut
      if (!atBottom && currentScrollY < lastScrollY.current && currentScrollY > 200) {
        setShowStickyCTA(true)
      } else if (!atBottom) {
        setShowStickyCTA(false)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasReachedBottom])

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
      {/* Cover full width, collée en haut */}
      <div className="relative w-full h-[390px] sm:h-[510px]">
        <Image
          src={program.coverImage || (program as any).cover_image || getDestinationImage(program.destination).url}
          alt={program.title || getDestinationImage(program.destination).alt}
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* Overlay sombre pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        {/* Bouton retour en haut à gauche */}
        <button
          onClick={() => router.push('/dashboard')}
          className="absolute top-4 left-4 z-20 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-md backdrop-blur"
          aria-label="Retour au tableau de bord"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        {/* Titre et destination en bas de l'image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-4 z-10">
          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow">{program.title || `Séjour à ${program.destination}`}</h1>
          <div className="flex items-center gap-2 text-lg text-white drop-shadow">
            <FiMapPin />
            <span>{program.destination}</span>
          </div>
        </div>
      </div>
      {/* Section infos séjour full width, sans padding latéral */}
      <div className="relative bg-white w-full px-6 py-6 flex flex-col gap-4 border-b border-gray-100">
        <button
          className="absolute top-4 right-4 text-indigo-500 hover:text-indigo-700 transition-colors p-2 rounded-full"
          title="Éditer les infos du séjour"
          onClick={() => setShowEditModal(true)}
        >
          <Pencil size={20} />
        </button>
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
      {/* Contenu principal avec padding latéral */}
      <div className="w-full px-4 py-8 -mt-8">
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
      {/* Modale d'édition (à implémenter) */}
      {showEditModal && (
        <AnimatePresence>
          <div className="fixed inset-0 z-[200] flex items-end justify-center w-screen">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowEditModal(false)} />
            {/* Bottom sheet animée */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl p-8 z-10 mx-4"
            >
              {/* Drag handle */}
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 mt-1" />
              <h2 className="text-lg font-bold mb-4 text-center">Éditer les infos du séjour</h2>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  const form = e.target as HTMLFormElement
                  const start_date = (form.elements.namedItem('start_date') as HTMLInputElement).value
                  const end_date = (form.elements.namedItem('end_date') as HTMLInputElement).value
                  const budget = Number((form.elements.namedItem('budget') as HTMLSelectElement).value)
                  const companion = (form.elements.namedItem('companion') as HTMLSelectElement).value
                  setProgram(prev => ({ ...prev, start_date, end_date, budget, companion }))
                  setShowEditModal(false)
                }}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                      type="date"
                      name="start_date"
                      defaultValue={program.start_date}
                      className="border rounded-lg px-3 py-2 w-full"
                      required
                    />
                    <span className="self-center text-gray-400 hidden sm:inline">→</span>
                    <input
                      type="date"
                      name="end_date"
                      defaultValue={program.end_date}
                      className="border rounded-lg px-3 py-2 w-full"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <select
                    name="budget"
                    defaultValue={program.budget}
                    className="border rounded-lg px-3 py-2 w-full"
                    required
                  >
                    {BUDGET_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voyageurs</label>
                  <select
                    name="companion"
                    defaultValue={program.companion}
                    className="border rounded-lg px-3 py-2 w-full"
                    required
                  >
                    {COMPANION_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-row gap-2 mt-6 w-full">
                  <button
                    type="button"
                    className="w-1/2 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-base font-medium"
                    onClick={() => setShowEditModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 text-base font-medium"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
      {/* Sticky CTA animé uniquement si on remonte et pas tout en bas */}
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={showStickyCTA ? { y: 0, opacity: 1 } : { y: 120, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 84px)' }}
      >
        {showStickyCTA && (
          <button
            className="pointer-events-auto w-full max-w-md mx-4 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg shadow-xl hover:bg-indigo-700 transition-colors"
            style={{ boxShadow: '0 8px 32px rgba(80, 80, 180, 0.18)', marginBottom: 16 }}
            onClick={() => {/* TODO: implémenter la logique de sauvegarde */}}
          >
            Sauvegarder les changements
          </button>
        )}
      </motion.div>
      {/* Bouton dans le flux du contenu, toujours visible en bas de page */}
      <div className="w-full flex justify-center mt-12 mb-8">
        <button
          className="w-full max-w-md mx-4 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg shadow-xl hover:bg-indigo-700 transition-colors"
          style={{ boxShadow: '0 8px 32px rgba(80, 80, 180, 0.18)' }}
          onClick={() => {/* TODO: implémenter la logique de sauvegarde */}}
        >
          Sauvegarder les changements
        </button>
      </div>
    </div>
  )
} 