export interface Activity {
  id: string
  title: string
  description: string
  price: number
  address: string
  imageurl: string
  category: string
  city: string
  lat: number
  lng: number
  duration?: string
  created_at?: string
  updated_at?: string
  booking_url?: string
  categories?: string[]
}

// Fonction utilitaire pour s'assurer que l'URL de l'image est correcte
export function getActivityImageUrl(activity: Activity): string {
  return activity.imageurl || '/images/activities/Mascot.png'
} 