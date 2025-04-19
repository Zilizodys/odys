import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'
import { notFound } from 'next/navigation'
import ProgramClient from './ProgramClient'

export const dynamic = 'force-dynamic'

async function getProgram(id: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: rawProgramData, error: programError } = await supabase
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
    .eq('id', id)
    .single()

  if (programError) {
    if (programError.code === 'PGRST116') {
      return null
    }
    throw programError
  }

  if (!rawProgramData) {
    return null
  }

  // Transformer les données pour avoir les activités directement dans le programme
  return {
    ...rawProgramData,
    activities: rawProgramData.program_activities?.map(pa => pa.activities) || []
  }
}

export default async function ProgramPage({ params }: { params: { id: string } }) {
  const program = await getProgram(params.id)

  if (!program) {
    notFound()
  }

  return <ProgramClient initialProgram={program} />
} 