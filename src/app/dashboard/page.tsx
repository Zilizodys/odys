'use client'

import { useRouter } from 'next/navigation'
import { FormData } from '@/types/form'
import { Activity } from '@/types/activity'
import Header from '@/components/Header'
import { FiTrash2 } from 'react-icons/fi'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface SavedProgram {
  id: string
  formData: FormData
  activities: Activity[]
  createdAt: string
}

export default function DashboardPage() {
  const [savedPrograms, setSavedPrograms] = useLocalStorage<SavedProgram[]>('savedPrograms', [])
  const router = useRouter()

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Date non définie'
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch (error) {
      console.error('Erreur de formatage de date:', error)
      return 'Date invalide'
    }
  }

  const handleDelete = (id: string) => {
    setSavedPrograms(prev => prev.filter(program => program.id !== id))
  }

  const validPrograms = savedPrograms.filter(program => 
    program && 
    program.id && 
    program.formData && 
    program.formData.destination &&
    Array.isArray(program.activities)
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes programmes</h1>
        
        <div suppressHydrationWarning>
          {validPrograms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-6">Vous n&apos;avez pas encore de programme enregistré</p>
              <button
                onClick={() => router.push('/generate')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Créer un programme
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {validPrograms.map((program) => (
                <div
                  key={program.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {program.formData.destination}
                      </h2>
                      <button
                        onClick={() => handleDelete(program.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <p suppressHydrationWarning>
                        Du {formatDate(program.formData.startDate)} au {formatDate(program.formData.endDate)}
                      </p>
                      <p>{program.formData.companion}</p>
                      <p>Budget: {program.formData.budget}€</p>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900">Activités:</p>
                      <p className="text-sm text-gray-500">{program.activities.length} activités planifiées</p>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => router.push(`/program/${program.id}`)}
                        className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Voir le détail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 