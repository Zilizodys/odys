'use client'

import { motion } from 'framer-motion'

interface StepWrapperProps {
  children: React.ReactNode
  title: string
  direction?: 'left' | 'right'
}

export default function StepWrapper({ children, title, direction = 'right' }: StepWrapperProps) {
  const variants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: string) => ({
      zIndex: 0,
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0
    })
  }

  return (
    <motion.div
      className="w-full p-6"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      {children}
    </motion.div>
  )
} 