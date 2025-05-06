import { ProgramPlanning, DayPlan } from '@/lib/planning/autoAssign'
import DayPlanEditor from '@/components/planning/DayPlanEditor'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

interface ProgramPlanningEditorProps {
  planning: ProgramPlanning
  onChange: (planning: ProgramPlanning) => void
  city: string
  programId: string
  budget?: number
}

export default function ProgramPlanningEditor({ planning, onChange, city, programId, budget }: ProgramPlanningEditorProps) {
  // Nouvelle fonction pour gérer le drag & drop inter-journées
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

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
      console.error('Invalid drop indices:', { fromDayIdx: from.dayIdx, fromSlotIdx: from.slotIdx, toDayIdx: to.dayIdx, toSlotIdx: to.slotIdx });
      return;
    }

    // Vérifier que les jours et slots existent
    if (!planning.days[from.dayIdx] || !planning.days[to.dayIdx] ||
        !planning.days[from.dayIdx].activities[from.slotIdx] || 
        !planning.days[to.dayIdx].activities[to.slotIdx]) {
      console.error('Invalid day or slot indices');
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
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-8">
        {planning.days.map((day, dayIdx) => (
          <DayPlanEditor
            key={day.date}
            day={day}
            dayIndex={dayIdx}
            planning={planning}
            onPlanningChange={onChange}
            city={city}
            programId={programId}
            budget={budget}
          />
        ))}
      </div>
    </DragDropContext>
  )
} 