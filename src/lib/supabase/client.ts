import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient<Database, 'public'> | null = null

export const createClient = () => {
  if (supabaseInstance) return supabaseInstance

  const redirectTo = process.env.NEXT_PUBLIC_FORCE_LOCAL === 'true'
    ? 'http://localhost:3000/auth/callback'
    : undefined

  supabaseInstance = createClientComponentClient<Database>({
    cookieOptions: {
      name: 'sb-auth-token',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      domain: process.env.NEXT_PUBLIC_DOMAIN || 'localhost'
    }
  })

  return supabaseInstance
} 