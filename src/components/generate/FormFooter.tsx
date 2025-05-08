import React from 'react'

interface FormFooterProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  isNextDisabled: boolean
  isLoading: boolean
}

export default function FormFooter({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isNextDisabled,
  isLoading
}: FormFooterProps) {
  return (
    <div className="w-full bg-white border-t border-gray-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-2 flex gap-4">
        <button
          onClick={onPrevious}
          className={`w-1/2 px-6 py-3 rounded-lg font-medium transition-colors text-base ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          disabled={currentStep === 1 || isLoading}
        >
          Précédent
        </button>
        <button
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className={`w-1/2 px-6 py-3 rounded-lg font-medium text-base transition-colors ${
            isNextDisabled || isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {currentStep === totalSteps ? 'Voir les suggestions' : 'Suivant'}
        </button>
      </div>
    </div>
  )
} 