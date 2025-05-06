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
  // Séparer les activités restaurants/gastronomie et autres
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

  // Répartition des activités dans les slots
  let restoIdx = 0
  let otherIdx = 0
  for (let day of days) {
    for (let slotIdx = 0; slotIdx < TIME_SLOTS.length; slotIdx++) {
      const slotKey = TIME_SLOTS[slotIdx].key
      if (slotKey === 'midi' || slotKey === 'dîner') {
        // Slot repas : restaurant/gastronomie uniquement
        if (restoIdx < restaurantActivities.length) {
          day.activities[slotIdx].activities = [restaurantActivities[restoIdx]]
          restoIdx++
        }
      } else {
        // Autres slots : autres activités (max 2)
        const activitiesToAdd: Activity[] = []
        if (otherIdx < otherActivities.length) {
          activitiesToAdd.push(otherActivities[otherIdx])
          otherIdx++
          if (otherIdx < otherActivities.length) {
            activitiesToAdd.push(otherActivities[otherIdx])
            otherIdx++
          }
        }
        day.activities[slotIdx].activities = activitiesToAdd
      }
    }
  }

  return { days }
} 