import { createClient } from '@/lib/supabase/client'
import { Activity } from '@/types/activity'
import { FormData } from '@/types/form'

export const getActivitiesByCriteria = async (formData: FormData): Promise<Record<string, Activity[]>> => {
  const supabase = createClient()
  
  // Récupérer les activités déjà sélectionnées
  let savedActivityIds = new Set<string>()
  if (typeof window !== 'undefined') {
    let savedActivities: Activity[] = []
    const saved = localStorage.getItem('savedActivities')
    if (saved) {
      try {
        savedActivities = JSON.parse(saved)
      } catch (error) {
        console.error('Erreur lors de la lecture des activités sauvegardées:', error)
      }
    }
    savedActivityIds = new Set(savedActivities.map(a => a.id))
  }

  // Récupérer toutes les activités pour la destination (insensible à la casse)
  const { data: activities, error } = await supabase
    .from('activities')
    .select('id, title, description, price, address, imageurl, category, city, created_at, updated_at')
    .ilike('city', `%${formData.destination}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors de la récupération des activités:', error)
    return {}
  }

  const moods = formData.moods || []
  const budget = formData.budget || Infinity
  const isFree = formData.budget === 0
  const companion = formData.companion

  // Mapping anglais -> français pour les moods élargi
  const moodMap: Record<string, string[]> = {
    cultural: ['culture', 'art', 'musée', 'exposition', 'histoire', 'monument', 'architecture'],
    food: ['gastronomie', 'restaurant', 'street food', 'cuisine', 'bistrot', 'café'],
    sport: ['sport', 'sports extrêmes', 'activité physique', 'fitness', 'randonnée'],
    nature: ['nature', 'randonnée', 'parc', 'jardin', 'plage', 'montagne', 'forêt'],
    romantic: ['romantique', 'couple', 'gastronomie', 'restaurant'],
    bar: ['bar', 'vie nocturne', 'pub', 'café'],
    restaurant: ['restaurant', 'gastronomie', 'bistrot', 'cuisine'],
    art: ['art', 'exposition', 'musée', 'galerie', 'culture'],
    shopping: ['shopping', 'boutique', 'marché', 'centre commercial'],
    party: ['vie nocturne', 'bar', 'club', 'discothèque', 'concert'],
    wellness: ['bien-être', 'spa', 'détente', 'massage', 'yoga'],
    relaxation: ['nature', 'détente', 'bien-être', 'spa', 'parc', 'jardin'],
    nightlife: ['vie nocturne', 'bar', 'club', 'discothèque', 'concert', 'pub', 'café', 'rooftop', 'speakeasy'],
    entertainment: ['vie nocturne', 'bar', 'club', 'concert', 'spectacle', 'théâtre']
  }
  // On aplatit tous les moods sélectionnés en une seule liste de catégories cibles
  const normalizedMoods = moods.flatMap((m: string) => {
    const key = m.trim().toLowerCase()
    return moodMap[key] || [key]
  })

  const filteredActivities = activities.filter(
    act => {
      const city = act.city.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
      const matchCity = city.includes(formData.destination.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim())
      
      const category = act.category ? act.category.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim() : ''
      const matchCategory = normalizedMoods.length === 0 || normalizedMoods.some(mood => {
        const normalizedMood = mood.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
        const directMatch = category.includes(normalizedMood) || normalizedMood.includes(category)
        const mappedMatch = Object.entries(moodMap).some(([key, values]) => {
          if (key.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim() === normalizedMood) {
            return values.some(value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim().includes(category) || category.includes(value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()))
          }
          return false
        })
        
        return directMatch || mappedMatch
      })

      const matchBudget = isFree
        ? (typeof act.price === 'number' ? act.price === 0 : false)
        : (typeof act.price === 'number' ? act.price <= budget : true)
      const notAlreadySelected = !savedActivityIds.has(act.id)

      return matchCity && matchCategory && matchBudget && notAlreadySelected
    }
  )

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