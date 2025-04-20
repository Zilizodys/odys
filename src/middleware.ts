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
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  // Liste des routes protégées
  const protectedRoutes = ['/dashboard', '/program', '/suggestions', '/summary']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith('/api/')
  const isAuthRoute = pathname.startsWith('/auth/')
  const isLoginPage = pathname === '/login'

  // Ne pas interférer avec les routes d'authentification
  if (isAuthRoute) {
    return res
  }

  // Si l'utilisateur est sur la page de login et est déjà connecté
  if (isLoginPage && session) {
    // Récupérer le redirectTo ou aller au dashboard par défaut
    const searchParams = new URL(request.url).searchParams
    const redirectTo = searchParams.get('redirectTo') || '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, baseUrl))
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && isProtectedRoute) {
    if (isApiRoute) {
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

    // Sauvegarder l'URL actuelle pour la redirection après connexion
    const redirectUrl = new URL('/login', baseUrl)
    redirectUrl.searchParams.set('redirectTo', pathname + request.nextUrl.search)
    return NextResponse.redirect(redirectUrl)
  }

  // Si l'utilisateur est connecté et sur la page d'accueil
  if (session && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', baseUrl))
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/program/:path*',
    '/suggestions/:path*',
    '/summary',
    '/login',
    '/auth/callback',
    '/api/:path*'
  ]
} 