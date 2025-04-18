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
          created_at: string
          updated_at: string
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
          created_at?: string
          updated_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          destination: string
          start_date: string
          end_date: string
          budget: number
          companion: string
          created_at: string
          updated_at: string
          coverImage: string | null
          moods: string[]
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          destination: string
          start_date: string
          end_date: string
          budget: number
          companion: string
          created_at?: string
          updated_at?: string
          coverImage?: string | null
          moods?: string[]
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          destination?: string
          start_date?: string
          end_date?: string
          budget?: number
          companion?: string
          created_at?: string
          updated_at?: string
          coverImage?: string | null
          moods?: string[]
        }
      }
      program_activities: {
        Row: {
          id: string
          program_id: string
          activity_id: string
          created_at: string
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
    }
  }
}
