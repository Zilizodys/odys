import { createClient } from '@supabase/supabase-js'
import { cache } from './cache'
import { AuthError } from './errors'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

// Constantes pour la gestion du cache
const SESSION_CACHE_KEY = 'user_session'
const SESSION_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Types
export type AuthSession = {
  user: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  }
  access_token: string
  refresh_token: string
  expires_at: number
}

class AuthManager {
  private supabase
  
  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variables d\'environnement Supabase manquantes')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  // Récupérer la session avec gestion du cache
  async getSession(): Promise<AuthSession | null> {
    // Vérifier d'abord le cache
    const cachedSession = cache.get<AuthSession>(SESSION_CACHE_KEY)
    if (cachedSession) {
      // Vérifier si la session n'est pas expirée
      if (cachedSession.expires_at > Date.now()) {
        return cachedSession
      }
      // Si expirée, supprimer du cache
      cache.delete(SESSION_CACHE_KEY)
    }

    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      
      if (error) throw new AuthError(error.message)
      if (!session) return null

      // Mettre en cache la nouvelle session
      const authSession: AuthSession = {
        user: session.user,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: new Date(session.expires_at!).getTime()
      }
      
      cache.set(SESSION_CACHE_KEY, authSession, {
        ttl: SESSION_CACHE_TTL
      })

      return authSession
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error)
      return null
    }
  }

  // Rafraîchir la session
  async refreshSession(): Promise<AuthSession | null> {
    try {
      const { data: { session }, error } = await this.supabase.auth.refreshSession()
      
      if (error) throw new AuthError(error.message)
      if (!session) return null

      const authSession: AuthSession = {
        user: session.user,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: new Date(session.expires_at!).getTime()
      }

      cache.set(SESSION_CACHE_KEY, authSession, {
        ttl: SESSION_CACHE_TTL
      })

      return authSession
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de la session:', error)
      return null
    }
  }

  // Déconnexion
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) throw new AuthError(error.message)
      
      // Nettoyer le cache
      cache.delete(SESSION_CACHE_KEY)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      throw error
    }
  }

  // Vérifier si l'utilisateur est authentifié
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession()
    return !!session
  }

  // Obtenir l'utilisateur courant
  async getCurrentUser() {
    const session = await this.getSession()
    return session?.user || null
  }
}

// Créer une instance unique du gestionnaire d'authentification
export const auth = new AuthManager()

// Middleware pour les routes API
export async function withAuth(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession()

      if (sessionError) throw new AuthError(sessionError.message)
      if (!session) throw new AuthError('Session non trouvée')

      // Ajouter la session à la requête pour utilisation ultérieure
      const authenticatedRequest = Object.assign(req, { session })
      
      return handler(authenticatedRequest, ...args)
    } catch (error) {
      if (error instanceof AuthError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: error.message
          }),
          { status: 401 }
        )
      }
      throw error
    }
  }
} 