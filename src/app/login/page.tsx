'use client'

import { signInWithGoogle } from '@/lib/supabase/auth'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Erreur de connexion:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Connectez-vous à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Pour sauvegarder vos programmes de voyage
          </p>
        </div>
        <div>
          <button
            onClick={handleGoogleLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continuer avec Google
          </button>
        </div>
      </div>
    </div>
  )
} 