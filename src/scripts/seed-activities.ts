import { createClient } from '@supabase/supabase-js'
import { activities } from '../data/activities'
import dotenv from 'dotenv'

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: '.env.local' })

interface Activity {
  title: string
  description: string
  price: number
  address: string
  imageurl: string
  category: string
  city: string
  price_range: string
}

// Assurez-vous d'avoir ces variables d'environnement configurées
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  }
})

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

    // Insérer les nouvelles activités
    for (const activity of activities) {
      const { error } = await supabase
        .from('activities')
        .insert([{
          title: activity.title,
          description: activity.description,
          price: Math.round(activity.price),
          address: activity.address,
          imageurl: activity.imageurl,
          category: activity.category,
          city: activity.city,
          price_range: activity.price_range
        }])

      if (error) {
        console.error('Error inserting activity:', activity.title, error)
        throw error
      }
    }

    console.log('Activities seeded successfully!')
  } catch (error) {
    console.error('Error seeding activities:', error)
  }
}

// Exécuter le script
seedActivities() 