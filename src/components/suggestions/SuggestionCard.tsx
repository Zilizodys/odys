'use client'

import { motion, PanInfo, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { Suggestion } from '@/types/suggestion'

interface SuggestionCardProps {
  suggestion: Suggestion
  onSwipe: (direction: 'left' | 'right') => void
  isTop: boolean
}

export default function SuggestionCard({ suggestion, onSwipe, isTop }: SuggestionCardProps) {
  const controls = useAnimation()

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= 100) {
      const direction = offset > 0 ? 'right' : 'left'
      await controls.start({
        x: direction === 'right' ? 1000 : -1000,
        rotate: direction === 'right' ? 20 : -20,
        transition: { duration: 0.5 }
      })
      onSwipe(direction)
    } else {
      controls.start({ x: 0, rotate: 0, transition: { type: 'spring' } })
    }
  }

  useEffect(() => {
    controls.start({ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 })
  }, [isTop, controls])

  return (
    <motion.div
      className={`absolute w-full ${isTop ? 'z-10' : 'z-0'}`}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: 1 }}
    >
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
        <img
          src={suggestion.image}
          alt={suggestion.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h3 className="text-2xl font-bold mb-2">{suggestion.title}</h3>
          <p className="text-sm mb-2">{suggestion.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm">{suggestion.location}</span>
            <span className="text-sm">
              {suggestion.price_estimate > 0 
                ? '€'.repeat(Math.min(Math.ceil(suggestion.price_estimate / 50), 3))
                : 'Gratuit'}
            </span>
          </div>
          {suggestion.link && (
            <a
              href={suggestion.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block px-4 py-2 bg-white/20 rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              Plus d'infos →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
} 