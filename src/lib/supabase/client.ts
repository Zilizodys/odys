import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return process.env.NEXT_PUBLIC_PRODUCTION_URL
  }

  const baseUrl = getBaseUrl()

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          if (typeof document === 'undefined') return ''
          return document.cookie.split(';').find(c => c.trim().startsWith(name + '='))?.split('=')[1] || ''
        },
        set: (name: string, value: string, options: { expires?: Date }) => {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=${value}${options.expires ? `; expires=${options.expires.toUTCString()}` : ''}`
        },
        remove: (name: string) => {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      },
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        autoRefreshToken: true,
        persistSession: true
      },
      global: {
        headers: {
          'x-redirect-url': `${baseUrl}/auth/callback`
        }
      }
    }
  )
} 