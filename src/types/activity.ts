export interface Activity {
  id: string
  title: string
  description: string
  price: number
  address: string
  imageurl: string
  category: string
  city: string
  duration?: string
  created_at?: string
  updated_at?: string
}

// Fonction utilitaire pour s'assurer que l'URL de l'image est correcte
export function getActivityImageUrl(imageurl: string): string {
  if (imageurl.startsWith('http')) {
    return imageurl;
  }
  
  // Si c'est juste un nom de fichier, on ajoute le chemin complet
  if (!imageurl.startsWith('/')) {
    return `/images/activities/${imageurl}`;
  }
  
  return imageurl;
} 