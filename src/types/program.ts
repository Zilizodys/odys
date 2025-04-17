import { Activity } from './activity'

export interface Program {
  id: string
  title: string
  description: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  companion: string
  activities: Activity[]
  imageUrl: string | null
  coverImage: string | null
  moods: string[]
  createdAt: Date
  updatedAt: Date
} 