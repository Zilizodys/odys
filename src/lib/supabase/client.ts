import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

let supabaseInstance: ReturnType<typeof createClientComponentClient> | null = null

export const createClient = () => {
  if (supabaseInstance) return supabaseInstance

  supabaseInstance = createClientComponentClient()
  return supabaseInstance
} 