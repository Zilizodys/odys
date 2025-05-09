import { createClient } from '@/lib/supabase/client'
import { Activity } from '@/types/activity'
import { FormData } from '@/types/form'
import { normalizeCategory } from '@/constants/categories'

// Ajout d'une fonction de normalisation pour la destination
function normalizeString(str: string) {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
}

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

  // Normaliser la destination avant la requête
  const normalizedDestination = normalizeString(formData.destination);

  // Récupérer toutes les activités pour la destination (insensible à la casse)
  const { data: activities, error } = await supabase
    .from('activities')
    .select('id, title, description, price, address, imageurl, category, city, created_at, updated_at, lat, lng')
    .ilike('city', `%${normalizedDestination}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors de la récupération des activités:', error)
    return {}
  }

  // Gestion du budget : on traduit le niveau en montant maximum
  let budget = Infinity;
  if (formData.budget === 0) budget = 0;
  else if (formData.budget === 1) budget = 10;
  else if (formData.budget === 2) budget = 30;
  else if (formData.budget === 3) budget = 100;
  const isFree = formData.budget === 0;

  const moods = formData.moods || []
  const companion = formData.companion

  // Mapping anglais -> français pour les moods élargi
  const moodMap: Record<string, string[]> = {
    cultural: ['culture', 'Culture', 'art', 'Art', 'musée', 'Musée', 'exposition', 'histoire', 'monument', 'architecture', 'musee', 'Musee'],
    food: ['gastronomie', 'Gastronomie', 'restaurant', 'Restaurant', 'street food', 'cuisine', 'bistrot', 'café', 'Café'],
    sport: ['sport', 'Sport', 'sports extrêmes', 'activité physique', 'fitness', 'randonnée', 'aventure', 'Aventure'],
    nature: ['nature', 'Nature', 'randonnée', 'parc', 'jardin', 'plage', 'montagne', 'forêt', 'foret'],
    romantic: ['romantique', 'Romantique', 'couple', 'gastronomie', 'restaurant', 'détente', 'Détente'],
    bar: ['bar', 'Bar', 'vie nocturne', 'Vie nocturne', 'pub', 'café', 'Café', 'nuit', 'Nuit'],
    restaurant: ['restaurant', 'Restaurant', 'gastronomie', 'Gastronomie', 'bistrot', 'cuisine', 'café', 'Café'],
    art: ['art', 'Art', 'exposition', 'musée', 'Musée', 'galerie', 'culture', 'Culture', 'musee', 'Musee'],
    shopping: ['shopping', 'Shopping', 'boutique', 'marché', 'marche', 'centre commercial'],
    party: ['vie nocturne', 'Vie nocturne', 'bar', 'Bar', 'club', 'Club', 'discothèque', 'Discothèque', 'concert', 'Concert', 'nuit', 'Nuit'],
    wellness: ['bien-être', 'Bien-être', 'spa', 'Spa', 'détente', 'Détente', 'massage', 'yoga', 'bien-etre', 'Bien-etre'],
    relaxation: ['nature', 'Nature', 'détente', 'Détente', 'bien-être', 'Bien-être', 'spa', 'Spa', 'parc', 'jardin', 'bien-etre', 'Bien-etre'],
    nightlife: ['vie nocturne', 'Vie nocturne', 'bar', 'Bar', 'club', 'Club', 'discothèque', 'Discothèque', 'concert', 'Concert', 'pub', 'café', 'rooftop', 'speakeasy', 'nuit', 'Nuit'],
    entertainment: ['vie nocturne', 'Vie nocturne', 'bar', 'Bar', 'club', 'Club', 'concert', 'Concert', 'spectacle', 'théâtre', 'theatre']
  }

  // On aplatit tous les moods sélectionnés en une seule liste de catégories cibles
  const normalizedMoods = moods.flatMap((m: string) => {
    const key = m.trim().toLowerCase()
    return moodMap[key] || [key]
  })

  // Log des moods et catégories recherchées
  console.log('Moods demandés:', moods, 'Catégories recherchées:', normalizedMoods);
  if (activities.length > 0) {
    console.log("Exemple d'activité:", activities[0]);
  }

  const filteredActivities = activities.filter(
    act => {
      const price = typeof act.price === 'string' ? parseFloat(act.price) : act.price;
      if (typeof price !== 'number' || isNaN(price)) {
        console.log('Prix non numérique:', act.price, act);
      }
      const city = act.city.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
      const matchCity = city.includes(normalizedDestination);

      const category = act.category ? act.category.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim() : '';
      const matchCategory = normalizedMoods.length === 0 || normalizedMoods.some(mood => {
        const normalizedMood = normalizeString(mood)
        const normalizedCategory = normalizeString(category)
        // Correspondance souple
        const directMatch = normalizedCategory.includes(normalizedMood) || normalizedMood.includes(normalizedCategory)
        // Correspondance via mapping
        const mappedMatch = (moodMap[mood] || []).some(variation =>
          normalizeString(variation).includes(normalizedCategory) ||
          normalizedCategory.includes(normalizeString(variation))
        )
        // Log détaillé
        console.log('Comparaison:', { mood, normalizedMood, category, normalizedCategory, directMatch, mappedMatch, finalMatch: directMatch || mappedMatch })
        return directMatch || mappedMatch
      });

      const matchBudget = isFree
        ? (typeof price === 'number' ? price === 0 : false)
        : (typeof price === 'number' ? price <= budget : true);
      const notAlreadySelected = !savedActivityIds.has(act.id);

      if (!(matchCity && matchCategory && matchBudget && notAlreadySelected)) {
        console.log('Rejetée:', {cat: act.category, price: price, city: act.city, matchCity, matchCategory, matchBudget, notAlreadySelected});
      }

      return matchCity && matchCategory && matchBudget && notAlreadySelected;
    }
  );

  // Grouper les activités par catégorie normalisée
  const activitiesByCategory = filteredActivities.reduce((acc, activity) => {
    const category = normalizeCategory(activity.category)
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

  // Ajout d'un log pour debug
  console.log('Activités trouvées pour la ville:', activities.length, activities.map(a => ({cat: a.category, price: a.price, city: a.city})));

  return activitiesByCategory
} 