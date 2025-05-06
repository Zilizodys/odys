'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Activity } from '@/types/activity'
import ProgramCard, { ProgramCardProps } from '@/components/ProgramCard'
import { Program } from '@/types/program'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [programs, setPrograms] = useState<Program[]>([])
  const [destinations, setDestinations] = useState<{ city: string, imageurl: string }[]>([])
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Fonction de normalisation des noms de villes
  const normalizeCityName = (city: string) => {
    return city?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
  }

  // Mapping des images par défaut pour chaque ville
  const defaultCityImages: { [key: string]: string } = {
    'paris': '/images/destinations/paris.jpg',
    'lyon': '/images/destinations/lyon.jpg',
    'marseille': '/images/destinations/marseille.jpg',
    'rome': '/images/destinations/rome.jpg',
    'toulouse': '/images/destinations/toulouse.jpg',
    'bordeaux': '/images/destinations/bordeaux.jpg',
    'nice': '/images/destinations/nice.jpg',
    'lille': '/images/destinations/lille.jpg',
    'nantes': '/images/destinations/nantes.jpg',
    'strasbourg': '/images/destinations/strasbourg.jpg',
    'montpellier': '/images/destinations/montpellier.jpg',
    'barcelone': '/images/destinations/barcelone.jpg',
    'madrid': '/images/destinations/madrid.jpg',
    'lisbonne': '/images/destinations/lisbonne.jpg',
    'porto': '/images/destinations/porto.jpg',
    'amsterdam': '/images/destinations/amsterdam.jpg',
    'berlin': '/images/destinations/berlin.jpg',
    'munich': '/images/destinations/munich.jpg',
    'vienne': '/images/destinations/vienne.jpg',
    'prague': '/images/destinations/prague.jpg',
    'budapest': '/images/destinations/budapest.jpg',
    'venise': '/images/destinations/venise.jpg',
    'florence': '/images/destinations/florence.jpg',
    'milan': '/images/destinations/milan.jpg',
    'dubai': '/images/destinations/dubai.jpg',
    'istanbul': '/images/destinations/istanbul.jpg'
  }

  useEffect(() => {
    const fetchDestinations = async () => {
      console.log('Début du fetch des destinations')
      
      // D'abord, vérifions la structure de la table
      const { data: tableInfo, error: tableError } = await supabase
        .from('destinations')
        .select('*')
        .limit(1)
      
      console.log('Structure de la table:', tableInfo)
      console.log('Erreur table:', tableError)

      // Ensuite, récupérons toutes les destinations
      const { data, error } = await supabase
        .from('destinations')
        .select('city, imageurl')
      
      console.log('Erreur complète:', error)
      console.log('Données brutes des destinations:', data)
      
      if (error) {
        console.error('Erreur lors du chargement des destinations:', error)
        return
      }
      
      if (data) {
        console.log('Nombre de destinations trouvées:', data.length)
        console.log('Exemple de destination:', JSON.stringify(data[0], null, 2))
        setDestinations(data)
      }
    }
    fetchDestinations()
  }, [])

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

  // Mapping ville → image avec normalisation et fallback
  const cityImageMap = Object.fromEntries(
    destinations.map(d => [
      normalizeCityName(d.city), 
      d.imageurl || defaultCityImages[normalizeCityName(d.city)] || '/images/activities/Mascot.png'
    ])
  )

  // Logs de débogage
  useEffect(() => {
    console.log('Destinations:', destinations)
    console.log('CityImageMap:', cityImageMap)
  }, [destinations])

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {programs.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={{
                    ...program,
                    coverImage:
                      destinations.find(
                        d => normalizeCityName(d.city) === normalizeCityName(program.destination)
                      )?.imageurl || '/images/activities/Mascot.png'
                  }}
                  onDelete={handleDeleteProgram}
                  onClick={handleProgramClick}
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