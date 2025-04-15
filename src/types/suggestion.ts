export type SuggestionCategory = 
  | 'Vie nocturne'
  | 'Culture'
  | 'Gastronomie'
  | 'Nature'
  | 'Shopping'
  | 'Sport'

export interface Suggestion {
  id: string
  title: string
  description: string
  category: SuggestionCategory
  duration: string
  price: number
  image: string
  location?: string
  price_estimate?: number
  link?: string
}

export const CATEGORY_LABELS: Record<SuggestionCategory, string> = {
  'Vie nocturne': 'Vie nocturne',
  'Culture': 'Culture',
  'Gastronomie': 'Gastronomie',
  'Nature': 'Nature',
  'Shopping': 'Shopping',
  'Sport': 'Sport'
}

// Données de test pour les suggestions
export const MOCK_SUGGESTIONS: Suggestion[] = [
  // PARIS
  // Restaurants
  {
    id: 'p-rest-1',
    title: 'Le Chateaubriand',
    description: 'Restaurant gastronomique moderne avec menu dégustation innovant',
    category: 'Gastronomie',
    duration: '2-3h',
    price: 150,
    image: '/images/restaurants/chateaubriand.jpg',
    location: '129 Avenue Parmentier, 75011 Paris',
    price_estimate: 150,
    link: 'https://lechateaubriand.com'
  },
  {
    id: 'p-rest-2',
    title: 'L\'Ami Louis',
    description: 'Bistrot traditionnel parisien célèbre pour son poulet rôti',
    category: 'Gastronomie',
    duration: '1-2h',
    price: 80,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-rest-3',
    title: 'L\'Arpège',
    description: 'Restaurant 3 étoiles Michelin du chef Alain Passard',
    category: 'Gastronomie',
    duration: '2-3h',
    price: 200,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-rest-4',
    title: 'Bistrot Paul Bert',
    description: 'Cuisine française traditionnelle dans un cadre authentique',
    category: 'Gastronomie',
    duration: '1-2h',
    price: 60,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-rest-5',
    title: 'Le Baratin',
    description: 'Restaurant intimiste avec cuisine du marché créative',
    category: 'Gastronomie',
    duration: '1-2h',
    price: 70,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },

  // Bars Paris
  {
    id: 'p-bar-1',
    title: 'Le Comptoir Général',
    description: 'Bar caché avec décor colonial et cocktails exotiques',
    category: 'Vie nocturne',
    duration: '2-3h',
    price: 15,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-bar-2',
    title: 'Little Red Door',
    description: 'Bar à cocktails créatifs dans le Marais',
    category: 'Vie nocturne',
    duration: '1-2h',
    price: 16,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-bar-3',
    title: 'Le Syndicat',
    description: 'Cocktails à base de spiritueux français uniquement',
    category: 'Vie nocturne',
    duration: '1-2h',
    price: 14,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-bar-4',
    title: 'Andy Wahloo',
    description: 'Bar branché avec ambiance marocaine',
    category: 'Vie nocturne',
    duration: '2-3h',
    price: 13,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-bar-5',
    title: 'Le Mary Celeste',
    description: 'Bar à huîtres et cocktails dans le Marais',
    category: 'Vie nocturne',
    duration: '2-3h',
    price: 12,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },

  // Culture Paris
  {
    id: 'p-cult-1',
    title: 'Musée du Louvre',
    description: 'Le plus grand musée d\'art au monde',
    category: 'Culture',
    duration: '3-4h',
    price: 17,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-cult-2',
    title: 'Musée d\'Orsay',
    description: 'Collection impressionniste dans une ancienne gare',
    category: 'Culture',
    duration: '2-3h',
    price: 16,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-cult-3',
    title: 'Centre Pompidou',
    description: 'Art moderne et contemporain',
    category: 'Culture',
    duration: '2-3h',
    price: 14,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-cult-4',
    title: 'Opéra Garnier',
    description: 'Chef-d\'œuvre architectural du XIXe siècle',
    category: 'Culture',
    duration: '1-2h',
    price: 12,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-cult-5',
    title: 'Musée Carnavalet',
    description: 'Histoire de Paris à travers les siècles',
    category: 'Culture',
    duration: '2h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },

  // Nature Paris
  {
    id: 'p-nat-1',
    title: 'Jardin des Tuileries',
    description: 'Jardin à la française entre le Louvre et la Concorde',
    category: 'Nature',
    duration: '1-2h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-nat-2',
    title: 'Bois de Vincennes',
    description: 'Plus grand espace vert de Paris avec lac et zoo',
    category: 'Nature',
    duration: '3-4h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-nat-3',
    title: 'Jardin des Plantes',
    description: 'Jardin botanique historique et muséum',
    category: 'Nature',
    duration: '2-3h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-nat-4',
    title: 'Parc des Buttes-Chaumont',
    description: 'Parc pittoresque avec falaises et lac',
    category: 'Nature',
    duration: '2h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-nat-5',
    title: 'Coulée verte René-Dumont',
    description: 'Promenade plantée sur une ancienne voie ferrée',
    category: 'Nature',
    duration: '1-2h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },

  // Shopping Paris
  {
    id: 'p-shop-1',
    title: 'Galeries Lafayette',
    description: 'Grand magasin historique avec coupole Art nouveau',
    category: 'Shopping',
    duration: '2-3h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-shop-2',
    title: 'Le Marais',
    description: 'Quartier branché avec boutiques de créateurs',
    category: 'Shopping',
    duration: '3-4h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-shop-3',
    title: 'Avenue des Champs-Élysées',
    description: 'La plus belle avenue du monde et ses boutiques de luxe',
    category: 'Shopping',
    duration: '2-3h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-shop-4',
    title: 'Le Bon Marché',
    description: 'Premier grand magasin de Paris, shopping haut de gamme',
    category: 'Shopping',
    duration: '2h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'p-shop-5',
    title: 'Forum des Halles',
    description: 'Centre commercial moderne au cœur de Paris',
    category: 'Shopping',
    duration: '2-3h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },

  // ROME
  // Restaurants Rome
  {
    id: 'r-rest-1',
    title: 'Roscioli',
    description: 'Restaurant-épicerie historique, spécialités romaines',
    category: 'Gastronomie',
    duration: '1-2h',
    price: 50,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-rest-2',
    title: 'Armando al Pantheon',
    description: 'Cuisine romaine traditionnelle près du Panthéon',
    category: 'Gastronomie',
    duration: '1-2h',
    price: 40,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-rest-3',
    title: 'La Pergola',
    description: 'Restaurant 3 étoiles Michelin avec vue sur Rome',
    category: 'Gastronomie',
    duration: '2-3h',
    price: 200,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-rest-4',
    title: 'Pierluigi',
    description: 'Restaurant de fruits de mer historique',
    category: 'Gastronomie',
    duration: '2h',
    price: 80,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-rest-5',
    title: 'Salumeria Roscioli',
    description: 'Cave à vin et restaurant gastronomique',
    category: 'Gastronomie',
    duration: '2h',
    price: 60,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },

  // Bars Rome
  {
    id: 'r-bar-1',
    title: 'Jerry Thomas Speakeasy',
    description: 'Bar caché style prohibition, cocktails créatifs',
    category: 'Vie nocturne',
    duration: '2-3h',
    price: 14,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-bar-2',
    title: 'Bar del Fico',
    description: 'Bar branché du quartier historique',
    category: 'Vie nocturne',
    duration: '2h',
    price: 10,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-bar-3',
    title: 'Hotel Locarno Bar',
    description: 'Bar Art déco historique, cocktails classiques',
    category: 'Vie nocturne',
    duration: '1-2h',
    price: 16,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-bar-4',
    title: 'Stravinskij Bar',
    description: 'Bar élégant avec terrasse à l\'Hôtel de Russie',
    category: 'Vie nocturne',
    duration: '2h',
    price: 20,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-bar-5',
    title: 'The Race Club',
    description: 'Speakeasy avec ambiance vintage et cocktails originaux',
    category: 'Vie nocturne',
    duration: '2-3h',
    price: 12,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },

  // Culture Rome
  {
    id: 'r-cult-1',
    title: 'Colisée',
    description: 'Amphithéâtre antique emblématique de Rome',
    category: 'Culture',
    duration: '2-3h',
    price: 16,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-cult-2',
    title: 'Musées du Vatican',
    description: 'Collection d\'art exceptionnelle et Chapelle Sixtine',
    category: 'Culture',
    duration: '3-4h',
    price: 17,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-cult-3',
    title: 'Panthéon',
    description: 'Temple romain antique parfaitement préservé',
    category: 'Culture',
    duration: '1h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-cult-4',
    title: 'Galerie Borghèse',
    description: 'Chefs-d\'œuvre de l\'art dans une villa du XVIIe siècle',
    category: 'Culture',
    duration: '2h',
    price: 13,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-cult-5',
    title: 'Forum Romain',
    description: 'Centre politique de la Rome antique',
    category: 'Culture',
    duration: '2-3h',
    price: 16,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },

  // Nature Rome
  {
    id: 'r-nat-1',
    title: 'Villa Borghèse',
    description: 'Plus grand parc public de Rome',
    category: 'Nature',
    duration: '2-3h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-nat-2',
    title: 'Jardin des Orangers',
    description: 'Vue panoramique sur Rome et orangeraie',
    category: 'Nature',
    duration: '1h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-nat-3',
    title: 'Parc des Aqueducs',
    description: 'Parc archéologique avec aqueducs romains',
    category: 'Nature',
    duration: '2h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-nat-4',
    title: 'Jardin botanique de Rome',
    description: 'Collection de plantes exotiques et méditerranéennes',
    category: 'Nature',
    duration: '1-2h',
    price: 4,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-nat-5',
    title: 'Villa Ada',
    description: 'Grand parc avec lac et sentiers de randonnée',
    category: 'Nature',
    duration: '2-3h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },

  // Shopping Rome
  {
    id: 'r-shop-1',
    title: 'Via del Corso',
    description: 'Artère commerciale principale de Rome',
    category: 'Shopping',
    duration: '2-3h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-shop-2',
    title: 'Via Condotti',
    description: 'Rue des boutiques de luxe',
    category: 'Shopping',
    duration: '1-2h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-shop-3',
    title: 'Via Cola di Rienzo',
    description: 'Shopping élégant dans le quartier Prati',
    category: 'Shopping',
    duration: '2h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-shop-4',
    title: 'Marché de Campo de\' Fiori',
    description: 'Marché traditionnel en plein air',
    category: 'Shopping',
    duration: '1h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  },
  {
    id: 'r-shop-5',
    title: 'Via del Boschetto',
    description: 'Boutiques vintage et artisanat local',
    category: 'Shopping',
    duration: '2h',
    price: 0,
    image: '',
    location: '',
    price_estimate: 0,
    link: ''
  }

  // Continuer avec Barcelone et Londres...
] 