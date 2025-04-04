
import { Task } from "@/lib/store"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Draggable } from "react-beautiful-dnd"
import { useTaskStore } from "@/lib/store"
import { format } from "date-fns"
import { Check, Clock, Tag, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  index: number
}

export function TaskCard({ task, index }: TaskCardProps) {
  const { toggleComplete, deleteTask } = useTaskStore()

  const isOverdue = task.dueDate && task.dueDate < Date.now() && !task.isCompleted

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className={cn(
            "p-4 mb-2 group hover:shadow-md transition-all",
            task.isCompleted && "opacity-75 bg-gray-50",
            isOverdue && "border-red-200 bg-red-50"
          )}>
            <div className="flex items-start gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 shrink-0",
                  task.isCompleted && "bg-green-100 text-green-700"
                )}
                onClick={() => toggleComplete(task.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-medium truncate",
                  task.isCompleted && "line-through text-gray-500"
                )}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {task.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.dueDate && (
                    <Badge variant={isOverdue ? "destructive" : "secondary"} className="flex gap-1 items-center">
                      <Clock className="h-3 w-3" />
                      {format(task.dueDate, "MMM d")}
                    </Badge>
                  )}
                  {task.labels?.map((label) => (
                    <Badge key={label} variant="outline" className="flex gap-1 items-center">
                      <Tag className="h-3 w-3" />
                      {label}
                    </Badge>
                  ))}
                  <Badge variant={
                    task.priority === "high"
                      ? "destructive"
                      : task.priority === "medium"
                      ? "default"
                      : "secondary"
                  }>
                    {task.priority}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 h-6 w-6"
                onClick={() => deleteTask(task.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  )
}