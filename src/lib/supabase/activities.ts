import { createClient } from '@/lib/supabase/client'
import { Activity } from '@/types/activity'
import { FormData } from '@/types/form'

export const getActivitiesByCriteria = async (formData: FormData): Promise<Record<string, Activity[]>> => {
  const supabase = createClient()
  
  // Log de debug
  console.log('Recherche d\'activités pour la destination :', formData.destination)

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
    console.log('Activités déjà sélectionnées:', savedActivityIds)
  }

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

  // Fonction utilitaire pour normaliser les chaînes (sans accents, minuscules)
  const normalize = (str: string) =>
    (str || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

  const normalizedDest = normalize(formData.destination)
  const moods = formData.moods || []
  const budget = formData.budget || Infinity
  const isFree = formData.budget === 0
  const companion = formData.companion
  console.log('moods reçus :', moods)
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
  console.log('moods normalisés (après mapping élargi) :', normalizedMoods)

  // Log des paramètres de recherche
  console.log('Paramètres de recherche:', {
    destination: formData.destination,
    normalizedDest,
    moods,
    normalizedMoods,
    budget,
    isFree,
    companion
  })

  // Log des activités brutes
  console.log('Nombre total d\'activités avant filtrage:', activities.length)

  const filteredActivities = activities.filter(
    act => {
      const city = normalize(act.city)
      const matchCity = city.includes(normalizedDest) || normalizedDest.includes(city)
      
      const category = act.category ? normalize(act.category) : ''
      const matchCategory = normalizedMoods.length === 0 || normalizedMoods.some(mood => {
        const normalizedMood = normalize(mood)
        const directMatch = category.includes(normalizedMood) || normalizedMood.includes(category)
        const mappedMatch = Object.entries(moodMap).some(([key, values]) => {
          if (normalize(key) === normalizedMood) {
            return values.some(value => normalize(value).includes(category) || category.includes(normalize(value)))
          }
          return false
        })
        
        // Log détaillé du processus de matching des catégories
        console.log('Détails du matching de catégorie:', {
          activity: act.title,
          category,
          mood: normalizedMood,
          directMatch,
          mappedMatch,
          matched: directMatch || mappedMatch
        })
        
        return directMatch || mappedMatch
      })

      const matchBudget = isFree
        ? (typeof act.price === 'number' ? act.price === 0 : false)
        : (typeof act.price === 'number' ? act.price <= budget : true)
      const matchCompanion = !companion || !act.companion || act.companion === companion
      const notAlreadySelected = !savedActivityIds.has(act.id)

      // Log détaillé du filtrage
      console.log('Résultat du filtrage pour:', act.title, {
        city,
        matchCity,
        category,
        matchCategory,
        price: act.price,
        matchBudget,
        companion: act.companion,
        matchCompanion,
        notAlreadySelected,
        accepted: matchCity && matchCategory && matchBudget && matchCompanion && notAlreadySelected
      })

      return matchCity && matchCategory && matchBudget && matchCompanion && notAlreadySelected
    }
  )

  // Log du résultat final
  console.log('Nombre d\'activités après filtrage:', filteredActivities.length)
  console.log('Activités retenues:', filteredActivities.map(act => ({
    id: act.id,
    title: act.title,
    category: act.category,
    city: act.city
  })))

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