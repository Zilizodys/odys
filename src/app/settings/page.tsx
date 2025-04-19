'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SupabaseClient } from '@supabase/supabase-js'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (supabase) {
      const getUser = async () => {
        try {
          const { data: { user }, error } = await (supabase as SupabaseClient).auth.getUser()
          if (error) throw error
          setUser(user)
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error)
          router.push('/login')
        } finally {
          setIsLoading(false)
        }
      }

      getUser()
    }
  }, [router])

  const handleSignOut = async () => {
    try {
      const client = createClient()
      if (!client) {
        throw new Error('Impossible de créer le client Supabase')
      }
      await client.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
          <p className="text-center text-gray-600">Chargement...</p>
        </main>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
        
        <div className="bg-white shadow-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Profil</h2>
          <div className="flex items-center space-x-6">
            {user.user_metadata?.avatar_url && (
              <div className="relative h-20 w-20">
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Photo de profil"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {user.user_metadata?.full_name || 'Utilisateur'}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <p>
              <span className="font-medium">Email :</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Dernière connexion :</span>{' '}
              {new Date(user.last_sign_in_at || '').toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="mt-4 space-y-4">
            <button
              onClick={handleSignOut}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 