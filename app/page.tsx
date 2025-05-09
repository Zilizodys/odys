'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import ReactDOM from 'react-dom'
import LoginForm from '@/components/auth/LoginForm'
import { UserCog, Route, Users, Timer, ClipboardList, Sparkles, Briefcase } from 'lucide-react'

// Composant pour la modale de connexion
function LoginModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  if (!open) return null

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
          <LoginForm />
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
      <div className="mb-4 w-full">
        <h2 className="text-xl font-bold text-left pl-6">Destinations populaires</h2>
      </div>
      <div
        className="w-full overflow-x-auto scroll-smooth scrollbar-hide pl-8"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-6 pb-2 flex-nowrap" style={{ minWidth: 900 }}>
          {popularList.map((dest, i) => {
            const imgUrl = getImageForCity(dest.city)
            return (
              <div
                key={dest.city}
                className="inline-block min-w-[220px] max-w-[240px] bg-white rounded-2xl shadow-sm flex-shrink-0 align-top cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
                onClick={() => handleDestinationClick(dest.city)}
              >
                <div className="relative w-full h-40 flex items-center justify-center overflow-hidden rounded-t-2xl">
                  <ImageWithFallback src={imgUrl} alt={`Vue de ${dest.city}`} fill className="object-cover rounded-t-2xl" priority={i === 0} />
                </div>
                <div className="p-4 w-full text-left">
                  <div className="font-bold text-lg">{dest.city}</div>
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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-start pt-10 px-0">
        <h1 className="sr-only">Odys - Crée ton voyage sur-mesure</h1>
        <div className="w-full px-4 flex flex-col items-center">
          <img src="/images/Mascot.png" alt="Mascotte Odys" className="w-24 h-24 mb-4" />
          <p className="text-2xl font-bold text-indigo-700 text-center mb-6 w-full">Réponds à quelques questions pour ton voyage idéal.</p>
        </div>
        <PopularDestinations />
        <div className="mt-10 w-full flex flex-col items-center gap-4 px-4">
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

        {/* Section Comment ça marche ? */}
        <section className="mt-16 max-w-3xl w-full mx-auto text-center px-8">
          <h2 className="text-2xl font-bold mb-8 text-indigo-700">Comment ça marche&nbsp;?</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center w-full md:w-1/3 mb-4 md:mb-0">
              <ClipboardList className="mb-3 w-12 h-12 text-indigo-700" />
              <p className="font-semibold text-indigo-700 mb-1">1. Réponds à quelques questions</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center w-full md:w-1/3 mb-4 md:mb-0">
              <Sparkles className="mb-3 w-12 h-12 text-indigo-700" />
              <p className="font-semibold text-indigo-700 mb-1">2. L'algorithme Odys crée ton programme</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center w-full md:w-1/3">
              <Briefcase className="mb-3 w-12 h-12 text-indigo-700" />
              <p className="font-semibold text-indigo-700 mb-1">3. Pars l'esprit léger&nbsp;!</p>
            </div>
          </div>
        </section>

        {/* Section Témoignages */}
        <section className="mt-16 max-w-3xl w-full mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8 text-indigo-700">Ils ont voyagé avec Odys</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <blockquote className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center max-w-xs mx-auto">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                <span className="text-indigo-700 font-bold text-xl">J</span>
              </div>
              <p className="italic mb-2">“Programme ultra-personnalisé, j'ai adoré chaque activité !”</p>
              <span className="text-sm text-gray-500">— Julie, Paris</span>
            </blockquote>
            <blockquote className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center max-w-xs mx-auto">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                <span className="text-indigo-700 font-bold text-xl">K</span>
              </div>
              <p className="italic mb-2">“Super simple, rapide, et des idées auxquelles je n'aurais jamais pensé.”</p>
              <span className="text-sm text-gray-500">— Karim, Lyon</span>
            </blockquote>
          </div>
        </section>
      </main>
      {loginOpen && <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />}
      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-6 mt-12 text-center text-gray-500 text-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2 px-4">
          <div>© {new Date().getFullYear()} Odys. Tous droits réservés.</div>
          <div className="flex gap-4">
            <a href="/cgu" className="hover:underline">CGU</a>
            <a href="mailto:contact@odysway.com" className="hover:underline">Contact</a>
            <a href="https://www.instagram.com/odysway" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
