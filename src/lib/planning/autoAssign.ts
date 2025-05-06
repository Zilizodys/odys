import { Activity } from '@/types/activity'

export type TimeSlot =
  | 'matin'
  | 'midi'
  | 'après-midi'
  | 'dîner'
  | 'soirée'

export const TIME_SLOTS: { key: TimeSlot, label: string, hours: string }[] = [
  { key: 'matin', label: 'Matin', hours: '8h-12h' },
  { key: 'midi', label: 'Déjeuner', hours: '12h-14h' },
  { key: 'après-midi', label: 'Après-midi', hours: '14h-18h' },
  { key: 'dîner', label: 'Dîner', hours: '18h-20h' },
  { key: 'soirée', label: 'Soirée', hours: '20h-00h' }
]

export interface ScheduledActivity {
  activities: Activity[] // Tableau d'activités (max 2, sauf pour les repas)
  slot: TimeSlot
  order: number // position dans la journée
  isFreeTime?: boolean // true si le slot est marqué comme temps libre
  isHomeMade?: boolean // true si le slot repas est marqué comme fait maison
}

export interface DayPlan {
  date: string // format YYYY-MM-DD
  activities: ScheduledActivity[]
}

export interface ProgramPlanning {
  days: DayPlan[]
}

export function autoAssignActivities(
  activities: Activity[],
  startDate: string, // format YYYY-MM-DD
  endDate: string    // format YYYY-MM-DD
): ProgramPlanning {
  // Mapping catégorie → créneaux préférés
  const CATEGORY_TO_SLOTS: Record<string, TimeSlot[]> = {
    'vie nocturne': ['soirée'],
    'nightlife': ['soirée'],
    'bar': ['soirée'],
    'club': ['soirée'],
    'culture': ['matin', 'après-midi'],
    'musée': ['matin', 'après-midi'],
    'exposition': ['matin', 'après-midi'],
    'nature': ['matin', 'après-midi'],
    'sport': ['matin', 'après-midi'],
    'shopping': ['après-midi'],
    'bien-être': ['après-midi'],
    'détente': ['après-midi'],
    'romantique': ['soirée', 'après-midi'],
    'autre': ['après-midi'],
  }
  const isRestaurant = (a: Activity) => {
    const cat = a.category?.toLowerCase() || ''
    return cat.includes('restaurant') || cat.includes('gastronomie')
  }
  const restaurantActivities = activities.filter(isRestaurant)
  const otherActivities = activities.filter(a => !isRestaurant(a))

  // Calcul du nombre de jours
  const start = new Date(startDate)
  const end = new Date(endDate)
  const daysCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)

  // Générer les dates de chaque jour
  const days: DayPlan[] = Array.from({ length: daysCount }, (_, i) => {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    return {
      date: date.toISOString().slice(0, 10),
      activities: TIME_SLOTS.map((slot, idx) => ({
        activities: [],
        slot: slot.key,
        order: idx + 1
      }))
    }
  })

  // Répartition des activités dans les slots adaptés
  let restoIdx = 0
  // On garde une trace des activités déjà placées
  const placedIds = new Set<string>()

  for (let day of days) {
    for (let slotIdx = 0; slotIdx < TIME_SLOTS.length; slotIdx++) {
      const slotKey = TIME_SLOTS[slotIdx].key
      // Repas : restaurant/gastronomie uniquement
      if (slotKey === 'midi' || slotKey === 'dîner') {
        if (restoIdx < restaurantActivities.length) {
          day.activities[slotIdx].activities = [restaurantActivities[restoIdx]]
          placedIds.add(restaurantActivities[restoIdx].id)
          restoIdx++
        }
      } else {
        // Autres slots : on cherche les activités adaptées à ce créneau
        const activitiesForSlot = otherActivities.filter(a => {
          if (placedIds.has(a.id)) return false
          const cat = a.category?.toLowerCase() || 'autre'
          const slots = CATEGORY_TO_SLOTS[cat] || ['après-midi']
          return slots.includes(slotKey as TimeSlot)
        })
        // On place max 2 activités par slot
        const toAdd = activitiesForSlot.slice(0, 2)
        day.activities[slotIdx].activities = toAdd
        toAdd.forEach(a => placedIds.add(a.id))
      }
    }
  }

  return { days }
} 