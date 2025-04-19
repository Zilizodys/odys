'use client'

import { memo } from 'react'

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
          <div
            key={mood}
            className={`h-2 flex-1 rounded-full ${
              index === currentMoodIndex
                ? 'bg-indigo-600'
                : index < currentMoodIndex
                ? 'bg-indigo-200'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(MoodTabBar) 