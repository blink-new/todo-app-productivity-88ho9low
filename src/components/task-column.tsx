
import { Card } from "@/components/ui/card"
import { Status, Task } from "@/lib/store"
import { TaskCard } from "./task-card"
import { Droppable } from "react-beautiful-dnd"

interface TaskColumnProps {
  title: string
  status: Status
  tasks: Task[]
}

export function TaskColumn({ title, status, tasks }: TaskColumnProps) {
  return (
    <div className="flex flex-col gap-4 min-w-[300px] max-w-[350px]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-gray-500">{tasks.length}</span>
      </div>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}