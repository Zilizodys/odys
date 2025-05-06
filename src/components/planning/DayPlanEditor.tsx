import { useState, useRef, useLayoutEffect } from 'react'
import { DayPlan, ScheduledActivity, TimeSlot, TIME_SLOTS } from '@/lib/planning/autoAssign'
import ActivitySlotEditor from '@/components/planning/ActivitySlotEditor'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Activity } from '@/types/activity'
import { getActivitiesByCriteria } from '@/lib/supabase/activities'
import { useRouter } from 'next/navigation'

interface DayPlanEditorProps {
  day: DayPlan
  dayIndex: number
  planning: any
  onPlanningChange: (planning: any) => void
  city: string
  programId: string
  budget?: number
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
}

function DraggableActivityCard({ activity, activityIdx, slotIdx, slot, day, onChange, onAddRestaurant, onAddActivity, city, programId, dayIndex, budget }: DraggableActivityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (cardRef.current) {
      setCardWidth(cardRef.current.getBoundingClientRect().width);
    }
  }, [activity]);

  return (
    <Draggable draggableId={getDraggableId(slotIdx, activityIdx)} index={activityIdx}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            width: snapshot.isDragging && cardWidth ? `${cardWidth}px` : '100%',
            minWidth: 0,
            maxWidth: '100%',
            height: '150px',
            margin: '0',
            boxSizing: 'border-box',
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
          />
        </div>
      )}
    </Draggable>
  );
}

export default function DayPlanEditor({ day, dayIndex, planning, onPlanningChange, city, programId, budget }: DayPlanEditorProps) {
  const [open, setOpen] = useState(dayIndex === 0)
  const [warning, setWarning] = useState<string | null>(null)
  const [selectingSlot, setSelectingSlot] = useState<number | null>(null)
  const [suggestedResto, setSuggestedResto] = useState<Activity | null>(null)
  const [loadingSuggestion, setLoadingSuggestion] = useState(false)
  const router = useRouter()

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
      onPlanningChange({ ...day, activities: newActivities })
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

  const handleSelectRestaurant = (slotIndex: number, activity: Activity) => {
    const slot = day.activities[slotIndex];
    if (slot.activities.some(a => a.id === activity.id)) {
      setWarning('Cette activité est déjà présente dans ce créneau.');
      return;
    }
    const newActivities = [...day.activities];
    newActivities[slotIndex] = { ...newActivities[slotIndex], activities: [...newActivities[slotIndex].activities, activity] };
    onPlanningChange({ ...day, activities: newActivities });
    setSelectingSlot(null);
  }

  return (
    <div className="border border-gray-100 rounded-2xl mb-6 bg-white">
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
              return (
                <div
                  key={slot.slot}
                  id={`day-${dayIndex}-slot-${slotIdx}`}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex flex-col items-center min-h-[120px] transition-colors relative min-h-[180px]"
                  style={{ boxShadow: 'none' }}
                >
                  {/* Titre du slot et horaires + bouton + */}
                  <div className="w-full flex flex-row items-center mb-2 justify-between">
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-indigo-700 leading-tight tracking-wide">{slotMeta?.label}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{slotMeta?.hours}</span>
                    </div>
                    {/* Bouton + pour ajouter une activité ou un restaurant */}
                    <button
                      className="ml-2 p-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 transition-colors"
                      title="Ajouter une activité"
                      onClick={() => setSelectingSlot(slotIdx)}
                      type="button"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  {/* Activités du slot avec Drag & Drop */}
                  <Droppable droppableId={`day-${dayIndex}-slot-${slotIdx}`} direction="vertical">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`w-full flex flex-col items-stretch gap-4 py-2 px-2 bg-transparent ${
                          snapshot.isDraggingOver ? 'bg-indigo-50' : ''
                        }`}
                      >
                        {slot.activities.map((activity, activityIdx) => (
                          <DraggableActivityCard
                            key={activity.id + '-' + activityIdx}
                            activity={activity}
                            activityIdx={activityIdx}
                            slotIdx={slotIdx}
                            slot={slot}
                            day={day}
                            onChange={onPlanningChange}
                            onAddRestaurant={handleAddRestaurant}
                            onAddActivity={() => setSelectingSlot(slotIdx)}
                            city={city}
                            programId={programId}
                            dayIndex={dayIndex}
                            budget={budget}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  {/* Sélecteur d'activité si besoin */}
                  {selectingSlot === slotIdx && (
                    <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-sm p-3 w-full max-w-xs mx-auto">
                      <div className="mb-2 font-semibold text-sm">Choisir une activité :</div>
                      {getAvailableActivitiesForSlot(slotIdx).map(act => (
                        <button
                          key={act.id}
                          className="block w-full text-left px-2 py-1 hover:bg-indigo-50 rounded"
                          onClick={() => handleSelectRestaurant(slotIdx, act)}
                        >
                          {act.title}
                        </button>
                      ))}
                      <button
                        className="mt-2 text-xs text-gray-500 underline"
                        onClick={() => setSelectingSlot(null)}
                      >Annuler</button>
                      {/* Suggestion automatique si aucune activité dispo */}
                      {getAvailableActivitiesForSlot(slotIdx).length === 0 && (
                        <div className="mt-2 text-xs text-gray-400">Aucune activité disponible pour ce créneau.</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 