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
}

const isMealSlot = (slot: TimeSlot) => slot === 'midi' || slot === 'dîner'

export default function ActivitySlotEditor({ activity, slotIndex, onChange, onAddRestaurant, onAddActivity, dayIndex, programId, city, budget }: ActivitySlotEditorProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  // Log des props reçues pour debug
  console.log('[DEBUG PROPS] city:', city, 'programId:', programId, 'dayIndex:', dayIndex, 'slotIndex:', slotIndex)

  const handleAddRestaurantClick = () => {
    if (city && programId !== undefined && dayIndex !== undefined && slotIndex !== undefined) {
      const url = `/suggestions?type=restaurant&city=${encodeURIComponent(city)}&budget=${budget ?? ''}&program=${programId}&day=${dayIndex}&slot=${slotIndex}`
      console.log('[DEBUG REDIRECT] Redirection vers :', url)
      router.push(url)
    } else if (onAddRestaurant) {
      onAddRestaurant(slotIndex)
    }
  }

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-3 w-full min-h-[80px] flex flex-col justify-between cursor-pointer transition hover:bg-gray-50"
      onClick={() => setShowModal(true)}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-semibold uppercase tracking-wide">
            {activity.category}
          </span>
          <span className="text-xs font-bold text-indigo-700">
            {activity.price === 0 ? 'Gratuit' : `${activity.price}€`}
          </span>
        </div>
        <div className="font-bold text-indigo-900 text-base truncate mb-1 group-hover:underline">
          {activity.title}
        </div>
        <div className="text-gray-500 text-xs truncate mb-2">
          {activity.address}
        </div>
      </div>
      <button
        className="self-end text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded transition-colors border border-transparent hover:border-red-200 bg-transparent"
        onClick={(e) => {
          e.stopPropagation()
          onChange(activity)
        }}
      >
        Supprimer
      </button>
      {showModal && (
        <ActivityModal
          activity={activity}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
} 