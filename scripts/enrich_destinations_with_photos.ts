import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY!

function getPhotoUrl(photoRef: string) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`
}

async function getPlacePhoto(city: string, country: string) {
  const query = `${city} ${country}`
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  if (data.results && data.results.length > 0 && data.results[0].photos && data.results[0].photos.length > 0) {
    return getPhotoUrl(data.results[0].photos[0].photo_reference)
  }
  return null
}

async function enrichDestinations() {
  const { data: destinations, error } = await supabase.from('destinations').select('*')
  if (error) {
    console.error('Erreur récupération destinations:', error)
    return
  }
  if (!destinations) {
    console.log('Aucune destination trouvée.')
    return
  }
  for (const dest of destinations) {
    if (dest.imageurl) {
      console.log(`Déjà enrichie: ${dest.city}`)
      continue
    }
    const photoUrl = await getPlacePhoto(dest.city, dest.country)
    if (photoUrl) {
      const { error: updateError } = await supabase
        .from('destinations')
        .update({ imageurl: photoUrl })
        .eq('id', dest.id)
      if (updateError) {
        console.error(`Erreur update pour ${dest.city}:`, updateError)
      } else {
        console.log(`Image ajoutée pour ${dest.city}: ${photoUrl}`)
      }
    } else {
      console.log(`Aucune image trouvée pour ${dest.city}`)
    }
    await new Promise(res => setTimeout(res, 1500)) // Pause pour l'API
  }
  console.log('Enrichissement terminé !')
}

enrichDestinations() 