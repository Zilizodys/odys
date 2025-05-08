import { ProgramPlanning, DayPlan } from '@/lib/planning/autoAssign'
import DayPlanEditor from '@/components/planning/DayPlanEditor'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useState } from 'react'

interface ProgramPlanningEditorProps {
  planning: ProgramPlanning
  onChange: (planning: ProgramPlanning) => void
  city: string
  programId: string
  budget?: number
}

export default function ProgramPlanningEditor({ planning, onChange, city, programId, budget }: ProgramPlanningEditorProps) {
  // Initialiser avec le premier slot du premier jour ouvert
  const [openSlotsByDay, setOpenSlotsByDay] = useState<{ [dayIdx: number]: number[] }>({ 0: [0] })

  // Nouvelle fonction pour gérer le drag & drop inter-journées
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      // Fermer tous les slots à la fin du drag
      setOpenSlotsByDay({})
      return;
    }

    const { source, destination } = result;

    // Fonction de parsing robuste
    function parseDroppableId(id: string) {
      const match = id.match(/^day-(\d+)-slot-(\d+)$/);
      if (!match) return { dayIdx: NaN, slotIdx: NaN };
      return { dayIdx: parseInt(match[1], 10), slotIdx: parseInt(match[2], 10) };
    }

    const from = parseDroppableId(source.droppableId);
    const to = parseDroppableId(destination.droppableId);

    // Vérifier que les indices sont valides
    if ([from.dayIdx, from.slotIdx, to.dayIdx, to.slotIdx].some(x => isNaN(x))) {
      // console.error('Invalid drop indices:', { fromDayIdx: from.dayIdx, fromSlotIdx: from.slotIdx, toDayIdx: to.dayIdx, toSlotIdx: to.slotIdx });
      return;
    }

    // Vérifier que les jours et slots existent
    if (!planning.days[from.dayIdx] || !planning.days[to.dayIdx] ||
        !planning.days[from.dayIdx].activities[from.slotIdx] || 
        !planning.days[to.dayIdx].activities[to.slotIdx]) {
      // console.error('Invalid day or slot indices');
      return;
    }

    // Cloner le planning
    const newPlanning = { 
      ...planning, 
      days: planning.days.map(day => ({ 
        ...day, 
        activities: day.activities.map(slot => ({ 
          ...slot, 
          activities: [...slot.activities] 
        })) 
      })) 
    };

    const fromSlot = newPlanning.days[from.dayIdx].activities[from.slotIdx];
    const toSlot = newPlanning.days[to.dayIdx].activities[to.slotIdx];

    // Déplacer l'activité
    const [movedActivity] = fromSlot.activities.splice(source.index, 1);
    toSlot.activities.splice(destination.index, 0, movedActivity);

    onChange(newPlanning);
    // Garder ouverts le slot d'origine et le slot d'arrivée après le drop
    setOpenSlotsByDay(prev => {
      const newOpen = { ...prev }
      // Ouvre le slot d'origine
      newOpen[from.dayIdx] = Array.from(new Set([...(newOpen[from.dayIdx] || []), from.slotIdx]))
      // Ouvre le slot d'arrivée
      newOpen[to.dayIdx] = Array.from(new Set([...(newOpen[to.dayIdx] || []), to.slotIdx]))
      return newOpen
    })
  };

  // Fonction pour mettre à jour un jour spécifique du planning
  const handleDayChange = (newDay: DayPlan, dayIndex: number) => {
    const newPlanning = { ...planning, days: [...planning.days] };
    newPlanning.days[dayIndex] = newDay;
    onChange(newPlanning);
  };

  // Ouvre tous les slots de tous les jours
  const openAllSlots = () => {
    const allOpen: { [dayIdx: number]: number[] } = {};
    planning.days.forEach((day, dayIdx) => {
      allOpen[dayIdx] = day.activities.map((_, idx) => idx)
    })
    setOpenSlotsByDay(allOpen)
  }

  // Toggle un slot d'un jour
  const handleToggleSlot = (dayIdx: number, slotIdx: number) => {
    setOpenSlotsByDay(prev => {
      const current = prev[dayIdx] || []
      return {
        ...prev,
        [dayIdx]: current.includes(slotIdx)
          ? current.filter(i => i !== slotIdx)
          : [...current, slotIdx]
      }
    })
  }

  return (
    <DragDropContext
      onDragStart={openAllSlots}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8">
        {(planning.days || []).map((day, dayIdx) => (
          <DayPlanEditor
            key={dayIdx}
            day={day}
            dayIndex={dayIdx}
            planning={planning}
            onPlanningChange={handleDayChange}
            city={city}
            programId={programId}
            budget={budget}
            openSlots={openSlotsByDay[dayIdx] || []}
            onToggleSlot={slotIdx => handleToggleSlot(dayIdx, slotIdx)}
          />
        ))}
      </div>
    </DragDropContext>
  )
} 