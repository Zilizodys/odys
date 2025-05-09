import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page non trouvée</h2>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FiArrowLeft className="mr-2" />
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  )
} 