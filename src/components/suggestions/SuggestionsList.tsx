'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Suggestion, SuggestionCategory } from '@/types/suggestion'
import { MOCK_SUGGESTIONS } from '@/types/suggestion'
import Image from 'next/image'

const CATEGORIES: SuggestionCategory[] = [
  'Vie nocturne',
  'Culture',
  'Gastronomie',
  'Nature',
  'Shopping',
  'Sport'
]

interface SuggestionsListProps {
  onSave: (suggestion: Suggestion) => void
  onSkip: () => void
}

export default function SuggestionsList({ onSave, onSkip }: SuggestionsListProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  const currentCategory = CATEGORIES[currentCategoryIndex]
  const currentSuggestions = MOCK_SUGGESTIONS.filter(s => s.category === currentCategory)
  const currentSuggestion = currentSuggestions[currentSuggestionIndex]

  const handleImageError = () => {
    setImageError(true)
  }

  const handleNext = () => {
    if (currentCategoryIndex < CATEGORIES.length - 1) {
      setDirection(1)
      setCurrentCategoryIndex(prev => prev + 1)
      setCurrentSuggestionIndex(0)
    }
  }

  const handleSwipe = (swipeDirection: number) => {
    if (swipeDirection > 0) {
      // Swipe à droite = sauvegarder
      onSave(currentSuggestion)
      if (currentSuggestionIndex < currentSuggestions.length - 1) {
        setCurrentSuggestionIndex(prev => prev + 1)
      } else {
        handleNext()
      }
    } else {
      // Swipe à gauche = passer
      onSkip()
      if (currentSuggestionIndex < currentSuggestions.length - 1) {
        setCurrentSuggestionIndex(prev => prev + 1)
      } else {
        handleNext()
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">{currentCategory}</h2>
              <p className="text-gray-500 mb-8">
                Swipez à droite pour sauvegarder, à gauche pour passer
              </p>
              
              {currentSuggestion && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-48 w-full bg-gray-100">
                    {!imageError && currentSuggestion.image ? (
                      <Image
                        src={currentSuggestion.image}
                        alt={currentSuggestion.title}
                        fill
                        className="object-cover"
                        onError={handleImageError}
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-400">Image non disponible</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{currentSuggestion.title}</h3>
                    <p className="text-gray-600 mb-4">{currentSuggestion.description}</p>
                    {currentSuggestion.location && (
                      <p className="text-sm text-gray-500 mb-4">{currentSuggestion.location}</p>
                    )}
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{currentSuggestion.duration}</span>
                      <span>{currentSuggestion.price}€</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-4 flex justify-center">
        <button
          onClick={handleNext}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Voir la catégorie suivante
        </button>
      </div>
    </div>
  )
} 