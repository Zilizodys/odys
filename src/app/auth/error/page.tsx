'use client'

import Link from 'next/link'

export default function AuthError() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-red-600">Erreur d'authentification</h2>
        <p className="text-center text-gray-600">
          Une erreur s'est produite lors de la tentative de connexion.
        </p>
        <Link
          href="/"
          className="block w-full px-4 py-2 mt-4 text-center text-blue-600 transition-colors duration-300 border border-blue-300 rounded-lg hover:bg-blue-50"
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  )
} 