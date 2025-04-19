'use client'

import { FiTrash2, FiClock } from 'react-icons/fi'
import type { Suggestion } from '@/types/suggestion'

interface ProgramActivityProps {
  activity: Suggestion
  onDelete: (id: string) => void
}

export default function ProgramActivity({ activity, onDelete }: ProgramActivityProps) {
  const formatDuration = (duration: string | undefined) => {
    if (!duration) return 'Durée non spécifiée'
    return `${duration}`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {activity.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            {activity.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              {formatDuration(activity.duration)}
            </span>
            <span>Prix : {activity.price}€</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(activity.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Supprimer l'activité"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
} 