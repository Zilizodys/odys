'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import GoogleSignInButton from './GoogleSignInButton'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function AuthStatus() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const client = createClient()
      if (!client) {
        throw new Error('Impossible de créer le client Supabase')
      }
      const { data: { user } } = await client.auth.getUser()
      setUser(user)
    }

    getUser()

    const client = createClient()
    if (!client) {
      throw new Error('Impossible de créer le client Supabase')
    }
    const { data: { subscription } } = client.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      const client = createClient()
      if (!client) {
        throw new Error('Impossible de créer le client Supabase')
      }
      await client.auth.signOut()
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const client = createClient()
      if (!client) {
        throw new Error('Impossible de créer le client Supabase')
      }
      await client.auth.admin.deleteUser(user?.id || '')
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error)
    }
  }

  if (!user) {
    return <GoogleSignInButton redirectTo={pathname} />
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700">{user.email}</span>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 text-sm text-red-600 transition-colors duration-300 border border-red-300 rounded-lg hover:bg-red-50"
      >
        Déconnexion
      </button>
    </div>
  )
} 