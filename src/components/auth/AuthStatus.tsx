'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import GoogleSignInButton from './GoogleSignInButton'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function AuthStatus() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
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