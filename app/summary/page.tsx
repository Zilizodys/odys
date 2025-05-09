'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiMap } from 'react-icons/fi'
import { Activity } from '@/types/activity'
import { FormData, COMPANION_OPTIONS } from '@/types/form'
import { createClient } from '@/lib/supabase/client'
import ActivityModal from '@/components/ActivityModal'
import CategorySection from '@/components/program/CategorySection'
import { GamificationService } from '@/lib/gamification/service'

interface ProgramSummary {
  formData: FormData
  activities: Activity[]
}

const CATEGORY_LABELS: Record<string, string> = {
  'culture': 'Culture',
  'gastronomie': 'Gastronomie',
  'sport': 'Sport',
  'vie nocturne': 'Vie nocturne',
  'nature': 'Nature'
}

export default function SummaryPage() {
  const router = useRouter()
  const [program, setProgram] = useState<ProgramSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  useEffect(() => {
    // Vérifier s'il y a un programme temporaire à sauvegarder après la connexion
    const searchParams = new URLSearchParams(window.location.search)
    const isAuthCallback = searchParams.get('auth-callback') === 'true'
    
    if (isAuthCallback) {
      const tempProgramStr = localStorage.getItem('tempProgram')
      if (tempProgramStr) {
        try {
          const tempProgram = JSON.parse(tempProgramStr)
          handleSaveProgram(tempProgram)
        } catch (error) {
          console.error('Erreur lors de la récupération du programme temporaire:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    // Récupérer les données du formulaire et les activités sélectionnées
    const formDataStr = localStorage.getItem('formData')
    const savedActivitiesStr = localStorage.getItem('savedActivities')

    if (!formDataStr || !savedActivitiesStr) {
      console.error('Données manquantes')
      router.push('/generate')
      return
    }

    try {
      const formData = JSON.parse(formDataStr)
      let activities = JSON.parse(savedActivitiesStr)
      // Dédupliquer par id
      const seen = new Set()
      activities = activities.filter((a: any) => {
        if (seen.has(a.id)) return false
        seen.add(a.id)
        return true
      })
      setProgram({ formData, activities })
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error)
      router.push('/generate')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const calculateTotalBudget = () => {
    if (!program) return 0
    return program.activities.reduce((total, activity) => total + activity.price, 0)
  }

  const getActivitiesByCategory = () => {
    if (!program) return {}
    return program.activities.reduce((acc: Record<string, Activity[]>, activity) => {
      const category = activity.category ? activity.category.toLowerCase() : 'other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(activity)
      return acc
    }, {})
  }

  const handleSaveProgram = async (tempProgram?: ProgramSummary) => {
    try {
      setIsSaving(true);
      const { data: { user }, error: userError } = await createClient().auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not found');

      const programToSave = tempProgram || program;
      if (!programToSave) return;

      // Sauvegarder le programme
      const { data: programData, error: programError } = await createClient()
        .from('programs')
        .insert({
          user_id: user.id,
          destination: programToSave.formData.destination,
          start_date: programToSave.formData.startDate,
          end_date: programToSave.formData.endDate,
          budget: programToSave.formData.budget,
          companion: programToSave.formData.companion,
          moods: programToSave.formData.moods,
          title: `Séjour à ${programToSave.formData.destination}`
        })
        .select()
        .single();

      if (programError) throw programError;

      // Sauvegarder les activités
      const activitiesToInsert = programToSave.activities.map((activity, index) => ({
        program_id: programData.id,
        activity_id: activity.id,
        order_index: index
      }));

      const { error: activitiesError } = await createClient()
        .from('program_activities')
        .insert(activitiesToInsert);

      if (activitiesError) throw activitiesError;

      // Ajouter les points de gamification
      const gamificationService = new GamificationService();
      await gamificationService.addProgramPoints(user.id);
      await gamificationService.checkAndAwardBadges(user.id);

      // Nettoyer le localStorage
      localStorage.removeItem('tempProgram');
      localStorage.removeItem('formData');

      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du programme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre programme...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Aucun programme trouvé.</p>
          <button
            onClick={() => router.push('/generate')}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Créer un programme
          </button>
        </div>
      </div>
    )
  }

  // Ajout du résumé visuel en haut de page (identique à la page programme)
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
      url: cityImages[program.formData.destination] || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
      alt: `Vue de ${program.formData.destination || 'la ville'}`
    }
  }

  const activitiesByCategory = getActivitiesByCategory()

  return (
    <div className="bg-gray-50 pb-24">
      <div className="container mx-auto px-4 py-8">
        {/* Résumé visuel du programme */}
        <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
          <img 
            src={getDestinationImage(program.formData.destination).url}
            alt={getDestinationImage(program.formData.destination).alt}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">{`Séjour à ${program.formData.destination}`}</h1>
            <div className="flex items-center gap-2 text-lg">
              <FiMapPin className="text-white" />
              <span>{program.formData.destination}</span>
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
                  Du {program.formData.startDate ? new Date(program.formData.startDate).toLocaleDateString('fr-FR') : '-'} au {program.formData.endDate ? new Date(program.formData.endDate).toLocaleDateString('fr-FR') : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium">{program.formData.budget}€</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiUsers className="text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500">Voyageurs</p>
                <p className="font-medium">
                  {COMPANION_OPTIONS.find(option => option.value === program.formData.companion)?.label || program.formData.companion}
                </p>
              </div>
            </div>
          </div>
        </div>
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Liste des activités par catégorie */}
          <div className="space-y-4 pb-8">
            {Object.entries(activitiesByCategory).map(([category, activities]) => (
              <CategorySection
                key={category}
                category={category}
                activities={activities}
                onActivityClick={setSelectedActivity}
                onActivityDelete={() => {}}
              />
            ))}
          </div>
          {/* Modale d'activité */}
          {selectedActivity && (
            <ActivityModal
              activity={selectedActivity}
              onClose={() => setSelectedActivity(null)}
            />
          )}

          {/* Boutons d'action */}
          <div className="mt-8 flex flex-col gap-4">
            <button
              onClick={() => {
                localStorage.setItem('resumeAddActivities', 'true')
                router.push('/generate?step=5')
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
            >
              Ajouter des activités
            </button>
            <button
              onClick={() => handleSaveProgram()}
              disabled={isSaving}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder mon programme'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
} 