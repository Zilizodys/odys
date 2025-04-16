'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiMap } from 'react-icons/fi'
import { Activity } from '@/types/activity'
import { FormData, COMPANION_OPTIONS } from '@/types/form'
import { createClient } from '@/lib/supabase/client'

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

  useEffect(() => {
    // Vérifier s'il y a un programme temporaire à sauvegarder après la connexion
    const searchParams = new URLSearchParams(window.location.search)
    const isAuthCallback = searchParams.get('auth-callback') === 'true'
    
    if (isAuthCallback) {
      const tempProgramStr = localStorage.getItem('tempProgram')
      if (tempProgramStr) {
        try {
          const tempProgram = JSON.parse(tempProgramStr)
          handleSaveProgram()
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
      const activities = JSON.parse(savedActivitiesStr)
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
      const category = activity.category.toLowerCase()
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(activity)
      return acc
    }, {})
  }

  const handleSaveProgram = async () => {
    if (!program) return
    setIsSaving(true)

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        localStorage.setItem('tempProgram', JSON.stringify(program))
        router.push('/login?redirect=/summary')
        return
      }

      // Préparer les données de base du programme
      const programData = {
        user_id: session.user.id,
        destination: program.formData.destination || '',
        start_date: program.formData.startDate || null,
        end_date: program.formData.endDate || null,
        budget: program.formData.budget || 0,
        companion: program.formData.companion || '',
        activities: program.activities.map(activity => ({
          id: activity.id,
          title: activity.title,
          description: activity.description,
          price: activity.price,
          address: activity.address,
          imageUrl: activity.imageUrl,
          category: activity.category
        }))
      }

      console.log('Tentative de sauvegarde avec:', programData)

      const { error } = await supabase
        .from('programs')
        .insert([programData])

      if (error) {
        console.error('Erreur détaillée:', error)
        throw error
      }

      // Nettoyer les données temporaires
      localStorage.removeItem('savedActivities')
      localStorage.removeItem('formData')
      localStorage.removeItem('tempProgram')
      
      // Rediriger vers le dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.')
    } finally {
      setIsSaving(false)
    }
  }

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
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Créer un programme
          </button>
        </div>
      </div>
    )
  }

  const activitiesByCategory = getActivitiesByCategory()

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Résumé de votre programme</h1>

        {/* Informations du programme */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <FiMap className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Votre séjour à {program.formData.destination}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dates */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FiClock className="w-5 h-5 text-indigo-500" />
                <span className="font-medium text-gray-700">Dates</span>
              </div>
              <p className="text-gray-600 ml-8">
                Du {program.formData.startDate ? new Date(program.formData.startDate).toLocaleDateString() : 'Non spécifié'} 
                {program.formData.endDate && ` au ${new Date(program.formData.endDate).toLocaleDateString()}`}
              </p>
            </div>

            {/* Type de voyage */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FiUsers className="w-5 h-5 text-indigo-500" />
                <span className="font-medium text-gray-700">Type de voyage</span>
              </div>
              <p className="text-gray-600 ml-8">
                {COMPANION_OPTIONS.find(option => option.value === program.formData.companion)?.label || 'Non spécifié'} {' '}
                {COMPANION_OPTIONS.find(option => option.value === program.formData.companion)?.icon}
              </p>
            </div>

            {/* Budget prévu */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FiDollarSign className="w-5 h-5 text-indigo-500" />
                <span className="font-medium text-gray-700">Budget prévu</span>
              </div>
              <p className="text-gray-600 ml-8">
                {program.formData.budget || 0}€
              </p>
            </div>

            {/* Budget activités */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FiDollarSign className="w-5 h-5 text-indigo-500" />
                <span className="font-medium text-gray-700">Budget activités</span>
              </div>
              <p className="text-gray-600 ml-8">
                {calculateTotalBudget()}€
                {calculateTotalBudget() > (program.formData.budget || 0) && (
                  <span className="text-red-500 text-sm ml-2">
                    (Dépassement du budget prévu)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Liste des activités par catégorie */}
        <div className="space-y-8">
          {Object.entries(activitiesByCategory).map(([category, activities]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {CATEGORY_LABELS[category] || category}
                <span className="text-sm font-normal text-gray-500">
                  {activities.length} activité{activities.length > 1 ? 's' : ''}
                </span>
              </h2>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                        <p className="text-gray-500 flex items-center gap-1 mt-1">
                          <FiMapPin className="text-indigo-500" />
                          {activity.address}
                        </p>
                        <p className="mt-2 text-gray-600">{activity.description}</p>
                      </div>
                      <span className="text-lg font-semibold text-indigo-600">{activity.price}€</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => router.push('/generate')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Créer un nouveau programme
          </button>
          <button
            onClick={handleSaveProgram}
            disabled={isSaving}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder mon programme'}
          </button>
        </div>
      </main>
    </div>
  )
} 