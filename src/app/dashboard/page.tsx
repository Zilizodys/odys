'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Activity } from '@/types/activity'
import ProgramCard from '@/components/ProgramCard'
import { Program } from '@/types/program'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [programs, setPrograms] = useState<Program[]>([])
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          router.replace('/login')
          return
        }

        // Charger les programmes de l'utilisateur avec leurs activités
        const { data: userPrograms, error: programsError } = await supabase
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
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (programsError) throw programsError

        // Transformer les données pour avoir les activités directement dans le programme
        const transformedPrograms = userPrograms?.map(program => ({
          ...program,
          activities: program.program_activities?.map((pa: any) => pa.activities) || []
        })) || []

        setPrograms(transformedPrograms)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const handleDeleteProgram = async (programId: string) => {
    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId)

      if (error) throw error

      setPrograms(programs.filter(p => p.id !== programId))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Une erreur est survenue lors de la suppression du programme.')
    }
  }

  const handleProgramClick = (programId: string) => {
    router.push(`/program/${programId}`)
  }

  if (loading) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes programmes</h1>
          <p className="text-gray-500">
            {programs.length} programme{programs.length > 1 ? 's' : ''} sauvegardé{programs.length > 1 ? 's' : ''}
          </p>
        </div>
        
        {programs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Image
              src="/images/activities/Mascot.png"
              alt="Mascotte"
              width={150}
              height={150}
              className="mx-auto mb-6"
            />
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
                  onClick={(programId) => handleProgramClick(programId)}
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