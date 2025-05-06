import { DayPlan, TimeSlot, ScheduledActivity } from './autoAssign'
import { Activity } from '@/types/activity'

// Déplacer une activité dans la journée (changement d'ordre)
export function moveActivityInDay(day: DayPlan, fromIndex: number, toIndex: number): DayPlan {
  const activities = [...day.activities]
  const [moved] = activities.splice(fromIndex, 1)
  activities.splice(toIndex, 0, moved)
  // Mettre à jour l'ordre
  activities.forEach((a, i) => a.order = i + 1)
  return { ...day, activities }
}

// Changer le créneau horaire d'une activité
export function changeActivitySlot(day: DayPlan, activityIndex: number, newSlot: TimeSlot): DayPlan {
  const activities = [...day.activities]
  activities[activityIndex] = { ...activities[activityIndex], slot: newSlot }
  return { ...day, activities }
}

// Remplacer une activité par une autre dans un slot
export function replaceActivity(day: DayPlan, activityIndex: number, newActivity: Activity): DayPlan {
  const activities = [...day.activities]
  activities[activityIndex] = { ...activities[activityIndex], activities: [newActivity] }
  return { ...day, activities }
} 