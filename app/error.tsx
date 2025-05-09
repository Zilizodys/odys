'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">Erreur</h1>
        <p className="mt-4 text-xl text-gray-600">Une erreur est survenue</p>
        <button
          onClick={reset}
          className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
} 