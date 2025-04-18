import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { pathname } = request.nextUrl

  // Forcer l'utilisation de localhost en développement
  const baseUrl = process.env.NEXT_PUBLIC_FORCE_LOCAL === 'true'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin

  // Vérifier la session
  const { data: { session } } = await supabase.auth.getSession()

  // Liste des routes protégées
  const protectedRoutes = ['/dashboard', '/program', '/suggestions']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith('/api/')

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && isProtectedRoute) {
    if (isApiRoute) {
      // Pour les routes API, retourner une erreur JSON
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required' 
        },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }
    // Pour les routes normales, rediriger vers la page de connexion
    const redirectUrl = new URL('/login', baseUrl)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si l'utilisateur est connecté
  if (session) {
    // Rediriger de la page d'accueil vers le tableau de bord
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', baseUrl))
    }
    // Rediriger de la page de login vers le tableau de bord
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', baseUrl))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/program/:path*',
    '/suggestions/:path*',
    '/login',
    '/auth/callback',
    '/api/:path*'
  ]
} 