'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: number
  className?: string
}

export default function LoadingSpinner({ size = 24, className = '' }: LoadingSpinnerProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={className}
    >
      <Loader2 size={size} className="text-indigo-600" />
    </motion.div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size={32} />
    </div>
  )
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm">
      <LoadingSpinner size={32} />
    </div>
  )
} 