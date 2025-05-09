import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

if (!supabaseUrl || !supabaseAnonKey || !GOOGLE_API_KEY) {
  throw new Error('Missing environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'public' }
})

const POPULAR_CITIES = [
  { name: 'Paris', country: 'France' },
  { name: 'Rome', country: 'Italie' },
  { name: 'Barcelone', country: 'Espagne' },
  { name: 'Londres', country: 'Royaume-Uni' },
  { name: 'New York', country: 'États-Unis' },
  { name: 'Tokyo', country: 'Japon' },
  { name: 'Dubaï', country: 'Émirats Arabes Unis' },
  { name: 'Sydney', country: 'Australie' },
  { name: 'Istanbul', country: 'Turquie' },
  { name: 'Rio de Janeiro', country: 'Brésil' },
  { name: 'Bruxelles', country: 'Belgique' }
]

const PLACE_TYPES = [
  'restaurant', 'bar', 'museum', 'night_club', 'park', 'cafe', 'art_gallery', 'shopping_mall', 'tourist_attraction', 'zoo', 'stadium', 'amusement_park', 'spa', 'library', 'book_store', 'bakery', 'movie_theater', 'gym', 'casino', 'bowling_alley', 'aquarium'
]

const MAX_PER_CITY = 500
const BATCH_SIZE = 50

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchPlaces(city: string, country: string, type: string, maxResults = 60) {
  let results: any[] = []
  let nextPageToken: string | undefined = undefined
  let fetched = 0
  let page = 0
  do {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(type + ' in ' + city + ', ' + country)}&type=${type}&key=${GOOGLE_API_KEY}`
    if (nextPageToken) url += `&pagetoken=${nextPageToken}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error(`Erreur Google Places (${city}, ${type}, page ${page}):`, data.status, data.error_message)
      break
    }
    if (data.results) {
      results = results.concat(data.results)
      fetched += data.results.length
    }
    nextPageToken = data.next_page_token
    page++
    if (nextPageToken) await sleep(2000) // Google impose d'attendre 2s
  } while (nextPageToken && fetched < maxResults)
  return results.slice(0, maxResults)
}

function deduplicateActivities(activities: any[]) {
  const seen = new Set()
  return activities.filter(act => {
    const key = (act.place_id || (act.name + '|' + act.city + '|' + (act.address || ''))).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function mapPlaceToActivity(place: any, city: string): any {
  return {
    title: place.name,
    description: place.types ? place.types.join(', ') : '',
    price: place.price_level ? place.price_level * 10 : 0,
    address: place.formatted_address || place.vicinity || '',
    imageurl: place.photos && place.photos.length > 0
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
      : '',
    category: place.types && place.types.length > 0 ? place.types[0] : '',
    city: city.toLowerCase(),
    price_range: place.price_level ? '€'.repeat(place.price_level) : 'gratuit',
    place_id: place.place_id || ''
  }
}

async function seedActivities() {
  try {
    // Supprimer toutes les activités existantes
    const { error: deleteError } = await supabase
      .from('activities')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    if (deleteError) {
      console.error('Error deleting existing activities:', deleteError)
      return
    }

    for (const cityObj of POPULAR_CITIES) {
      console.log(`\n=== Ville : ${cityObj.name} (${cityObj.country}) ===`)
      let allActivities: any[] = []
      for (const type of PLACE_TYPES) {
        console.log(`  → Recherche type : ${type}...`)
        const places = await fetchPlaces(cityObj.name, cityObj.country, type, 60)
        console.log(`    → ${places.length} résultats trouvés pour ${type}`)
        allActivities = allActivities.concat(places.map(p => mapPlaceToActivity(p, cityObj.name)))
        await sleep(500)
      }
      // Déduplication
      allActivities = deduplicateActivities(allActivities)
      console.log(`  → Total après déduplication : ${allActivities.length}`)
      // Limite à 500 par ville
      allActivities = allActivities.slice(0, MAX_PER_CITY)
      // Insertion en batch
      for (let i = 0; i < allActivities.length; i += BATCH_SIZE) {
        const batch = allActivities.slice(i, i + BATCH_SIZE)
        console.log(`    → Insertion batch ${i/BATCH_SIZE+1} (${batch.length} activités)...`)
        const { error } = await supabase.from('activities').insert(batch)
        if (error) {
          console.error('Error inserting batch:', error)
          throw error
        }
        await sleep(300)
      }
      console.log(`✔️  ${allActivities.length} activités insérées pour ${cityObj.name}`)
    }
    console.log('\n✅ Activities seeded successfully!')
  } catch (error) {
    console.error('Error seeding activities:', error)
  }
}

seedActivities() 