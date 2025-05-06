import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY!

const DESTINATIONS = [
  { city: 'Paris', country: 'France' },
  { city: 'Rome', country: 'Italie' },
  { city: 'Barcelone', country: 'Espagne' },
  { city: 'Londres', country: 'Royaume-Uni' },
  { city: 'New York', country: 'États-Unis' },
]

const CATEGORIES = [
  { name: 'art_gallery', label: 'culture' },
  { name: 'cafe', label: 'gastronomie' },
  { name: 'bar', label: 'vie nocturne' },
  { name: 'garden', label: 'nature' },
  { name: 'beach', label: 'nature' },
  { name: 'zoo', label: 'nature' },
  { name: 'aquarium', label: 'nature' },
  { name: 'stadium', label: 'sport' },
  { name: 'gym', label: 'sport' },
  { name: 'market', label: 'shopping' },
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function getPlaces(city: string, type: string, priceLevel: number | null = null, limit = 20) {
  try {
    let query = `${type} in ${city}`
    if (priceLevel !== null) {
      query += ` price_level=${priceLevel}`
    }
    
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`
    const res = await fetch(url)
    const data = await res.json()
    
    await delay(2000)
    
    return (data.results || []).slice(0, limit)
  } catch (error) {
    console.error(`Erreur lors de la récupération des lieux pour ${city}, ${type}:`, error)
    return []
  }
}

function getPhotoUrl(photoRef: string) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`
}

async function checkActivityExists(title: string, address: string) {
  const { data } = await supabase
    .from('activities')
    .select('id')
    .eq('title', title)
    .eq('address', address)
    .single()
  return !!data
}

async function insertActivity(activity: any) {
  try {
    const exists = await checkActivityExists(activity.title, activity.address)
    if (exists) {
      console.log(`Activité déjà existante: ${activity.title} (${activity.city})`)
      return false
    }

    const { error } = await supabase.from('activities').insert([activity])
    if (error) {
      console.error('Erreur insertion:', error, activity)
      return false
    } else {
      console.log(`Ajouté: ${activity.title} (${activity.city}, ${activity.category}, ${activity.price_range})`)
      return true
    }
  } catch (error) {
    console.error(`Erreur lors de l'insertion de ${activity.title}:`, error)
    return false
  }
}

async function seed() {
  console.log('Début du seed...')
  let totalAdded = 0
  let totalSkipped = 0

  for (const dest of DESTINATIONS) {
    console.log(`\nTraitement de ${dest.city}...`)
    
    for (const cat of CATEGORIES) {
      console.log(`\nCatégorie: ${cat.label}...`)
      
      for (let priceLevel = 0; priceLevel <= 3; priceLevel++) {
        const priceRange = ['Gratuit', 'Économique', 'Modéré', 'Confort'][priceLevel]
        console.log(`\nBudget: ${priceRange}...`)
        
        const places = await getPlaces(dest.city, cat.name, priceLevel, 10)
        
        for (const place of places) {
          const activity = {
            title: place.name,
            description: place.types ? place.types.join(', ') : '',
            price: priceLevel * 10,
            address: place.formatted_address || '',
            imageurl: place.photos && place.photos.length > 0 ? getPhotoUrl(place.photos[0].photo_reference) : '',
            category: cat.label,
            city: dest.city,
            price_range: priceRange,
            booking_link: place.website || '',
            source: 'google_places',
            duration: '02:00:00',
          }
          
          const added = await insertActivity(activity)
          if (added) totalAdded++
          else totalSkipped++
        }
      }
    }
  }
  
  console.log('\nSeed terminé !')
  console.log(`Total ajouté: ${totalAdded}`)
  console.log(`Total ignoré: ${totalSkipped}`)
}

seed()