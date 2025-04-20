import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'
import { notFound } from 'next/navigation'
import ProgramClient from './ProgramClient'
import type { Activity } from '@/types/activity'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type ActivityResponse = Pick<Activity, 'id' | 'title' | 'description' | 'price' | 'address' | 'imageurl' | 'category' | 'city'>

interface ProgramActivity {
  activities: ActivityResponse[]
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
    `)
    .eq('program_id', id)

  if (activitiesError) {
    throw activitiesError
  }

  return {
    ...program,
    activities: (programActivities as ProgramActivity[])?.map(pa => pa.activities[0] as Activity) || []
  }
}

export default async function ProgramPage({ params }: { params: { id: string } }) {
  const program = await getProgram(params.id)

  if (!program) {
    notFound()
  }

  return <ProgramClient initialProgram={program} />
} 