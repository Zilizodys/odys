'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const client = createClient()
        if (!client) {
          throw new Error('Impossible de créer le client Supabase')
        }
        const { data: { session } } = await client.auth.getSession()
        if (session) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error)
      }
    }

    checkSession()
  }, [router])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Voyagez intelligemment avec</span>
          </h1>
          
          <div className="mt-8 flex justify-center">
            <div className="relative w-[300px] h-[300px]">
              <Image
                src="/images/activities/Mascot.png"
                alt="Mascotte Odys"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>

          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Créez votre programme de voyage personnalisé en quelques clics grâce à notre assistant intelligent.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/generate"
              className="rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Commencer
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-white px-6 py-3 text-base font-medium text-indigo-600 shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-50"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
