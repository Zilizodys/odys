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
}

export const INITIAL_FORM_DATA: FormData = {
  destination: '',
  startDate: null,
  endDate: null,
  companion: null,
  budget: null,
  moods: []
}

export const SUGGESTED_DESTINATIONS = [
  { city: 'Paris', country: 'France', icon: '🗼' },
  { city: 'Rome', country: 'Italie', icon: '🏛' },
  { city: 'Barcelone', country: 'Espagne', icon: '🏖' },
  { city: 'Londres', country: 'Royaume-Uni', icon: '🎡' }
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
  { value: 2000, label: 'Luxe', icon: '💰💰��' }
]

export const MOOD_OPTIONS = [
  { value: 'romantic', label: 'Romantique', icon: '💑' },
  { value: 'cultural', label: 'Culture', icon: '🎨' },
  { value: 'adventure', label: 'Aventure', icon: '🏃‍♂️' },
  { value: 'party', label: 'Fête', icon: '🎉' },
  { value: 'relaxation', label: 'Détente', icon: '🧘‍♀️' }
] 