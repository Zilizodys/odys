import { createClient } from '@/lib/supabase/client'
import { Activity } from '@/types/activity'
import { FormData } from '@/types/form'

export const getActivitiesByCriteria = async (formData: FormData): Promise<Record<string, Activity[]>> => {
  const supabase = createClient()
  
  // Log de debug
  console.log('Recherche d\'activités pour la destination :', formData.destination)

  // Récupérer toutes les activités pour la destination (insensible à la casse)
  const { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .ilike('city', `%${formData.destination}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors de la récupération des activités:', error)
    return {}
  }

  console.log('Activités brutes récupérées :', activities)

  // Filtrage JS plus souple sur la ville (includes)
  const normalizedDest = formData.destination.trim().toLowerCase()
  const moods = formData.moods || []
  const budget = formData.budget || Infinity
  const isFree = formData.budget === 0
  const companion = formData.companion
  console.log('moods reçus :', moods)
  // Mapping anglais -> français pour les moods
  const moodMap: Record<string, string> = {
    cultural: 'culture',
    food: 'gastronomie',
    sport: 'sport',
    nature: 'nature',
    romantic: 'romantique',
    bar: 'bar',
    restaurant: 'restaurant',
    art: 'art',
    shopping: 'shopping',
    // Ajoute d'autres mappings si besoin
  }
  const normalizedMoods = moods.map((m: string) => {
    const key = m.trim().toLowerCase()
    return moodMap[key] || key
  })
  console.log('moods normalisés (après mapping) :', normalizedMoods)

  const filteredActivities = activities.filter(
    act => {
      const city = act.city ? act.city.trim().toLowerCase() : ''
      const matchCity = city === normalizedDest
      const category = act.category ? act.category.trim().toLowerCase() : ''
      const matchCategory = normalizedMoods.length === 0 || normalizedMoods.includes(category)
      const matchBudget = isFree
        ? (typeof act.price === 'number' ? act.price === 0 : false)
        : (typeof act.price === 'number' ? act.price <= budget : true)
      const matchCompanion = !companion || !act.companion || act.companion === companion
      console.log('Filtrage activité:', { city, matchCity, category, matchCategory, moods: normalizedMoods, price: act.price, matchBudget, companion: act.companion, matchCompanion })
      return matchCity && matchCategory && matchBudget && matchCompanion
    }
  )

  console.log('Activités filtrées :', filteredActivities)
  filteredActivities.forEach(act => {
    console.log('[DEBUG ACTIVITÉ]', {
      id: act.id,
      city: act.city,
      address: act.address || act.location,
      category: act.category,
      title: act.title
    })
  })

  // Grouper les activités par catégorie
  const activitiesByCategory = filteredActivities.reduce((acc, activity) => {
    const category = activity.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(activity)
    return acc
  }, {} as Record<string, Activity[]>)

  // Limiter à 10 activités par catégorie
  Object.keys(activitiesByCategory).forEach(category => {
    activitiesByCategory[category] = activitiesByCategory[category].slice(0, 10)
  })

  return activitiesByCategory
} 