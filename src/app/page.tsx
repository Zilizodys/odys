'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import ReactDOM from 'react-dom'
import LoginForm from '@/components/auth/LoginForm'

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

// Hook pour scroll horizontal par drag
function useHorizontalDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    // Mouse events
    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      el.classList.add('dragging');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      el.classList.remove('dragging');
    };
    const onMouseUp = () => {
      isDown = false;
      el.classList.remove('dragging');
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    // Touch events
    const onTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onTouchEnd = () => { isDown = false; };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchmove', onTouchMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, []);
  return ref;
}

// Carrousel horizontal (plusieurs cartes visibles)
function PopularDestinations() {
  const [destinationsData, setDestinationsData] = useState<{ city: string, country?: string, imageurl?: string }[]>([])
  const router = useRouter()
  const scrollRef = useHorizontalDragScroll();

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
      <div
        ref={scrollRef}
        className="w-full scrollbar-hide"
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          cursor: 'grab',
        }}
      >
        <div className="flex gap-6 px-2 pb-2 flex-nowrap" style={{ minWidth: 900 }}>
          {popularList.map((dest, i) => {
            const imgUrl = getImageForCity(dest.city)
            return (
              <div
                key={dest.city}
                className="inline-block min-w-[240px] max-w-[280px] bg-white rounded-2xl shadow-sm flex-shrink-0 align-top cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleDestinationClick(dest.city)}
              >
                <div className="relative w-full h-48">
                  <ImageWithFallback src={imgUrl} alt={`Vue de ${dest.city}`} fill className="object-cover rounded-2xl" priority={i === 0} />
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
