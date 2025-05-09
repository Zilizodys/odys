import { NextResponse } from 'next/server'
import { getActivitiesByCriteria } from '@/lib/supabase/activities'
import { FormData } from '@/types/form'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const formData: FormData = {
      destination: body.destination,
      moods: body.moods,
      budget: body.budget,
      companion: body.companion || 'solo',
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }

    const activities = await getActivitiesByCriteria(formData)
    return NextResponse.json(activities)
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération des activités' }, { status: 500 })
  }
} 