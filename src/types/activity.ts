export interface Activity {
  id: string
  title: string
  description: string
  address: string
  price: number
  imageUrl: string
  duration?: string
  category?: string
}

// Fonction utilitaire pour s'assurer que l'URL de l'image est correcte
export function getActivityImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Si c'est juste un nom de fichier, on ajoute le chemin complet
  if (!imageUrl.startsWith('/')) {
    return `/images/activities/${imageUrl}`;
  }
  
  return imageUrl;
} 