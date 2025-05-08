import { Activity } from '@/types/activity'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ActivityModal from '@/components/ActivityModal'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { TimeSlot } from '@/lib/planning/autoAssign'

interface ActivitySlotEditorProps {
  activity: Activity
  slotIndex: number
  onChange: (newActivity: Activity) => void
  onAddRestaurant?: (slotIndex: number) => void
  onAddActivity?: () => void
  dayIndex?: number
  programId?: string
  city?: string
  budget?: number
  onDelete?: () => void
  onActivityClick?: (activity: Activity) => void
}

const isMealSlot = (slot: TimeSlot) => slot === 'midi' || slot === 'dîner'

export default function ActivitySlotEditor({ activity, slotIndex, onChange, onAddRestaurant, onAddActivity, dayIndex, programId, city, budget, onDelete, onActivityClick }: ActivitySlotEditorProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const handleAddRestaurantClick = () => {
    if (city && programId !== undefined && dayIndex !== undefined && slotIndex !== undefined) {
      const url = `/suggestions?type=restaurant&city=${encodeURIComponent(city)}&budget=${budget ?? ''}&program=${programId}&day=${dayIndex}&slot=${slotIndex}`
      router.push(url)
    } else if (onAddRestaurant) {
      onAddRestaurant(slotIndex)
    }
  }

  return (
    <div
      className="w-full flex flex-col gap-2 py-3 px-0 rounded"
      onClick={() => {
        if (onActivityClick) {
          onActivityClick(activity)
        } else {
          setShowModal(true)
        }
      }}
    >
      <div className="flex items-center w-full gap-2 mb-0">
        <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5 whitespace-nowrap">{activity.category}</span>
        {activity.price === 0 ? (
          <span className="text-xs text-indigo-600 whitespace-nowrap">Gratuit</span>
        ) : (
          <span className="text-xs text-gray-500 whitespace-nowrap">{activity.price}€</span>
        )}
        <button
          className="ml-auto text-gray-300 hover:text-red-500 transition-colors"
          title="Supprimer"
          onClick={e => {
            e.stopPropagation()
            if (onDelete) onDelete()
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div className="font-medium text-gray-900 w-full mb-0">{activity.title}</div>
      <div className="text-xs text-gray-400">{activity.address}</div>
      {showModal && (
        <ActivityModal
          activity={activity}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
} 