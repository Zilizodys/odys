'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

interface MoodTabBarProps {
  moods: string[]
  currentMoodIndex: number
  getMoodLabel: (mood: string) => string
}

function MoodTabBar({ moods, currentMoodIndex, getMoodLabel }: MoodTabBarProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Suggestions pour {getMoodLabel(moods[currentMoodIndex])}
      </h1>
      <div className="flex gap-2">
        {moods.map((mood, index) => (
          <div key={mood} className="relative h-2 flex-1">
            <div className="absolute inset-0 rounded-full bg-gray-200" />
            {index <= currentMoodIndex && (
              <motion.div
                className="absolute inset-0 rounded-full bg-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(MoodTabBar) 