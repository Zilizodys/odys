'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Activity } from '@/types/activity'
import { Program } from '@/types/program'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { FormData } from '@/types/form'
import { createClient } from '@/lib/supabase/client'

export default function ProgramPage() {
  const router = useRouter()
  const [savedActivities, setSavedActivities] = useState<Activity[]>([])
  const [formData, setFormData] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])

  useEffect(() => {
    // Récupérer les activités sauvegardées
    const savedActivitiesStr = localStorage.getItem('savedActivities')
    if (savedActivitiesStr) {
      setSavedActivities(JSON.parse(savedActivitiesStr))
    }

    // Récupérer les données du formulaire
    const formDataStr = localStorage.getItem('formData')
    if (formDataStr) {
      setFormData(JSON.parse(formDataStr))
    }

    const fetchPrograms = async () => {
      try {
        const client = createClient()
        if (!client) {
          throw new Error('Impossible de créer le client Supabase')
        }
        const { data: { session } } = await client.auth.getSession()

        if (!session) {
          router.push('/login')
          return
        }

        const { data, error } = await client
          .from('programs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setPrograms(data || [])
      } catch (error) {
        console.error('Erreur lors de la récupération des programmes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrograms()
  }, [router])

  const handleSaveProgram = async () => {
    if (!formData) return
    setIsLoading(true)

    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error('Erreur de connexion à Supabase')
      }

      // Récupérer l'utilisateur courant
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        throw new Error('Utilisateur non connecté')
      }

      // Créer un nouveau programme
      const { data: newProgram, error: programError } = await supabase
        .from('programs')
        .insert({
          user_id: session.user.id,
          destination: formData.destination,
          start_date: formData.startDate,
          end_date: formData.endDate,
          budget: formData.budget,
          companion: formData.companion,
          title: `Séjour à ${formData.destination}`,
          moods: formData.moods
        })
        .select()
        .single()

      if (programError) {
        throw programError
      }

      // Créer les liens entre le programme et les activités
      const programActivities = savedActivities.map(activity => ({
        program_id: newProgram.id,
        activity_id: activity.id
      }))

      const { error: linkError } = await supabase
        .from('program_activities')
        .insert(programActivities)

      if (linkError) {
        throw linkError
      }

      // Nettoyer les données temporaires
      localStorage.removeItem('savedActivities')
      localStorage.removeItem('formData')

      // Rediriger vers la page du programme
      router.push(`/program/${newProgram.id}`)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Une erreur est survenue lors de la sauvegarde du programme.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
  }

  const getBudgetLabel = (budget: number | null) => {
    if (!budget) return '0€';
    switch (budget) {
      case 500: return 'Économique'
      case 1000: return 'Modéré'
      case 2000: return 'Luxe'
      default: return `${budget}€`
    }
  }

  const getCompanionLabel = (companion: string | null) => {
    if (!companion) return '';
    switch (companion) {
      case 'solo': return 'Solo'
      case 'couple': return 'En couple'
      case 'family': return 'En famille'
      case 'friends': return 'Entre amis'
      default: return companion
    }
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Aucune donnée de programme</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Résumé de votre programme</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="relative h-48">
            <ImageWithFallback
              src={`https://source.unsplash.com/featured/1200x400/?${formData.destination}`}
              alt={`Photo de ${formData.destination}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl font-bold">Séjour à {formData.destination}</h2>
              <p className="text-lg">
                Du {formData.startDate ? new Date(formData.startDate).toLocaleDateString('fr-FR') : ''} au{' '}
                {formData.endDate ? new Date(formData.endDate).toLocaleDateString('fr-FR') : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {savedActivities.map((activity, index) => (
            <div key={activity.id} className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900">{activity.title}</h3>
              <p className="text-gray-600">{activity.description}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveProgram}
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sauvegarde en cours...' : 'Sauvegarder le programme'}
        </button>
      </div>
    </div>
  )
} 