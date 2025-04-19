import { motion } from 'framer-motion'

interface NoSuggestionsCardProps {
  categoryLabel: string
  isLastCategory: boolean
  onNext: () => void
}

export default function NoSuggestionsCard({ categoryLabel, isLastCategory, onNext }: NoSuggestionsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-md p-6 text-center"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Aucune suggestion pour {categoryLabel}
      </h3>
      <p className="text-gray-600 mb-6">
        Nous n'avons pas trouvé d'activités correspondant à cette catégorie pour votre destination.
      </p>
      <button
        onClick={onNext}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        {isLastCategory ? 'Terminer la sélection' : 'Passer à la catégorie suivante'}
      </button>
    </motion.div>
  )
} 