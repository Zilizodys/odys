import { Activity } from './activity'

export type TravelCompanion = 'solo' | 'couple' | 'family' | 'friends'
export type MoodType = 'romantic' | 'cultural' | 'adventure' | 'party' | 'relaxation' | 'shopping' | 'wellness' | 'food' | 'sport' | 'nature'
export type BudgetLevel = 'low' | 'medium' | 'high'

export interface FormData {
  destination: string
  startDate: string | null
  endDate: string | null
  budget: number | null
  companion: TravelCompanion | null
  moods: MoodType[]
}

export const INITIAL_FORM_DATA: FormData = {
  destination: '',
  startDate: null,
  endDate: null,
  budget: null,
  companion: null,
  moods: []
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
  {
    value: 0,
    label: 'Gratuit',
    icon: '🆓',
  },
  {
    value: 1,
    label: 'Économique',
    icon: '💰',
  },
  {
    value: 2,
    label: 'Modéré',
    icon: '💰💰',
  },
  {
    value: 3,
    label: 'Confort',
    icon: '💰💰💰',
  },
]

export const MOOD_OPTIONS = [
  { value: 'romantic', label: 'Gastronomie', icon: '🍷' },
  { value: 'cultural', label: 'Culture', icon: '🏛' },
  { value: 'adventure', label: 'Sport', icon: '🏃‍♂️' },
  { value: 'party', label: 'Vie nocturne', icon: '🎉' },
  { value: 'relaxation', label: 'Nature', icon: '🌿' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'wellness', label: 'Bien-être', icon: '🧘‍♀️' },
  { value: 'food', label: 'Street Food', icon: '🍜' },
  { value: 'sport', label: 'Sports extrêmes', icon: '🏄‍♂️' },
  { value: 'nature', label: 'Randonnée', icon: '🥾' }
]

export interface CityResponse {
  city: string
  country: string
  source: string
  score?: number
} 