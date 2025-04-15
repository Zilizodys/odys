'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          Chargement...
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.user_metadata?.full_name || 'Utilisateur'}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Informations du compte</h3>
            <dl className="mt-4 space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Dernière connexion</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(user.last_sign_in_at).toLocaleString('fr-FR')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Compte créé le</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(user.created_at).toLocaleString('fr-FR')}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <button
              onClick={handleSignOut}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 