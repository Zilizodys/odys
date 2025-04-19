import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

// Fonction pour obtenir le client Supabase
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variables d\'environnement Supabase manquantes')
  }

  return createClient(supabaseUrl, supabaseKey)
}

async function main() {
  try {
    // Initialiser le client Supabase
    const supabase = getSupabaseClient()

    // Récupérer toutes les activités
    const { data: activities, error } = await supabase
      .from('activities')
      .select('id, imageurl')

    if (error) {
      throw error
    }

    if (!activities || activities.length === 0) {
      console.log('Aucune activité trouvée')
      return
    }

    console.log(`${activities.length} activités trouvées`)

    // Lire le contenu du dossier des images
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'activities')
    const files = fs.readdirSync(imagesDir)
      .filter(file => file !== 'Mascot.png' && file.endsWith('.jpg'))

    console.log(`${files.length} images trouvées dans le dossier`)

    // Mettre à jour chaque activité avec une image aléatoire
    for (const activity of activities) {
      // Sélectionner une image aléatoire
      const randomImage = files[Math.floor(Math.random() * files.length)]
      const newImageUrl = `/images/activities/${randomImage}`

      // Mettre à jour l'URL de l'image dans la base de données
      const { error: updateError } = await supabase
        .from('activities')
        .update({ imageurl: newImageUrl })
        .eq('id', activity.id)

      if (updateError) {
        console.error(`Erreur lors de la mise à jour de l'activité ${activity.id}:`, updateError)
        continue
      }

      console.log(`Activité ${activity.id} mise à jour avec l'image ${randomImage}`)
    }

    console.log('Mise à jour terminée avec succès')
  } catch (error) {
    console.error('Erreur lors de la mise à jour des images:', error)
    process.exit(1)
  }
}

main() 