'use client'

import LoginForm from '@/components/auth/LoginForm'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // Si le paramètre auth-callback est présent, forcer un rafraîchissement
  useEffect(() => {
    if (searchParams.get('auth-callback') === 'true') {
      router.refresh()
    }
  }, [searchParams, router])

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
          <div className="text-center text-gray-600">Chargement...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      {session ? (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-center">
            {session.user.user_metadata.avatar_url && (
              <div className="relative w-24 h-24 overflow-hidden rounded-full">
                <Image
                  src={session.user.user_metadata.avatar_url}
                  alt={session.user.user_metadata.full_name || 'Avatar'}
                  fill
                  sizes="(max-width: 96px) 96px, 96px"
                  priority
                  className="object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Bienvenue, {session.user.user_metadata.full_name}!
            </h2>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">Email</span>
                <span className="text-sm text-gray-900">{session.user.email}</span>
              </div>
              
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">Dernière connexion</span>
                <span className="text-sm text-gray-900">
                  {new Date(session.user.last_sign_in_at).toLocaleString('fr-FR')}
                </span>
              </div>
              
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">Méthode de connexion</span>
                <span className="text-sm text-gray-900 capitalize">{session.user.app_metadata.provider}</span>
              </div>
            </div>

            <button
              onClick={async () => {
                await supabase.auth.signOut()
                router.refresh()
              }}
              className="w-full px-4 py-2 mt-6 text-white transition-colors duration-300 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Déconnexion
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-8">
          <LoginForm />
        </div>
      )}
    </main>
  )
}
