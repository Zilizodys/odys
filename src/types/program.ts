import { Activity } from './activity'

export interface Program {
  id: string
  user_id: string
  title: string
  description: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  companion: string
  activities: Activity[]
  imageurl: string | null
  coverImage: string | null
  moods: string[]
  createdAt: Date
  updatedAt: Date
} 