import { Fragment, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { Suggestion } from '@/types/suggestion'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface SuggestionCarouselModalProps {
  isOpen: boolean
  onClose: () => void
  suggestions: Suggestion[]
  onSelect: (suggestion: Suggestion) => void
  slotType: string
}

export default function SuggestionCarouselModal({
  isOpen,
  onClose,
  suggestions,
  onSelect,
  slotType
}: SuggestionCarouselModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [direction, setDirection] = useState(0)

  if (!isOpen) return null
  if (!suggestions.length) return null

  const suggestion = suggestions[currentIdx]

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIdx(idx => (idx > 0 ? idx - 1 : suggestions.length - 1))
  }
  const handleNext = () => {
    setDirection(1)
    setCurrentIdx(idx => (idx < suggestions.length - 1 ? idx + 1 : 0))
  }
  const handleSelect = () => {
    onSelect(suggestions[currentIdx])
    onClose()
  }

  // Swipe handlers
  const swipeConfidenceThreshold = 100
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > swipeConfidenceThreshold) {
      handlePrev()
    } else if (info.offset.x < -swipeConfidenceThreshold) {
      handleNext()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center w-screen">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Bottom sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl pb-8 pt-4 px-0 flex flex-col items-center z-[101]"
        style={{ minHeight: 520 }}
      >
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 mt-1" />
        {/* Titre centré au-dessus de la carte */}
        <div className="w-full flex justify-center items-center px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900 text-center w-full truncate">
            Suggestions pour le créneau <span className="text-indigo-600">{slotType}</span>
          </h3>
        </div>
        {/* Carrousel swipeable */}
        <div className="relative w-full flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-full flex items-center justify-center h-[340px] mb-4">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={suggestion.id}
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                className="w-full h-[340px]"
                style={{ minHeight: 340, maxHeight: 340 }}
              >
                <div className="relative w-full h-[340px] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={suggestion.image || `https://placehold.co/600x400/e4e4e7/1f2937?text=${encodeURIComponent(suggestion.title)}`}
                    alt={suggestion.title}
                    fill
                    className="object-cover"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h4 className="text-xl font-bold mb-1 truncate">{suggestion.title}</h4>
                    <p className="text-sm mb-1 line-clamp-2">{suggestion.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span>{suggestion.location || suggestion.category}</span>
                      <span>{suggestion.price_estimate ? '€'.repeat(Math.min(Math.ceil(suggestion.price_estimate / 50), 3)) : suggestion.price > 0 ? `${suggestion.price}€` : 'Gratuit'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* CTA */}
          <button
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mb-4 mt-4 shadow-md"
            onClick={handleSelect}
          >
            Choisir cette suggestion
          </button>
          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-2 mb-6">
            {suggestions.map((_, idx) => (
              <button
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIdx ? 'bg-indigo-600 scale-125' : 'bg-gray-300'}`}
                onClick={() => { setDirection(idx > currentIdx ? 1 : -1); setCurrentIdx(idx) }}
                aria-label={`Aller à la suggestion ${idx + 1}`}
              />
            ))}
          </div>
          {/* Navigation boutons */}
          <div className="flex justify-between w-full px-2 mt-0 mb-2 gap-2">
            <button
              onClick={handlePrev}
              className="text-indigo-500 font-medium px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Précédent
            </button>
            <button
              onClick={handleNext}
              className="text-indigo-500 font-medium px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
        {/* Close button (toujours au-dessus) */}
        <button
          type="button"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <FiX className="h-6 w-6" />
        </button>
      </motion.div>
    </div>
  )
} 