import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

// Correction pour ES module : obtenir le chemin du dossier courant
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

console.log('Clé Google Places chargée :', process.env.GOOGLE_PLACES_API_KEY ? 'OK' : 'NON TROUVÉE')

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!

// Liste de 30 grandes villes françaises
const DESTINATIONS = [
  { city: 'Paris', country: 'France' },
  { city: 'Marseille', country: 'France' },
  { city: 'Lyon', country: 'France' },
  { city: 'Toulouse', country: 'France' },
  { city: 'Nice', country: 'France' },
  { city: 'Nantes', country: 'France' },
  { city: 'Montpellier', country: 'France' },
  { city: 'Strasbourg', country: 'France' },
  { city: 'Bordeaux', country: 'France' },
  { city: 'Lille', country: 'France' },
  { city: 'Rennes', country: 'France' },
  { city: 'Bruxelles', country: 'Belgique' },
  { city: 'Amsterdam', country: 'Pays-Bas' },
  { city: 'Berlin', country: 'Allemagne' },
  { city: 'Munich', country: 'Allemagne' },
  { city: 'Vienne', country: 'Autriche' },
  { city: 'Prague', country: 'République Tchèque' },
  { city: 'Budapest', country: 'Hongrie' },
  { city: 'Rome', country: 'Italie' },
  { city: 'Milan', country: 'Italie' },
  { city: 'Florence', country: 'Italie' },
  { city: 'Madrid', country: 'Espagne' },
  { city: 'Barcelone', country: 'Espagne' },
  { city: 'Lisbonne', country: 'Portugal' },
  { city: 'Porto', country: 'Portugal' },
  { city: 'Londres', country: 'Royaume-Uni' },
  { city: 'Dublin', country: 'Irlande' },
  { city: 'Copenhague', country: 'Danemark' },
  { city: 'Stockholm', country: 'Suède' },
  { city: 'Oslo', country: 'Norvège' },
  { city: 'Zurich', country: 'Suisse' },
  { city: 'Genève', country: 'Suisse' },
  { city: 'Helsinki', country: 'Finlande' },
  { city: 'Bratislava', country: 'Slovaquie' },
  { city: 'Ljubljana', country: 'Slovénie' },
  { city: 'Tallinn', country: 'Estonie' },
  { city: 'Riga', country: 'Lettonie' },
  { city: 'Vilnius', country: 'Lituanie' },
  { city: 'Varsovie', country: 'Pologne' },
  { city: 'Cracovie', country: 'Pologne' },
  { city: 'Athènes', country: 'Grèce' },
  { city: 'Sofia', country: 'Bulgarie' },
  { city: 'Bucarest', country: 'Roumanie' },
  { city: 'Belgrade', country: 'Serbie' },
  { city: 'Zagreb', country: 'Croatie' },
  { city: 'Sarajevo', country: 'Bosnie-Herzégovine' },
  { city: 'Podgorica', country: 'Monténégro' },
  { city: 'Skopje', country: 'Macédoine du Nord' },
  { city: 'Tirana', country: 'Albanie' },
  { city: 'Luxembourg', country: 'Luxembourg' },
];

// Catégories variées et enrichies
const CATEGORIES = [
  { name: 'restaurant', label: 'gastronomie' },
  { name: 'museum', label: 'culture' },
  { name: 'art_gallery', label: 'art' },
  { name: 'park', label: 'nature' },
  { name: 'night_club', label: 'vie nocturne' },
  { name: 'bar', label: 'bar' },
  { name: 'stadium', label: 'sport' },
  { name: 'tourist_attraction', label: 'tourisme' },
  { name: 'spa', label: 'bien-être' },
  { name: 'shopping_mall', label: 'shopping' },
  { name: 'zoo', label: 'nature' },
  { name: 'amusement_park', label: 'divertissement' },
  { name: 'cafe', label: 'café' },
  { name: 'library', label: 'culture' },
  { name: 'movie_theater', label: 'divertissement' },
  { name: 'point_of_interest', label: 'insolite' },
];

