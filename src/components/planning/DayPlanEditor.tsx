import { useState, useRef, useLayoutEffect } from 'react'
import { DayPlan, ScheduledActivity, TimeSlot, TIME_SLOTS } from '@/lib/planning/autoAssign'
import ActivitySlotEditor from '@/components/planning/ActivitySlotEditor'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Activity, getActivityImageUrl } from '@/types/activity'
import { getActivitiesByCriteria } from '@/lib/supabase/activities'
import { useRouter } from 'next/navigation'
import ActivitySelectionModal from './ActivitySelectionModal'
import { FormData, MoodType } from '@/types/form'
import SuggestionCarouselModal from './SuggestionCarouselModal'
import { Suggestion, SuggestionCategory } from '@/types/suggestion'

interface DayPlanEditorProps {
  day: DayPlan
  dayIndex: number
  planning: any
  onPlanningChange: (newDay: DayPlan, dayIndex: number) => void
  city: string
  programId: string
  budget?: number
  openSlots: number[]
  onToggleSlot: (slotIdx: number) => void
}

function isRestaurant(activity: Activity): boolean {
  if (!activity) return false
  const cat = activity.category?.toLowerCase() || ''
  return cat.includes('restaurant') || cat.includes('gastronomie')
}

const getDraggableId = (slotIdx: number, activityIdx: number) => `activity-${slotIdx}-${activityIdx}`;

interface Slot {
  activities: Activity[];
  slot: TimeSlot;
  order: number;
  isFreeTime?: boolean;
  isHomeMade?: boolean;
}

interface DraggableActivityCardProps {
  activity: Activity;
  activityIdx: number;
  slotIdx: number;
  slot: Slot;
  day: DayPlan;
  onChange: (newDay: DayPlan) => void;
  onAddRestaurant: (slotIdx: number) => void;
  onAddActivity: () => void;
  city: string;
  programId: string;
  dayIndex: number;
  budget?: number;
  onDelete: () => void;
  draggableId: string;
  isDragging: boolean;
  onActivityClick?: (activity: Activity, slotIdx: number) => void;
}

function DraggableActivityCard({ activity, activityIdx, slotIdx, slot, day, onChange, onAddRestaurant, onAddActivity, city, programId, dayIndex, budget, onDelete, draggableId, isDragging, onActivityClick }: DraggableActivityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (cardRef.current) {
      setCardWidth(cardRef.current.getBoundingClientRect().width);
    }
  }, [activity]);

  return (
    <Draggable draggableId={draggableId} index={activityIdx}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            minWidth: 0,
            maxWidth: '100%',
            margin: '0',
            boxSizing: 'border-box',
            paddingLeft: snapshot.isDragging ? '1rem' : undefined,
            paddingRight: snapshot.isDragging ? '1rem' : undefined,
            background: snapshot.isDragging ? '#fff' : undefined,
            borderRadius: snapshot.isDragging ? '1rem' : undefined,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform ? provided.draggableProps.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(1.02)' : 'scale(1.02)'}`
              : provided.draggableProps.style?.transform || undefined,
            transition: snapshot.isDragging ? 'box-shadow 0.2s, transform 0.2s' : undefined,
            boxShadow: snapshot.isDragging ? '0 4px 24px 0 rgba(80,80,180,0.10)' : undefined,
          }}
        >
          <ActivitySlotEditor
            activity={activity}
            slotIndex={slotIdx}
            onChange={(newActivity) => {
              const newActivities = [...slot.activities]
              newActivities[activityIdx] = newActivity
              const newDay = { ...day, activities: [...day.activities] }
              newDay.activities[slotIdx] = { ...slot, activities: newActivities }
              onChange(newDay)
            }}
            onAddRestaurant={onAddRestaurant}
            onAddActivity={onAddActivity}
            city={city}
            programId={programId}
            dayIndex={dayIndex}
            budget={budget}
            onDelete={onDelete}
            onActivityClick={onActivityClick ? () => onActivityClick(activity, slotIdx) : undefined}
          />
        </div>
      )}
    </Draggable>
  );
}

