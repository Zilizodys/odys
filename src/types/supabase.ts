export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          address: string
          imageurl: string
          category: string
          city: string
          price_range: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          address: string
          imageurl: string
          category: string
          city: string
          price_range: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          address?: string
          imageurl?: string
          category?: string
          city?: string
          price_range?: string
          created_at?: string
          updated_at?: string
        }
      }
      program_activities: {
        Row: {
          id: string
          program_id: string
          activity_id: string
          created_at?: string
        }
        Insert: {
          id?: string
          program_id: string
          activity_id: string
          created_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          activity_id?: string
          created_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          title: string
          description: string
          destination: string
          start_date: string
          end_date: string
          budget: number
          companion: string
          imageurl: string | null
          cover_image: string | null
          moods: string[]
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          destination: string
          start_date: string
          end_date: string
          budget: number
          companion: string
          imageurl?: string | null
          cover_image?: string | null
          moods: string[]
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          destination?: string
          start_date?: string
          end_date?: string
          budget?: number
          companion?: string
          imageurl?: string | null
          cover_image?: string | null
          moods?: string[]
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 