const PRICE_LEVELS = [0, 1, 2, 3, 4];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface GooglePlacesResponse {
  status: string;
  results: Array<{
    name: string;
    formatted_address: string;
    types: string[];
    photos?: Array<{ photo_reference: string }>;
    website?: string;
    geometry?: {
      location: {
        lat: number;
        lng: number;
      };
    };
    price_level?: number;
  }>;
}

// Gestion du quota Google Places
const MAX_REQUESTS_PER_RUN = 2000;
let requestCount = 0;

function randomDelay(min = 2000, max = 5000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getPlaces(city: string, type: string, price: number) {
  if (requestCount >= MAX_REQUESTS_PER_RUN) {
    console.log('Limite de requêtes Google Places atteinte. Arrêt du script.');
    process.exit(0);
  }
  requestCount++;
  try {
    const query = `${type} in ${city}`
    console.log(`\n[${requestCount}/${MAX_REQUESTS_PER_RUN}] Requête Google Places: ${query} (prix: ${price})`)
    
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=${type}&minprice=${price}&maxprice=${price}&key=${GOOGLE_API_KEY}`
    console.log('URL:', url)
    
    const res = await fetch(url)
    const data = await res.json() as GooglePlacesResponse
    
    console.log('Status:', data.status)
    if (data.status !== 'OK') {
      console.log('Erreur API:', data.status)
      return []
    }
    // Limiter à 10 résultats max
    const results = (data.results || []).slice(0, 10)
    console.log('Nombre de résultats:', results.length)
    await delay(randomDelay())
    return results
  } catch (error) {
    console.error('Erreur:', error)
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
      console.log(`Activité déjà existante: ${activity.title}`)
      return false
    }

    const { error } = await supabase.from('activities').insert([activity])
    if (error) {
      console.error('Erreur insertion:', error)
      return false
    } else {
      console.log(`Ajouté: ${activity.title}`)
      return true
    }
  } catch (error) {
    console.error(`Erreur lors de l'insertion de ${activity.title}:`, error)
    return false
  }
}

async function countActivities(city: string, category: string) {
  const { count } = await supabase
    .from('activities')
    .select('id', { count: 'exact', head: true })
    .eq('city', city)
    .eq('category', category)
  return count || 0
}

async function seed() {
  console.log('Début du seed global sur villes européennes, catégories enrichies, 5 gammes de prix...')
  let totalAdded = 0
  let totalSkipped = 0

  for (const dest of DESTINATIONS) {
    console.log(`\nTraitement de ${dest.city}...`)
    for (const cat of CATEGORIES) {
      const existing = await countActivities(dest.city, cat.label)
      if (existing >= 10) {
        console.log(`Déjà ${existing} activités pour ${dest.city} / ${cat.label}, on saute.`);
        continue;
      }
      for (const price of PRICE_LEVELS) {
        if (requestCount >= MAX_REQUESTS_PER_RUN) {
          console.log('Quota Google Places atteint. Arrêt du script.');
          console.log(`Total ajouté: ${totalAdded}`)
          console.log(`Total ignoré: ${totalSkipped}`)
          process.exit(0);
        }
        const places = await getPlaces(dest.city, cat.name, price)
        for (const place of places) {
          const priceLevel = place.price_level || 0
          const priceRange = ['Gratuit', 'Économique', 'Modéré', 'Confort', 'Luxe'][priceLevel]
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
            latitude: place.geometry?.location?.lat || null,
            longitude: place.geometry?.location?.lng || null,
          }
          const added = await insertActivity(activity)
          if (added) totalAdded++
          else totalSkipped++
        }
      }
    }
  }
  console.log(`\nSeed terminé. Total ajouté: ${totalAdded}, ignoré (doublons): ${totalSkipped}`)
}

seed()