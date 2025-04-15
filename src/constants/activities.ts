import { Activity } from '@/components/suggestions/ActivityCard'

export const MOCK_ACTIVITIES: Record<string, Activity[]> = {
  restaurant: [
    {
      id: 'rest1',
      title: 'Le Petit Bistrot',
      description: 'Une cuisine française authentique dans une ambiance chaleureuse et conviviale.',
      price: 45,
      duration: '2 heures',
      address: '15 rue de la Gastronomie',
      imageUrl: '/images/restaurant1.jpg',
      category: 'restaurant'
    },
    {
      id: 'rest2',
      title: 'Sushi Master',
      description: 'Les meilleurs sushis de la ville préparés devant vous par nos chefs experts.',
      price: 35,
      duration: '1.5 heures',
      address: '8 avenue des Saveurs',
      imageUrl: '/images/restaurant2.jpg',
      category: 'restaurant'
    },
    // ... ajouter 3 autres restaurants
  ],
  bar: [
    {
      id: 'bar1',
      title: 'Le Speakeasy',
      description: 'Bar à cocktails caché avec une ambiance des années 20 et des mixologistes talentueux.',
      price: 15,
      duration: '2 heures',
      address: '3 ruelle des Secrets',
      imageUrl: '/images/bar1.jpg',
      category: 'bar'
    },
    {
      id: 'bar2',
      title: 'Rooftop Vue',
      description: 'Bar en terrasse avec une vue imprenable sur la ville et des cocktails signature.',
      price: 20,
      duration: '3 heures',
      address: '42 rue du Panorama',
      imageUrl: '/images/bar2.jpg',
      category: 'bar'
    },
    // ... ajouter 3 autres bars
  ],
  culture: [
    {
      id: 'cult1',
      title: 'Musée d\'Art Moderne',
      description: 'Une collection exceptionnelle d\'œuvres modernes et contemporaines.',
      price: 12,
      duration: '3 heures',
      address: '1 place des Arts',
      imageUrl: '/images/culture1.jpg',
      category: 'culture'
    },
    {
      id: 'cult2',
      title: 'Théâtre Historique',
      description: 'Spectacle dans un théâtre du 19ème siècle magnifiquement restauré.',
      price: 35,
      duration: '2.5 heures',
      address: '25 boulevard des Spectacles',
      imageUrl: '/images/culture2.jpg',
      category: 'culture'
    },
    // ... ajouter 3 autres activités culturelles
  ],
  nature: [
    {
      id: 'nat1',
      title: 'Jardin Botanique',
      description: 'Un havre de paix avec des milliers d\'espèces de plantes et de fleurs.',
      price: 8,
      duration: '2 heures',
      address: '100 allée des Jardins',
      imageUrl: '/images/nature1.jpg',
      category: 'nature'
    },
    {
      id: 'nat2',
      title: 'Randonnée Guidée',
      description: 'Découverte des plus beaux sentiers de la région avec un guide expert.',
      price: 25,
      duration: '4 heures',
      address: 'Point de départ : Office de Tourisme',
      imageUrl: '/images/nature2.jpg',
      category: 'nature'
    },
    // ... ajouter 3 autres activités nature
  ],
  shopping: [
    {
      id: 'shop1',
      title: 'Marché des Artisans',
      description: 'Marché couvert regroupant les meilleurs artisans locaux.',
      price: 0,
      duration: '2 heures',
      address: '5 place du Marché',
      imageUrl: '/images/shopping1.jpg',
      category: 'shopping'
    },
    {
      id: 'shop2',
      title: 'Centre Commercial Historique',
      description: 'Shopping dans un bâtiment art déco avec les meilleures marques.',
      price: 0,
      duration: '3 heures',
      address: '55 rue du Commerce',
      imageUrl: '/images/shopping2.jpg',
      category: 'shopping'
    },
    // ... ajouter 3 autres activités shopping
  ]
} 