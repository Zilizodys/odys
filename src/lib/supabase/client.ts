import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

let supabaseInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createClient = () => {
  if (supabaseInstance) return supabaseInstance

  const redirectTo = process.env.NEXT_PUBLIC_FORCE_LOCAL === 'true'
    ? 'http://localhost:3000/auth/callback'
    : undefined

  supabaseInstance = createClientComponentClient<Database>({
    options: {
      global: {
        headers: { 'x-application-name': 'odys' }
      }
    },
    cookieOptions: {
      name: 'sb-auth-token',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    }
  })

  return supabaseInstance
} 