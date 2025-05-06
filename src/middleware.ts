import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const getBaseUrl = (req: NextRequest) => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  if (isDevelopment) {
    return 'http://localhost:3000'
  }
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { pathname } = request.nextUrl
  const baseUrl = getBaseUrl(request)

  // Vérifier la session
  const {
    data: { session }
  } = await supabase.auth.getSession()

  // Liste des routes protégées
  const protectedRoutes = ['/dashboard', '/program', '/summary']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith('/api/') && !pathname.startsWith('/api/crew/suggestions')
  const isAuthRoute = pathname.startsWith('/auth/')
  const isLoginPage = pathname === '/login'

  // Ne pas interférer avec les routes d'authentification
  if (isAuthRoute) {
    return res
  }

  // Si l'utilisateur est sur la page de login et est déjà connecté
  if (isLoginPage && session) {
    const searchParams = new URL(request.url).searchParams
    const redirectTo = searchParams.get('redirectTo') || '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, baseUrl))
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && isProtectedRoute) {
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const redirectUrl = new URL('/login', baseUrl)
    redirectUrl.searchParams.set('redirectTo', pathname + request.nextUrl.search)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/program/:path*',
    '/summary',
    '/login',
    '/auth/callback',
    '/api/:path*'
  ]
} 