import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient<Database, 'public'> | null = null

export const createClient = () => {
  if (supabaseInstance) return supabaseInstance

  supabaseInstance = createClientComponentClient<Database>({
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    }
  })

  return supabaseInstance
} 