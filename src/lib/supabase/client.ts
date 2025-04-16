import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config'

let supabase: ReturnType<typeof createBrowserClient> | null = null

export const createClient = () => {
  if (supabase) return supabase

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Les variables d\'environnement Supabase ne sont pas définies')
  }

  supabase = createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          if (typeof document === 'undefined') return ''
          const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
          if (!cookie) return ''
          const value = cookie.split('=')[1]
          return decodeURIComponent(value)
        },
        set(name, value, options) {
          if (typeof document === 'undefined') return
          let cookie = `${name}=${encodeURIComponent(value)}`
          if (options?.expires) {
            cookie += `; expires=${options.expires.toUTCString()}`
          }
          if (options?.path) {
            cookie += `; path=${options.path}`
          }
          if (options?.sameSite) {
            cookie += `; samesite=${options.sameSite}`
          }
          cookie += '; secure'
          document.cookie = cookie
        },
        remove(name, options) {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${options?.path || '/'}`
        }
      },
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        autoRefreshToken: true,
        persistSession: true
      }
    }
  )

  return supabase
} 