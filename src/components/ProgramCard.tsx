'use client'

import { motion } from 'framer-motion'
import { MapPin, Calendar, DollarSign, Users, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Program } from '@/types/program'
import { COMPANION_OPTIONS } from '@/types/form'

interface ProgramCardProps {
  program: Program
  onDelete?: (id: string) => void
}

export default function ProgramCard({ program, onDelete }: ProgramCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) {
      onDelete(program.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <Link href={`/program/${program.id}`} className="block">
        <div className="relative h-48">
          <Image
            src={program.coverImage || `/images/destinations/${program.destination.toLowerCase()}.jpg`}
            alt={`Photo de ${program.destination}`}
            fill
            className="object-cover"
            priority
          />
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </motion.button>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{program.title}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-indigo-500" />
              <span>{program.destination}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} className="text-indigo-500" />
              <span>
                Du {new Date(program.start_date).toLocaleDateString('fr-FR')} au{' '}
                {new Date(program.end_date).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign size={16} className="text-indigo-500" />
              <span>{program.budget}€</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={16} className="text-indigo-500" />
              <span>
                {COMPANION_OPTIONS.find(option => option.value === program.companion)?.label || program.companion}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
} 