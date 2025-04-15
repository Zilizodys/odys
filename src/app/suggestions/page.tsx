'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import ActivityCard from '@/components/suggestions/ActivityCard'
import Header from '../../components/Header'

interface Activity {
  id: string
  title: string
  description: string
  price: number
  address: string
  imageUrl: string
  category: string
}

// Mapping des moods vers les clés des activités
const MOOD_TO_ACTIVITY_KEY: Record<string, keyof typeof MOCK_ACTIVITIES> = {
  'romantic': 'romantic',
  'cultural': 'cultural',
  'adventure': 'adventure',
  'party': 'party',
  'relaxation': 'relaxation'
}

// Mock data - À remplacer par des vraies données de l'API
const MOCK_ACTIVITIES: Record<string, Activity[]> = {
  romantic: [
    {
      id: 'r1',
      title: 'Dîner aux chandelles sur la Seine',
      description: 'Profitez d\'un dîner romantique sur un bateau-mouche avec vue sur les monuments parisiens illuminés',
      price: 89,
      address: 'Port de la Conférence, Paris',
      imageUrl: 'https://placehold.co/600x400/e4e4e7/1f2937?text=Dîner+sur+la+Seine',
      category: 'Romantique'
    },
    {
      id: 'r2',
      title: 'Coucher de soleil à Montmartre',
      description: 'Admirez Paris depuis les marches du Sacré-Cœur avec une coupe de champagne',
      price: 45,
      address: 'Place du Tertre, Paris',
      imageUrl: '/images/activities/montmartre-sunset.jpg',
      category: 'Romantique'
    },
    {
      id: 'r3',
      title: 'Jardin des Tuileries en calèche',
      description: 'Balade romantique en calèche dans le plus beau jardin de Paris',
      price: 75,
      address: 'Jardin des Tuileries, Paris',
      imageUrl: '/images/activities/tuileries-carriage.jpg',
      category: 'Romantique'
    },
    {
      id: 'r4',
      title: 'Dégustation de macarons Ladurée',
      description: 'Découvrez les saveurs emblématiques de la plus célèbre maison de macarons',
      price: 35,
      address: 'Champs-Élysées, Paris',
      imageUrl: '/images/activities/macarons.jpg',
      category: 'Romantique'
    },
    {
      id: 'r5',
      title: 'Soirée opéra Garnier',
      description: 'Une soirée magique dans le plus bel opéra du monde',
      price: 150,
      address: 'Place de l\'Opéra, Paris',
      imageUrl: '/images/activities/opera.jpg',
      category: 'Romantique'
    }
  ],
  cultural: [
    {
      id: 'c1',
      title: 'Visite privée du Louvre',
      description: 'Découvrez les chefs-d\'œuvre du plus grand musée du monde avec un guide expert',
      price: 65,
      address: 'Rue de Rivoli, Paris',
      imageUrl: 'https://placehold.co/600x400/e4e4e7/1f2937?text=Le+Louvre',
      category: 'Culture'
    },
    {
      id: 'c2',
      title: 'Musée d\'Orsay: Impressionnisme',
      description: 'Plongez dans l\'univers des impressionnistes dans une ancienne gare',
      price: 45,
      address: 'Rue de la Légion d\'Honneur, Paris',
      imageUrl: '/images/activities/orsay.jpg',
      category: 'Culture'
    },
    {
      id: 'c3',
      title: 'Centre Pompidou: Art Moderne',
      description: 'Explorez l\'art contemporain dans un bâtiment emblématique',
      price: 40,
      address: 'Place Georges-Pompidou, Paris',
      imageUrl: '/images/activities/pompidou.jpg',
      category: 'Culture'
    },
    {
      id: 'c4',
      title: 'Château de Versailles',
      description: 'Visitez le château le plus prestigieux de France et ses jardins',
      price: 95,
      address: 'Place d\'Armes, Versailles',
      imageUrl: '/images/activities/versailles.jpg',
      category: 'Culture'
    },
    {
      id: 'c5',
      title: 'Atelier de peinture Montmartre',
      description: 'Créez votre propre œuvre d\'art avec un artiste local',
      price: 55,
      address: 'Place du Tertre, Paris',
      imageUrl: '/images/activities/painting.jpg',
      category: 'Culture'
    }
  ],
  adventure: [
    {
      id: 'a1',
      title: 'Escalade à Fontainebleau',
      description: 'Journée d\'escalade dans le site naturel mondialement connu de Fontainebleau',
      price: 45,
      address: 'Forêt de Fontainebleau',
      imageUrl: '/images/activities/climbing.jpg',
      category: 'Aventure'
    },
    {
      id: 'a2',
      title: 'Vol en montgolfière',
      description: 'Survolez les châteaux de la Loire au lever du soleil',
      price: 220,
      address: 'Château de Chambord',
      imageUrl: '/images/activities/balloon.jpg',
      category: 'Aventure'
    },
    {
      id: 'a3',
      title: 'Parcours accrobranche',
      description: 'Défiez-vous dans les arbres avec des tyroliennes spectaculaires',
      price: 35,
      address: 'Parc de Saint-Cloud',
      imageUrl: '/images/activities/accrobranche.jpg',
      category: 'Aventure'
    },
    {
      id: 'a4',
      title: 'Karting indoor',
      description: 'Courses palpitantes sur une piste professionnelle',
      price: 55,
      address: 'RKC Paris',
      imageUrl: '/images/activities/karting.jpg',
      category: 'Aventure'
    },
    {
      id: 'a5',
      title: 'Simulateur de chute libre',
      description: 'Vivez les sensations du saut en parachute en intérieur',
      price: 85,
      address: 'iFLY Paris',
      imageUrl: '/images/activities/skydive.jpg',
      category: 'Aventure'
    }
  ],
  party: [
    {
      id: 'p1',
      title: 'Soirée Jazz au Duc des Lombards',
      description: 'Une soirée inoubliable dans l\'un des meilleurs clubs de jazz parisiens',
      price: 35,
      address: '42 Rue des Lombards, Paris',
      imageUrl: '/images/activities/jazz.jpg',
      category: 'Fête'
    },
    {
      id: 'p2',
      title: 'Cocktails au Ritz',
      description: 'Dégustez des cocktails d\'exception dans un cadre luxueux',
      price: 95,
      address: 'Place Vendôme, Paris',
      imageUrl: '/images/activities/ritz.jpg',
      category: 'Fête'
    },
    {
      id: 'p3',
      title: 'Croisière DJ Set',
      description: 'Dansez sur la Seine avec les meilleurs DJs parisiens',
      price: 45,
      address: 'Port de la Rapée, Paris',
      imageUrl: '/images/activities/boat-party.jpg',
      category: 'Fête'
    },
    {
      id: 'p4',
      title: 'Cabaret Crazy Horse',
      description: 'Spectacle légendaire mêlant danse et créativité',
      price: 120,
      address: 'Avenue George V, Paris',
      imageUrl: '/images/activities/cabaret.jpg',
      category: 'Fête'
    },
    {
      id: 'p5',
      title: 'Rooftop du Perchoir Marais',
      description: 'Vue panoramique sur Paris avec cocktails et DJ',
      price: 25,
      address: 'Rue de la Verrerie, Paris',
      imageUrl: '/images/activities/rooftop.jpg',
      category: 'Fête'
    }
  ],
  relaxation: [
    {
      id: 'rel1',
      title: 'Spa de luxe aux Bains de Paris',
      description: 'Moment de détente absolue dans un cadre historique exceptionnel',
      price: 120,
      address: '7 Rue du Bourg l\'Abbé, Paris',
      imageUrl: '/images/activities/spa.jpg',
      category: 'Détente'
    },
    {
      id: 'rel2',
      title: 'Massage au Ritz Spa',
      description: 'Massage signature dans le plus beau spa de Paris',
      price: 180,
      address: 'Place Vendôme, Paris',
      imageUrl: '/images/activities/massage.jpg',
      category: 'Détente'
    },
    {
      id: 'rel3',
      title: 'Yoga au Jardin des Plantes',
      description: 'Séance de yoga en plein air dans un cadre verdoyant',
      price: 25,
      address: 'Rue Geoffroy-Saint-Hilaire, Paris',
      imageUrl: '/images/activities/yoga.jpg',
      category: 'Détente'
    },
    {
      id: 'rel4',
      title: 'Hammam traditionnel',
      description: 'Rituel de bien-être oriental avec gommage et massage',
      price: 85,
      address: 'Mosquée de Paris',
      imageUrl: '/images/activities/hammam.jpg',
      category: 'Détente'
    },
    {
      id: 'rel5',
      title: 'Méditation au Parc Montsouris',
      description: 'Session guidée de méditation en pleine conscience',
      price: 20,
      address: 'Parc Montsouris, Paris',
      imageUrl: '/images/activities/meditation.jpg',
      category: 'Détente'
    }
  ]
} as const;

