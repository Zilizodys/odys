'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Activity } from '@/types/activity'
import ProgramCard from '@/components/ProgramCard'

interface Program {
  id: string
  user_id: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  companion: string
  activities: Activity[]
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPrograms = async () => {
      const supabase = createClient()
      
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?redirect=/dashboard')
        return
      }

      // Charger les programmes
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors du chargement des programmes:', error)
        return
      }

      setPrograms(data || [])
      setIsLoading(false)
    }

    loadPrograms()
  }, [router])

  const handleDeleteProgram = async (programId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId)

      if (error) throw error

      setPrograms(programs.filter(p => p.id !== programId))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Une erreur est survenue lors de la suppression.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos programmes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Mes programmes</h1>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
              {programs.length} programme{programs.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 mb-4">Vous n'avez pas encore de programme enregistré.</p>
            <button
              onClick={() => router.push('/generate')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Créer mon premier programme
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {programs.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onDelete={handleDeleteProgram}
                />
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <button
                onClick={() => router.push('/generate')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                Créer un nouveau programme
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
} 