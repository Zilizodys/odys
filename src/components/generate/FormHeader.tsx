import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface FormHeaderProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
}

export default function FormHeader({
  currentStep,
  totalSteps,
  onPrevious
}: FormHeaderProps) {
  const router = useRouter()
  // La barre commence à 1/totalSteps dès la première étape
  const progress = (currentStep / totalSteps) * 100
  const [logoError, setLogoError] = useState(false)

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
        {/* Flèche retour */}
        <button
          onClick={onPrevious}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${currentStep === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          disabled={currentStep === 1}
          aria-label="Retour"
        >
          <FiArrowLeft size={24} />
        </button>
        {/* Logo centré avec fallback React */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => router.push('/')}
            className="focus:outline-none"
          >
            {logoError ? (
              <span className="text-xl font-bold">Odys.ai</span>
            ) : (
              <Image
                src="/Odys-logo.svg"
                alt="Odys.ai"
                width={80}
                height={28}
                className="object-contain"
                onError={() => setLogoError(true)}
                priority
              />
            )}
          </button>
        </div>
        {/* Pagination à droite */}
        <div className="w-12 text-right text-lg font-medium flex-shrink-0">
          <span className="text-black">{currentStep}</span>
          <span className="text-gray-400">/{totalSteps}</span>
        </div>
      </div>
      {/* Progress bar juste en dessous */}
      <div className="max-w-2xl mx-auto px-4 pb-2">
        <div className="relative w-full h-3 flex items-center">
          <div className="absolute w-full h-2 bg-gray-100 rounded-full" />
          <motion.div
            className="absolute h-2 bg-blue-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: '100%' }}
          />
        </div>
      </div>
    </div>
  )
} 