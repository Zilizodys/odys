'use client'

import { useState, useEffect } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { Activity } from '@/types/activity'
import SwipeableActivityCard, { SwipeableActivityCardProps } from './SwipeableActivityCard'

interface CategorySectionProps {
  category: string
  activities: Activity[]
  onActivityClick: NonNullable<SwipeableActivityCardProps['onClick']>
  onActivityDelete: SwipeableActivityCardProps['onDelete']
  programId?: string
  programActivities?: { activityId: string; day: number; slot: number }[]
}

const CATEGORY_LABELS: Record<string, string> = {
  'culture': 'Culture',
  'gastronomie': 'Gastronomie',
  'sport': 'Sport',
  'vie nocturne': 'Vie nocturne',
  'nature': 'Nature'
}

export default function CategorySection({ 
  category, 
  activities, 
  onActivityClick, 
  onActivityDelete,
  programId,
  programActivities = []
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (category === activities[0]?.category) {
      setIsExpanded(true)
    }
  }, [category, activities])

  const isActivityInProgram = (activityId: string) => {
    return programActivities.find(pa => pa.activityId === activityId)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {CATEGORY_LABELS[category] || category}
          </h2>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
            {activities.length}
          </span>
        </div>
        {isExpanded ? (
          <FiChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="p-4 space-y-3" style={{ overflow: 'visible' }}>
            {activities.map((activity) => {
              const programActivity = isActivityInProgram(activity.id)
              return (
                <SwipeableActivityCard
                  key={activity.id}
                  activity={activity}
                  onDelete={onActivityDelete}
                  onClick={onActivityClick}
                  programId={programId}
                  isUsedInProgram={!!programActivity}
                  programDay={programActivity?.day}
                  programSlot={programActivity?.slot}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 