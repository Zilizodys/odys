import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/'

  // Forcer l'utilisation de localhost en développement
  const baseUrl = process.env.NEXT_PUBLIC_FORCE_LOCAL === 'true'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

  console.log('CALLBACK baseUrl:', baseUrl, 'redirectTo:', redirectTo)

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      // Échanger le code contre une session
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Erreur lors de l\'échange du code:', sessionError)
        throw sessionError
      }

      if (!session) {
        throw new Error('Pas de session après l\'échange du code')
      }

      // Créer une réponse avec la redirection
      const response = NextResponse.redirect(new URL(redirectTo, baseUrl))

      // S'assurer que les cookies de session sont correctement définis
      await supabase.auth.setSession(session)

      return response
    } catch (error) {
      console.error('Erreur dans le callback:', error)
      return NextResponse.redirect(new URL('/login', baseUrl))
    }
  }

  // En cas d'absence de code, rediriger vers la page de connexion
  return NextResponse.redirect(new URL('/login', baseUrl))
} 