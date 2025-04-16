import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export const supabaseAuthClient = createBrowserClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

// Configuration de l'URL de redirection pour l'authentification
export const signInWithGoogle = async () => {
  const { data, error } = await supabaseAuthClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getBaseUrl()}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  })
  
  if (error) throw error
  return data
} 