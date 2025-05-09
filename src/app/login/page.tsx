'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LoginForm from '@/components/auth/LoginForm'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const tempProgram = localStorage.getItem('tempProgram')
        if (tempProgram) {
          try {
            const programData = JSON.parse(tempProgram)
            const { error } = await supabase
              .from('programs')
              .insert([{
                user_id: session.user.id,
                destination: programData.destination,
                start_date: programData.start_date,
                end_date: programData.end_date,
                budget: programData.budget,
                companion: programData.companion,
                activities: programData.activities,
                moods: programData.moods
              }])

            if (error) throw error

            localStorage.removeItem('tempProgram')
            router.push('/dashboard')
          } catch (error) {
            console.error('Erreur lors de la sauvegarde du programme:', error)
            router.push('/dashboard')
          }
        } else {
          router.push('/dashboard')
        }
      }
    }
    checkSession()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Image
            src="/images/activities/Mascot.png"
            alt="Logo"
            width={100}
            height={100}
            priority
            style={{ width: 'auto', height: 'auto' }}
            className="mx-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Connectez-vous à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              créez un compte
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense>
        <LoginForm />
        </Suspense>
      </div>
    </div>
  )
} 