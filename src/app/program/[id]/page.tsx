import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'
import { notFound } from 'next/navigation'
import ProgramClient from './ProgramClient'
import type { Activity } from '@/types/activity'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ActivityResponse {
  id: string
  title: string
  description: string
  price: number
  address: string
  imageurl: string
  category: string
  city: string
}

interface ProgramActivityResponse {
  activity: ActivityResponse
}

async function getProgram(id: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: program, error: programError } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single()

  if (programError || !program) {
    if (programError?.code === 'PGRST116') {
      return null
    }
    throw programError
  }

  const { data: programActivities, error: activitiesError } = await supabase
    .from('program_activities')
    .select(`
      activity:activities (
        id,
        title,
        description,
        price,
        address,
        imageurl,
        category,
        city
      )
    `)
    .eq('program_id', id)
    .order('order_index')

  if (activitiesError) {
    throw activitiesError
  }

  const activities = programActivities?.map(pa => pa.activity) || []

  // Enrichir le programme avec coverImage depuis destinations si absent
  let coverImage = program.coverImage || program.cover_image
  if (!coverImage) {
    // Chercher l'image dans la table destinations
    const { data: destData } = await supabase
      .from('destinations')
      .select('city, imageurl')
      .eq('city', program.destination)
      .single()
    coverImage = destData?.imageurl || '/images/activities/Mascot.png'
  }

  return {
    ...program,
    activities,
    coverImage
  }
}

export default async function ProgramPage({ params }: { params: { id: string } }) {
  const program = await getProgram(params.id)

  if (!program) {
    notFound()
  }

  return <ProgramClient initialProgram={program} />
} 