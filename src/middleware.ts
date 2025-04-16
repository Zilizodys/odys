import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes protégées qui nécessitent une authentification
const protectedRoutes = [
  '/dashboard',
  '/settings',
  '/program/save',
  '/profile',
]

export async function middleware(request: NextRequest) {
  // Vérifier si l'URL actuelle est une route protégée
  const currentPath = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => 
    currentPath.startsWith(route)
  )

  // Si ce n'est pas une route protégée, on laisse passer
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })
    
    // Rafraîchir la session si nécessaire
    await supabase.auth.getSession()

    return res
  } catch (error) {
    console.error('Erreur middleware:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Configuration du matcher avec une syntaxe valide
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
} 