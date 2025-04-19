import { Activity } from './activity'

export type TravelCompanion = 'solo' | 'couple' | 'friends' | 'family'
export type MoodType = 'romantic' | 'cultural' | 'adventure' | 'party' | 'relaxation'
export type BudgetLevel = 'low' | 'medium' | 'high'

export interface FormData {
  destination: string
  startDate: string | null
  endDate: string | null
  companion: TravelCompanion | null
  budget: number | null
  moods: MoodType[]
  name: string
  activities: Activity[]
}

export const INITIAL_FORM_DATA: FormData = {
  destination: '',
  startDate: null,
  endDate: null,
  companion: null,
  budget: null,
  moods: [],
  name: '',
  activities: []
}

// Liste des villes populaires avec leurs pays corrects
export const SUGGESTED_DESTINATIONS = [
  { city: 'Paris', country: 'France', icon: '🗼' },
  { city: 'Rome', country: 'Italie', icon: '🏛' },
  { city: 'Barcelone', country: 'Espagne', icon: '🏖' },
  { city: 'Londres', country: 'Royaume-Uni', icon: '🎡' }
]

// Liste étendue des villes mondiales pour l'autocomplétion
export const WORLD_CITIES = [
  { city: 'New York', country: 'États-Unis' },
  { city: 'Tokyo', country: 'Japon' },
  { city: 'Londres', country: 'Royaume-Uni' },
  { city: 'Paris', country: 'France' },
  { city: 'Dubai', country: 'Émirats Arabes Unis' },
  { city: 'Singapour', country: 'Singapour' },
  { city: 'Rome', country: 'Italie' },
  { city: 'Bangkok', country: 'Thaïlande' },
  { city: 'Sydney', country: 'Australie' },
  { city: 'Istanbul', country: 'Turquie' },
  { city: 'Barcelone', country: 'Espagne' },
  { city: 'Amsterdam', country: 'Pays-Bas' },
  { city: 'Rio de Janeiro', country: 'Brésil' },
  { city: 'Berlin', country: 'Allemagne' },
  { city: 'Venise', country: 'Italie' },
  { city: 'Madrid', country: 'Espagne' },
  { city: 'Prague', country: 'République Tchèque' },
  { city: 'Moscou', country: 'Russie' },
  { city: 'Vienne', country: 'Autriche' },
  { city: 'Athènes', country: 'Grèce' },
  { city: 'Stockholm', country: 'Suède' },
  { city: 'Lisbonne', country: 'Portugal' },
  { city: 'Budapest', country: 'Hongrie' },
  { city: 'Copenhague', country: 'Danemark' },
  { city: 'Dublin', country: 'Irlande' },
  { city: 'Marrakech', country: 'Maroc' },
  { city: 'Le Caire', country: 'Égypte' },
  { city: 'Cape Town', country: 'Afrique du Sud' },
  { city: 'Mumbai', country: 'Inde' },
  { city: 'Hong Kong', country: 'Chine' }
]

export const COMPANION_OPTIONS = [
  { value: 'solo', label: 'Solo', icon: '🚶‍♂️' },
  { value: 'couple', label: 'En couple', icon: '💑' },
  { value: 'friends', label: 'Entre amis', icon: '👥' },
  { value: 'family', label: 'En famille', icon: '👨‍👩‍👧‍👦' }
]

export const BUDGET_OPTIONS = [
  { value: 500, label: 'Économique', icon: '💰' },
  { value: 1000, label: 'Modéré', icon: '💰💰' },
  { value: 2000, label: 'Confort', icon: '💰💰💰' }
]

export const MOOD_OPTIONS = [
  { value: 'romantic', label: 'Gastronomie', icon: '🍷' },
  { value: 'cultural', label: 'Culture', icon: '🏛' },
  { value: 'adventure', label: 'Sport', icon: '🏃‍♂️' },
  { value: 'party', label: 'Vie nocturne', icon: '🎉' },
  { value: 'relaxation', label: 'Nature', icon: '🌿' }
] 