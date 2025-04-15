'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Suggestion, SuggestionCategory } from '@/types/suggestion'

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

  const currentCategory = CATEGORIES[currentCategoryIndex]

  const handleNext = () => {
    if (currentCategoryIndex < CATEGORIES.length - 1) {
      setDirection(1)
      setCurrentCategoryIndex(prev => prev + 1)
    }
  }

  const handleSwipe = (swipeDirection: number) => {
    if (swipeDirection > 0) {
      // Swipe à droite = sauvegarder
      onSave({
        id: Date.now().toString(),
        title: "Exemple d'activité",
        description: "Description de l'activité",
        category: currentCategory,
        duration: "2 heures",
        price: 25
      })
    } else {
      // Swipe à gauche = passer
      onSkip()
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
              
              {/* Exemple de carte de suggestion */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <h3 className="text-xl font-semibold mb-2">Exemple d'activité</h3>
                <p className="text-gray-600 mb-4">Description de l'activité</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>2 heures</span>
                  <span>25€</span>
                </div>
              </div>
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