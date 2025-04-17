import { Activity } from './activity'

export interface Program {
  id: string
  title: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  companion: string
  activities: Activity[]
  coverImage?: string
  moods?: string[]
} 