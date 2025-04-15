import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return document.cookie.split(';').find(c => c.trim().startsWith(name + '='))?.split('=')[1]
        },
        set: (name: string, value: string, options: { expires?: Date }) => {
          document.cookie = `${name}=${value}${options.expires ? `; expires=${options.expires.toUTCString()}` : ''}`
        },
        remove: (name: string) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
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
} 