// Fonction de conversion d'Activity vers Suggestion
function activityToSuggestion(activity: Activity): Suggestion {
  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    category: activity.category as SuggestionCategory,
    duration: activity.duration || '2h',
    price: activity.price,
    image: getActivityImageUrl(activity.imageurl),
    location: activity.address,
    price_estimate: activity.price
  }
}

export default function DayPlanEditor({ day, dayIndex, planning, onPlanningChange, city, programId, budget, openSlots, onToggleSlot }: DayPlanEditorProps) {
  const [open, setOpen] = useState(dayIndex === 0)
  const [warning, setWarning] = useState<string | null>(null)
  const [selectingSlot, setSelectingSlot] = useState<number | null>(null)
  const [suggestedResto, setSuggestedResto] = useState<Activity | null>(null)
  const [loadingSuggestion, setLoadingSuggestion] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(false)
  const router = useRouter()
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedActivityIdx, setSelectedActivityIdx] = useState<number | null>(null)
  const [suggestionsForCategory, setSuggestionsForCategory] = useState<Activity[]>([])
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(null)

  // Récupère tous les restaurants déjà sélectionnés dans la journée
  const getAvailableRestaurants = (): Activity[] => {
    // Toutes les activités restaurant/gastronomie de la journée
    const allResto = day.activities
      .flatMap(a => a.activities)
      .filter(a => a && (a.category?.toLowerCase().includes('restaurant') || a.category?.toLowerCase().includes('gastronomie'))) as Activity[]
    // Exclure celles déjà utilisées dans un slot repas
    const usedRestoIds = day.activities
      .filter((a, idx) => (a.slot === 'midi' || a.slot === 'dîner') && a.activities.length > 0)
      .flatMap(a => a.activities.map(act => act.id))
    return allResto.filter(a => !usedRestoIds.includes(a.id))
  }

  // Récupère toutes les activités non utilisées dans la journée (hors restaurants pour les slots repas)
  const getAvailableActivitiesForSlot = (slotIdx: number): Activity[] => {
    const usedIds = day.activities
      .flatMap((a, idx) => idx !== slotIdx ? a.activities.map(act => act.id) : [])
    // Pour les slots repas, on ne propose que les restaurants
    if (day.activities[slotIdx].slot === 'midi' || day.activities[slotIdx].slot === 'dîner') {
      return day.activities
        .flatMap(a => a.activities)
        .filter(a => a && (a.category?.toLowerCase().includes('restaurant') || a.category?.toLowerCase().includes('gastronomie')) && !usedIds.includes(a.id)) as Activity[]
    }
    // Pour les autres slots, on propose toutes les activités non utilisées sauf restaurants
    return day.activities
      .flatMap(a => a.activities)
      .filter(a => a && !usedIds.includes(a.id) && !(a.category?.toLowerCase().includes('restaurant') || a.category?.toLowerCase().includes('gastronomie'))) as Activity[]
  }

  // Suggestion automatique depuis la base (ville du programme)
  const fetchSuggestedRestaurant = async (slotIndex: number) => {
    setLoadingSuggestion(true)
    setWarning(null)
    setSuggestedResto(null)
    try {
      // On suppose que la ville est dans le champ city de la première activité du jour
      const city = day.activities.find(a => a.activities.length > 0)?.activities[0]?.city || ''
      const formData = { destination: city, moods: ['restaurant'], budget: undefined, companion: undefined }
      const activitiesByCategory = await getActivitiesByCriteria(formData as any)
      const restos = activitiesByCategory['restaurant'] || activitiesByCategory['gastronomie'] || []
      if (restos.length > 0) {
        setSuggestedResto(restos[0])
      } else {
        setWarning('Aucun restaurant trouvé dans la base pour cette destination.')
      }
    } catch (e) {
      setWarning('Erreur lors de la recherche de restaurant.')
    } finally {
      setLoadingSuggestion(false)
    }
  }

  const handleSelectSuggestedResto = (slotIndex: number) => {
    if (suggestedResto) {
      const newActivities = [...day.activities]
      newActivities[slotIndex] = { ...newActivities[slotIndex], activities: [suggestedResto] }
      onPlanningChange({ ...day, activities: newActivities }, dayIndex)
      setSelectingSlot(null)
      setSuggestedResto(null)
    }
  }

  const handleAddRestaurant = (slotIndex: number) => {
    const available = getAvailableRestaurants()
    if (available.length > 0) {
      setSelectingSlot(slotIndex)
    } else {
      // Suggestion automatique ou message
      fetchSuggestedRestaurant(slotIndex)
    }
  }

  const handleAddActivity = async (slotIndex: number) => {
    setIsLoadingActivities(true)
    try {
      const slot = day.activities[slotIndex]
      const formData: FormData = {
        destination: city,
        moods: slot.slot === 'midi' || slot.slot === 'dîner' ? ['food' as MoodType] : [],
        budget: budget ?? null,
        companion: null,
        startDate: null,
        endDate: null
      }
      const activitiesByCategory = await getActivitiesByCriteria(formData)
      // Convertir l'objet en tableau d'activités
      const activitiesArray = Object.values(activitiesByCategory).flat()
      setAvailableActivities(activitiesArray)
      setSelectingSlot(slotIndex)
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error)
      setWarning('Impossible de charger les activités disponibles')
      setSelectingSlot(null)
    } finally {
      setIsLoadingActivities(false)
    }
  }

  const handleSelectActivity = (activity: Activity) => {
    if (selectingSlot === null) return

    const slot = day.activities[selectingSlot]
    if (slot.activities.some(a => a.id === activity.id)) {
      setWarning('Cette activité est déjà présente dans ce créneau.')
      return
    }

    const newActivities = [...day.activities]
    newActivities[selectingSlot] = { 
      ...newActivities[selectingSlot], 
      activities: [...newActivities[selectingSlot].activities, activity] 
    }
    onPlanningChange({ ...day, activities: newActivities }, dayIndex)
    setSelectingSlot(null)
  }

  // Handler pour le clic sur une activité
  const handleActivityClick = async (activity: Activity, slotIdx: number) => {
    setSelectedActivity(activity)
    setSelectedSlotIdx(slotIdx)
    // Trouver l'index de l'activité dans le slot
    const idx = day.activities[slotIdx]?.activities.findIndex(a => a.id === activity.id)
    setSelectedActivityIdx(idx)
    // Charger toutes les suggestions de la même ville et catégorie
    const slot = day.activities[slotIdx]
    const slotType = slot.slot
    const idsInSlot = slot.activities.map(a => a.id)
    const formData: FormData = {
      destination: activity.city,
      moods: [activity.category as MoodType],
      budget: budget ?? null,
      companion: null,
      startDate: null,
      endDate: null
    }
    try {
      const activitiesByCategory = await getActivitiesByCriteria(formData)
      let suggestions = Object.values(activitiesByCategory).flat()
      // Filtrage avancé
      suggestions = suggestions.filter(suggestion => {
        // Ville
        if (suggestion.city !== activity.city) return false
        // Catégorie
        if (suggestion.category !== activity.category) return false
        // Budget
        if (suggestion.price > activity.price) return false
        // Pas déjà dans le slot
        if (idsInSlot.includes(suggestion.id)) return false
        // Horaire/type
        const cat = suggestion.category.toLowerCase()
        if (slotType === 'midi' || slotType === 'dîner') {
          if (!cat.includes('restaurant') && !cat.includes('gastronomie')) return false
        } else if (slotType === 'soirée') {
          if (!cat.includes('nightlife') && !cat.includes('bar') && !cat.includes('club') && !cat.includes('vie nocturne')) return false
        } else {
          // Pour les autres slots, on exclut restaurants et nightlife
          if (cat.includes('restaurant') || cat.includes('gastronomie') || cat.includes('nightlife') || cat.includes('bar') || cat.includes('club') || cat.includes('vie nocturne')) return false
        }
        return true
      })
      setSuggestionsForCategory(suggestions)
    } catch (e) {
      setSuggestionsForCategory([])
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-gray-900 focus:outline-none bg-transparent rounded-t-2xl"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{ borderBottom: open ? '1px solid #E5E7EB' : 'none' }}
      >
        <span className="flex flex-col items-start text-left gap-0.5">
          <span className="flex items-center gap-2 font-semibold text-xl text-gray-900">
            Jour {dayIndex + 1}
            <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
              {day.activities.reduce((acc, slot) => acc + slot.activities.length, 0)}
            </span>
          </span>
          <span className="text-sm text-gray-500 font-normal">
            {(() => {
              const dateObj = new Date(day.date)
              const formatted = dateObj.toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })
              return formatted.charAt(0).toUpperCase() + formatted.slice(1)
            })()}
          </span>
        </span>
        {open ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
      </button>
      {open && (
        <div className="p-6 space-y-6">
          {warning && <div className="text-red-600 text-sm mb-2">{warning}</div>}
          <div className="flex flex-col gap-6">
            {day.activities.map((slot, slotIdx) => {
              const slotMeta = TIME_SLOTS.find(s => s.key === slot.slot)
              const numericSlotIdx = Number(slotIdx)
              const isSlotOpen = openSlots.includes(numericSlotIdx)
              return (
                <div
                  key={slot.slot}
                  id={`day-${dayIndex}-slot-${numericSlotIdx}`}
                  className="bg-white border border-gray-200 rounded-2xl px-6 py-4 flex flex-col items-stretch transition-colors relative"
                  style={{ boxShadow: 'none' }}
                >
                  {/* Header du slot */}
                  <div className="w-full flex flex-row items-center mb-2 justify-between select-none">
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-indigo-700 leading-tight tracking-wide flex items-center gap-2">
                        {slotMeta?.label}
                      </span>
                      <span className="text-xs text-gray-400 mt-0.5">{slotMeta?.hours}</span>
                    </div>
                    {/* Chevron à droite pour ouvrir/fermer le slot */}
                    <button
                      type="button"
                      className="ml-2 p-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 transition-colors"
                      title={isSlotOpen ? 'Replier le créneau' : 'Déplier le créneau'}
                      onClick={e => { e.stopPropagation(); onToggleSlot(numericSlotIdx); }}
                    >
                      {isSlotOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                  {/* Droppable toujours monté, contenu conditionnel */}
                  <Droppable droppableId={`day-${dayIndex}-slot-${numericSlotIdx}`} direction="vertical" type="activity">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`w-full flex flex-col items-stretch gap-3 bg-transparent ${snapshot.isDraggingOver ? 'bg-indigo-50' : ''}`}
                      >
                        {isSlotOpen ? (
                          <>
                            {slot.activities.length === 0 && (
                              <button
                                type="button"
                                onClick={() => handleAddActivity(numericSlotIdx)}
                                className="w-full h-14 flex items-center justify-center border-2 border-dashed border-indigo-400 rounded-lg text-base text-indigo-500 bg-indigo-50/60 hover:bg-indigo-100 transition-colors gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                style={{ cursor: 'pointer' }}
                              >
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 5v14m7-7H5"/></svg>
                                <span>Ajouter ou glisser une activité ici</span>
                              </button>
                            )}
                            {slot.activities.map((activity, activityIdx) => (
                              <DraggableActivityCard
                                key={`activity-${activity.id}-day-${dayIndex}-slot-${numericSlotIdx}`}
                                activity={activity}
                                activityIdx={activityIdx}
                                slotIdx={numericSlotIdx}
                                slot={slot}
                                day={day}
                                onChange={(newDay) => onPlanningChange(newDay, dayIndex)}
                                onAddRestaurant={handleAddRestaurant}
                                onAddActivity={() => handleAddActivity(numericSlotIdx)}
                                city={city}
                                programId={programId}
                                dayIndex={dayIndex}
                                budget={budget}
                                onDelete={() => {
                                  if (isDragging) return
                                  console.log('Suppression exécutée dans DayPlanEditor', { activity, activityIdx, slotIdx: numericSlotIdx });
                                  const newActivities = [...slot.activities];
                                  newActivities.splice(activityIdx, 1);
                                  const newDay = { ...day, activities: [...day.activities] };
                                  newDay.activities[numericSlotIdx] = { ...slot, activities: newActivities };
                                  onPlanningChange(newDay, dayIndex);
                                }}
                                draggableId={`activity-${activity.id}-day-${dayIndex}-slot-${numericSlotIdx}`}
                                isDragging={isDragging}
                                onActivityClick={handleActivityClick}
                              />
                            ))}
                            {provided.placeholder}
                          </>
                        ) : (
                          <div className="min-h-[40px]">{provided.placeholder}</div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <SuggestionCarouselModal
        isOpen={selectedActivity !== null}
        onClose={() => { setSelectedActivity(null); setSuggestionsForCategory([]); setSelectedSlotIdx(null); setSelectedActivityIdx(null); }}
        suggestions={suggestionsForCategory.map(activityToSuggestion)}
        onSelect={(suggestion) => {
          if (selectedSlotIdx !== null && selectedActivityIdx !== null) {
            // Remplacer uniquement l'activité sélectionnée dans le slot
            const newActivities = [...day.activities]
            const slot = { ...newActivities[selectedSlotIdx] }
            const activitiesCopy = [...slot.activities]
            const newActivity = availableActivities.find(a => a.id === suggestion.id) || suggestionsForCategory.find(a => a.id === suggestion.id)!
            activitiesCopy[selectedActivityIdx] = newActivity
            slot.activities = activitiesCopy
            newActivities[selectedSlotIdx] = slot

            // Vérifier si la suggestion était déjà présente ailleurs dans la journée
            let replaced = false
            for (let i = 0; i < newActivities.length; i++) {
              if (i === selectedSlotIdx) continue
              const idxInOther = newActivities[i].activities.findIndex(a => a.id === suggestion.id)
              if (idxInOther !== -1) {
                // Trouver une suggestion alternative pour ce slot
                const slotType = newActivities[i].slot
                const idsInSlot = newActivities[i].activities.map(a => a.id)
                // On prend la première suggestion qui respecte les critères et n'est pas déjà dans le slot
                const alternatives = suggestionsForCategory.filter(sugg =>
                  sugg.city === newActivities[i].activities[idxInOther].city &&
                  sugg.category === newActivities[i].activities[idxInOther].category &&
                  sugg.price <= newActivities[i].activities[idxInOther].price &&
                  !idsInSlot.includes(sugg.id) &&
                  sugg.id !== suggestion.id &&
                  (
                    (slotType === 'midi' || slotType === 'dîner') ? (sugg.category.toLowerCase().includes('restaurant') || sugg.category.toLowerCase().includes('gastronomie')) :
                    (slotType === 'soirée') ? (sugg.category.toLowerCase().includes('nightlife') || sugg.category.toLowerCase().includes('bar') || sugg.category.toLowerCase().includes('club') || sugg.category.toLowerCase().includes('vie nocturne')) :
                    (!sugg.category.toLowerCase().includes('restaurant') && !sugg.category.toLowerCase().includes('gastronomie') && !sugg.category.toLowerCase().includes('nightlife') && !sugg.category.toLowerCase().includes('bar') && !sugg.category.toLowerCase().includes('club') && !sugg.category.toLowerCase().includes('vie nocturne'))
                  )
                )
                if (alternatives.length > 0) {
                  newActivities[i].activities[idxInOther] = alternatives[0]
                } else {
                  // Sinon, on retire simplement l'activité
                  newActivities[i].activities.splice(idxInOther, 1)
                }
                replaced = true
              }
            }
            onPlanningChange({ ...day, activities: newActivities }, dayIndex)
            setSelectedActivity(null)
            setSuggestionsForCategory([])
            setSelectedSlotIdx(null)
            setSelectedActivityIdx(null)
          }
        }}
        slotType={selectedSlotIdx !== null && day.activities[selectedSlotIdx] ? TIME_SLOTS.find(s => s.key === day.activities[selectedSlotIdx].slot)?.label || '' : ''}
      />
    </div>
  )
}