import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { pathname } = request.nextUrl

  // Vérifier la session
  const { data: { session } } = await supabase.auth.getSession()

  // Liste des routes protégées
  const protectedRoutes = ['/dashboard', '/program', '/suggestions']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si l'utilisateur est connecté et sur la page de login
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/program/:path*',
    '/suggestions/:path*',
    '/login',
    '/auth/callback'
  ]
} 