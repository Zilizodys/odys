import { motion } from 'framer-motion'

interface ProgressBarProps {
  currentIndex: number
  totalItems: number
}

export default function ProgressBar({ currentIndex, totalItems }: ProgressBarProps) {
  const progress = (currentIndex / totalItems) * 100

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-indigo-600"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
} 