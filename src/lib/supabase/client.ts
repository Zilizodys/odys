import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Déterminer l'URL de redirection en fonction de l'environnement
const getRedirectTo = () => {
  if (typeof window === 'undefined') return undefined

  const baseUrl = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_FORCE_LOCAL === 'true'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

  return `${baseUrl}/auth/callback`
}

let supabaseInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance

  supabaseInstance = createClientComponentClient<Database>()
  return supabaseInstance
}

// Alias pour maintenir la compatibilité
export const createClient = getSupabaseClient 