// SavedProgram component - Displays a saved travel program with activities
'use client'

import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi'
import type { FormData } from '@/types/form'
import type { Suggestion } from '@/types/suggestion'

interface SavedProgramProps {
  id: string
  formData: FormData
  activities: Suggestion[]
  onDelete: (id: string) => void
}

export default function SavedProgram({ id, formData, activities, onDelete }: SavedProgramProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {formData.destination}
            </h2>
            <div className="text-sm text-gray-500">
              <p>Du {formData.startDate || ''} au {formData.endDate || ''}</p>
              <p>Voyage {formData.companion?.toLowerCase() || ''} • Budget : {formData.budget || 0}€</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-2"
              aria-label="Supprimer le programme"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              aria-label={isExpanded ? "Réduire" : "Développer"}
            >
              {isExpanded ? (
                <FiChevronUp className="w-5 h-5" />
              ) : (
                <FiChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Activités ({activities.length})
          </h3>
          <div className="space-y-3">
            {activities.map(activity => (
              <div key={activity.id} className="bg-gray-50 rounded p-3">
                <h4 className="font-medium text-gray-900 mb-1">
                  {activity.title}
                </h4>
                <p className="text-sm text-gray-500 mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Durée : {activity.duration}</span>
                  <span>Prix : {activity.price}€</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 