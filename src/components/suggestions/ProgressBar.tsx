import { motion } from 'framer-motion'

interface ProgressBarProps {
  currentIndex: number
  totalItems: number
}

export default function ProgressBar({ currentIndex, totalItems }: ProgressBarProps) {
  const progress = totalItems > 0 ? (currentIndex / totalItems) * 100 : 0

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-indigo-600"
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
} 