export default function SuggestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedMoods = searchParams.get('moods')?.split(',') || []
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0)
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [savedActivities, setSavedActivities] = useState<Activity[]>([])
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Filtrer les activités par mood sélectionné
  const currentMood = selectedMoods[currentMoodIndex]?.toLowerCase()
  const currentMoodActivities = currentMood ? MOCK_ACTIVITIES[currentMood as keyof typeof MOCK_ACTIVITIES] || [] : []
  const currentActivity = currentMoodActivities[currentActivityIndex]
  const isLastActivity = currentActivityIndex === currentMoodActivities.length - 1
  const isLastMood = currentMoodIndex === selectedMoods.length - 1

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'romantic': return 'Romantique'
      case 'cultural': return 'Culturel'
      case 'adventure': return 'Aventure'
      case 'party': return 'Fête'
      case 'relaxation': return 'Détente'
      default: return mood
    }
  }

  const saveProgram = async (activities: Activity[]) => {
    try {
      // Récupérer les données du formulaire
      const formDataStr = localStorage.getItem('formData')
      if (!formDataStr) {
        console.error('Données du formulaire non trouvées')
        return false
      }

      let formData
      try {
        formData = JSON.parse(formDataStr)
      } catch (e) {
        console.error('Erreur lors du parsing des données du formulaire:', e)
        return false
      }

      if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget) {
        console.error('Données du formulaire incomplètes')
        return false
      }
      
      // Créer un nouveau programme avec la structure correcte
      const newProgram = {
        id: Date.now().toString(),
        formData: formData, // Encapsuler les données du formulaire dans formData
        activities: activities,
        createdAt: new Date().toISOString()
      }

      // Récupérer les programmes existants
      let existingPrograms = []
      try {
        existingPrograms = JSON.parse(localStorage.getItem('savedPrograms') || '[]')
      } catch (e) {
        console.error('Erreur lors de la récupération des programmes existants:', e)
        // Continue avec un tableau vide
      }
      
      // Ajouter le nouveau programme
      const updatedPrograms = [...existingPrograms, newProgram]
      
      // Sauvegarder dans le localStorage
      try {
        localStorage.setItem('savedPrograms', JSON.stringify(updatedPrograms))
        
        // Nettoyer les données temporaires
        localStorage.removeItem('savedActivities')
        localStorage.removeItem('formData')

        return true
      } catch (e) {
        console.error('Erreur lors de la sauvegarde dans le localStorage:', e)
        return false
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du programme:', error)
      return false
    }
  }

  const handleSwipe = useCallback(async (swipeDirection: 'left' | 'right') => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(swipeDirection)
    
    let newSavedActivities = savedActivities
    if (swipeDirection === 'right' && currentActivity) {
      newSavedActivities = [...savedActivities, currentActivity]
      setSavedActivities(newSavedActivities)
      try {
        localStorage.setItem('savedActivities', JSON.stringify(newSavedActivities))
      } catch (e) {
        console.error('Erreur lors de la sauvegarde des activités:', e)
      }
    }

    await new Promise(resolve => setTimeout(resolve, 200))

    if (isLastActivity) {
      if (isLastMood) {
        try {
          const success = await saveProgram(newSavedActivities)
          if (success) {
            // Attendre un peu avant la redirection pour laisser le temps à l'animation de se terminer
            await new Promise(resolve => setTimeout(resolve, 300))
            window.location.href = '/dashboard'
          } else {
            setIsAnimating(false)
            alert('Une erreur est survenue lors de la sauvegarde du programme. Veuillez réessayer.')
          }
        } catch (e) {
          console.error('Erreur lors de la sauvegarde finale:', e)
          setIsAnimating(false)
          alert('Une erreur inattendue est survenue. Veuillez réessayer.')
        }
      } else {
        setCurrentMoodIndex(prev => prev + 1)
        setCurrentActivityIndex(0)
        setDirection(null)
        setIsAnimating(false)
      }
    } else {
      setCurrentActivityIndex(prev => prev + 1)
      setDirection(null)
      setIsAnimating(false)
    }
  }, [currentActivity, isLastActivity, isLastMood, savedActivities, isAnimating])

  const handleDragEnd = useCallback((_: any, { offset }: PanInfo) => {
    const swipe = offset.x
    if (Math.abs(swipe) > 100) {
      handleSwipe(swipe > 0 ? 'right' : 'left')
    }
  }, [handleSwipe])

  useEffect(() => {
    if (selectedMoods.length === 0) {
      router.push('/generate')
    }
  }, [selectedMoods.length, router])

  if (selectedMoods.length === 0) {
    return null
  }

  if (!currentActivity) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton />
      
      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Stepper des catégories */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {selectedMoods.map((mood, index) => (
              <div
                key={mood}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  index === currentMoodIndex
                    ? 'bg-indigo-600 text-white'
                    : index < currentMoodIndex
                    ? 'bg-indigo-100'
                    : 'bg-gray-100'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold text-center text-gray-900">
            {getMoodLabel(currentMood)}
          </h2>
        </div>

        <div className="relative h-[calc(100vh-12rem)]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`${currentMoodIndex}-${currentActivityIndex}`}
              custom={direction}
              initial={{ 
                x: direction === 'left' ? 300 : direction === 'right' ? -300 : 0,
                opacity: 0,
                scale: 0.95
              }}
              animate={{ 
                x: 0,
                opacity: 1,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }
              }}
              exit={{ 
                x: direction === 'left' ? -300 : 300,
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragEnd={handleDragEnd}
              whileDrag={{
                rotate: direction === 'left' ? -7 : direction === 'right' ? 7 : 0
              }}
              className="absolute inset-0 touch-none will-change-transform"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                <div className="relative h-[70%]">
                  <img
                    src={currentActivity.imageUrl}
                    alt={currentActivity.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/600x400/e4e4e7/1f2937?text=${encodeURIComponent(currentActivity.title)}`;
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h2 className="text-2xl font-bold text-white">{currentActivity.title}</h2>
                    <p className="text-white/90">{currentActivity.category}</p>
                  </div>
                </div>
                
                <div className="p-4 space-y-2">
                  <p className="text-gray-600 line-clamp-2">{currentActivity.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500">📍 {currentActivity.address}</p>
                    <p className="text-xl font-semibold text-indigo-600">{currentActivity.price}€</p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                  <button
                    onClick={() => !isAnimating && handleSwipe('left')}
                    className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50"
                  >
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    onClick={() => !isAnimating && handleSwipe('right')}
                    className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50"
                  >
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-4 text-center text-gray-600">
          <p>Swipez à droite pour sauvegarder, à gauche pour passer</p>
          <p className="mt-1">
            {currentActivityIndex + 1} sur {currentMoodActivities.length} activités
          </p>
        </div>
      </main>
    </div>
  )
} 