import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { syncUser } from '@/lib/supabase/sync'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)
      
      if (user) {
        // Synchroniser l'utilisateur avec notre table users
        await syncUser(supabase, user)
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } catch (error) {
      console.error('Erreur lors de l\'échange du code:', error)
      return NextResponse.redirect(new URL('/login', requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/login', requestUrl.origin))
} 