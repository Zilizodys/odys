import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedDestinations() {
  // Récupérer toutes les villes uniques depuis activities
  const { data: activities, error } = await supabase
    .from('activities')
    .select('city')
  
  if (error) {
    console.error('Erreur récupération activities:', error)
    return
  }
  if (!activities) {
    console.log('Aucune activité trouvée.')
    return
  }

  // Filtrer les villes uniques
  const uniqueCities = new Set<string>()
  for (const act of activities) {
    if (act.city) {
      uniqueCities.add(act.city)
    }
  }

  // Insérer dans destinations
  for (const city of uniqueCities) {
    const { error: insertError } = await supabase
      .from('destinations')
      .insert([{ city }])
    if (insertError) {
      console.error(`Erreur insertion pour ${city}:`, insertError)
    } else {
      console.log(`Ajouté: ${city}`)
    }
  }
  console.log('Seed terminé !')
}

seedDestinations() 