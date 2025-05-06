'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import ReactDOM from 'react-dom'

// Composant pour la modale de connexion
function LoginModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (!open) return null

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const client = createClient()
      if (!client) throw new Error('Impossible de créer le client Supabase')
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=%2Fdashboard`,
          queryParams: { access_type: 'offline', prompt: 'consent' }
        },
      })
      if (error) throw error
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const client = createClient()
      if (!client) throw new Error('Impossible de créer le client Supabase')
      const { error } = await client.auth.signInWithPassword({ email, password })
      if (error) throw error
      setLoading(false)
      onClose()
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto rounded-t-2xl bg-white p-6 pb-8 shadow-lg relative animate-slideup"
        style={{ minHeight: 400 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-2 right-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-4 mt-1" />
          <h2 className="text-xl font-bold mb-4 text-center">Connexion</h2>
          <button
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold mt-2 mb-4 disabled:opacity-60"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            Se connecter avec Google
          </button>
          <form className="w-full flex flex-col gap-3 mb-2" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
              required
            />
            {error && <div className="text-red-600 text-sm bg-red-100 rounded-md p-2">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 text-white rounded-lg font-semibold mt-2 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
      <style jsx global>{`
        @keyframes slideup {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideup {
          animation: slideup 0.25s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  )

  if (typeof window !== 'undefined') {
    return ReactDOM.createPortal(modalContent, document.body)
  }
  return null
}

// Composant image avec fallback individuel
function ImageWithFallback({ src, alt, ...props }: { src: string, alt: string, [key: string]: any }) {
  const [error, setError] = useState(false)
  useEffect(() => { setError(false) }, [src])
  return (
    <Image
      src={error ? '/images/fallback/img-fallback.png' : src}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  )
}

// Fonction utilitaire pour obtenir l'image d'une destination (même logique que ProgramClient)
const getDestinationImage = (destination: string) => {
  const cityImages: { [key: string]: string } = {
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    'Lyon': 'https://images.unsplash.com/photo-1524396309943-e03f5249f002',
    'Marseille': 'https://images.unsplash.com/photo-1544968464-9ba06f6fce3d',
    'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    'Londres': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    'Bruxelles': 'https://images.unsplash.com/photo-1581162907694-96ef5b0a75e5',
    'Madeira': 'https://images.unsplash.com/photo-1593105544559-f0adc7d8a0b1'
  }
  return {
    url: cityImages[destination] || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    alt: `Vue de ${destination || 'la ville'}`
  }
}

// Carrousel horizontal (plusieurs cartes visibles)
function PopularDestinations() {
  const [destinationsData, setDestinationsData] = useState<{ city: string, country?: string, imageurl?: string }[]>([])
  const router = useRouter()

  // Liste des destinations populaires (pour l'ordre et le pays)
  const popularList = [
    { city: 'Paris', country: 'France' },
    { city: 'Rome', country: 'Italie' },
    { city: 'Londres', country: 'Royaume-Uni' },
    { city: 'Lyon', country: 'France' },
    { city: 'Marseille', country: 'France' },
    { city: 'New York', country: 'USA' },
    { city: 'Bruxelles', country: 'Belgique' },
    { city: 'Madeira', country: 'Portugal' },
  ]

  useEffect(() => {
    const fetchDestinations = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('destinations')
        .select('city, imageurl')
      if (!error && data) setDestinationsData(data)
    }
    fetchDestinations()
  }, [])

  const getImageForCity = (city: string) => {
    // Cherche dans la BDD
    const found = destinationsData.find(d => d.city.toLowerCase() === city.toLowerCase())
    return found?.imageurl || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df'
  }

  const handleDestinationClick = (destination: string) => {
    localStorage.setItem('formData', JSON.stringify({
      destination,
      startDate: null,
      endDate: null,
      companion: null,
      budget: null,
      moods: []
    }))
    localStorage.setItem('destinationValidee', 'true')
    router.push('/generate')
  }

  return (
    <section className="mt-8 w-full flex flex-col items-center">
      <div className="flex items-center justify-between mb-4 w-full px-2">
        <h2 className="text-xl font-bold">Destinations populaires</h2>
      </div>
      <div className="w-full overflow-x-auto scrollbar-hide no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex gap-6 px-2 pb-2 whitespace-nowrap">
          {popularList.map((dest) => {
            const imgUrl = getImageForCity(dest.city)
            return (
              <div
                key={dest.city}
                className="inline-block min-w-[240px] max-w-[280px] bg-white rounded-2xl shadow-sm overflow-hidden flex-shrink-0 align-top cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleDestinationClick(dest.city)}
              >
                <div className="relative w-full h-48">
                  <ImageWithFallback src={imgUrl} alt={`Vue de ${dest.city}`} fill className="object-cover rounded-2xl" />
                </div>
                <div className="p-4 w-full text-left">
                  <div className="font-bold text-xl">{dest.city}</div>
                  <div className="text-gray-500 text-base">{dest.country}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const client = createClient()
        if (!client) return
        const { data: { session } } = await client.auth.getSession()
        setIsLoggedIn(!!session)
      } catch (e) {
        setIsLoggedIn(false)
      }
    }
    checkSession()
  }, [])

  return (
    <div className="min-h-screen bg-white pb-24 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start pt-10 px-4">
        <img src="/images/Mascot.png" alt="Mascotte Odys" className="w-24 h-24 mb-4" />
        <p className="text-xl font-semibold text-center mb-8">Quelques questions<br />pour te proposer un programme sur-mesure</p>
        <PopularDestinations />
        <div className="mt-10 w-full flex flex-col items-center gap-4">
          {isLoggedIn ? (
            <button
              className="w-full max-w-xs py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-semibold shadow-md transition"
              onClick={() => router.push('/generate')}
            >
              Créer un programme
            </button>
          ) : (
            <button
              className="w-full max-w-xs py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-semibold shadow-md transition"
              onClick={() => setLoginOpen(true)}
            >
              Me connecter
            </button>
          )}
        </div>
      </div>
      {loginOpen && <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />}
    </div>
  )
}
