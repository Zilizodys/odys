'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FormData } from '@/types/form'
import { Activity } from '@/types/activity'
import Header from '@/components/Header'
import { FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi'
import ProgramActivity from '@/components/program/ProgramActivity'
import { SuggestionCategory, Suggestion } from '@/types/suggestion'

interface SavedProgram {
  id: string
  formData: FormData
  activities: Suggestion[]
  createdAt: string
}

interface GroupedActivities {
  [key: string]: Suggestion[]
}

const CATEGORY_ICONS: Record<string, string> = {
  'Romantique': '💑',
  'Culture': '🎨',
  'Gastronomie': '🍽️',
  'Nature': '🌿',
  'Shopping': '🛍️',
  'Sport': '⚽',
  'Fête': '🎉',
  'Détente': '🧘‍♀️',
  'Aventure': '🏃‍♂️'
}

const ProgramPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [program, setProgram] = useState<SavedProgram | null>(null)

  useEffect(() => {
    const loadProgram = () => {
      try {
        const savedPrograms = localStorage.getItem('savedPrograms')
        if (!savedPrograms) {
          router.push('/dashboard')
          return
        }

        const programs = JSON.parse(savedPrograms)
        const currentProgram = programs.find((p: any) => p.id === params.id)

        if (!currentProgram) {
          router.push('/dashboard')
          return
        }

        setProgram(currentProgram)
        setIsLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement du programme:', error)
        router.push('/dashboard')
      }
    }

    loadProgram()
  }, [params.id, router])

  const handleDeleteActivity = (activityId: string) => {
    if (!program) return

    const updatedActivities = program.activities.filter(
      (activity: any) => activity.id !== activityId
    )

    const updatedProgram = { ...program, activities: updatedActivities }
    setProgram(updatedProgram)

    // Mise à jour dans le localStorage
    const savedPrograms = localStorage.getItem('savedPrograms')
    if (savedPrograms) {
      const programs = JSON.parse(savedPrograms)
      const updatedPrograms = programs.map((p: any) =>
        p.id === params.id ? updatedProgram : p
      )
      localStorage.setItem('savedPrograms', JSON.stringify(updatedPrograms))
    }
  }

  const groupActivitiesByCategory = (activities: Suggestion[]): GroupedActivities => {
    return activities.reduce((groups, activity) => {
      const category = activity.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(activity)
      return groups
    }, {} as GroupedActivities)
  }

  const calculateTotalBudget = (activities: Suggestion[]): number => {
    return activities.reduce((total, activity) => total + activity.price, 0)
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBackButton />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">Chargement...</p>
        </main>
      </div>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const groupedActivities = groupActivitiesByCategory(program.activities)
  const totalBudget = calculateTotalBudget(program.activities)

  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : program ? (
          <>
            <div className="bg-white shadow-sm rounded-xl p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Votre programme pour {program.formData.destination}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <p className="flex items-center gap-2">
                  <FiClock className="text-indigo-500" />
                  Du {formatDate(program.formData.startDate)} au {formatDate(program.formData.endDate)}
                </p>
                <p className="flex items-center gap-2">
                  <FiDollarSign className="text-indigo-500" />
                  Budget total : {totalBudget}€
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {Object.entries(groupedActivities).map(([category, activities]) => (
                <div key={category} className="bg-white shadow-sm rounded-xl overflow-hidden">
                  <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <span>{CATEGORY_ICONS[category] || '🎯'}</span>
                      {category}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        ({activities.length} activité{activities.length > 1 ? 's' : ''})
                      </span>
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {activities.map((activity) => (
                      <ProgramActivity
                        key={activity.id}
                        activity={activity}
                        onDelete={handleDeleteActivity}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </main>
    </div>
  )
}

export default ProgramPage 