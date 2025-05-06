import { FormData } from './form'

export interface CrewAIRequest {
  formData: {
    destination: string
    startDate: string
    endDate: string
    budget: string | number
    companion: string
    moods: string[]
  }
}

interface CrewAIActivity {
  title: string
  description: string
  price: number
  address: string
  imageurl: string
  booking_url?: string
  city: string
}

interface CategorySuggestion {
  category: string
  activities: CrewAIActivity[]
  category_budget: number
}

export interface Activity {
  title: string
  description: string
  price: number
  address: string
  imageurl: string
  category: string
  city: string
  booking_url?: string
}

export interface CrewAIResponse {
  success: boolean
  activities: Activity[]
  error?: string
  details?: string | Record<string, unknown>
}

export interface TransformedResponse {
  success: boolean
  activities: Activity[]
  error?: string
  details?: string | Record<string, unknown>
} 