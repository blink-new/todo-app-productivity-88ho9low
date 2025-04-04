
import { Card } from "@/components/ui/card"
import { Task, Priority, useTaskStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Circle, CheckCircle2, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const priorityColors: Record<Priority, string> = {
  low: "bg-blue-500/10 text-blue-500",
  medium: "bg-yellow-500/10 text-yellow-500",
  high: "bg-red-500/10 text-red-500",
}

export function TaskCard({ task }: { task: Task }) {
  const { updateTask, setFocusedTask } = useTaskStore()

  const toggleComplete = () => {
    updateTask(task.id, {
      status: task.status === "completed" ? "today" : "completed",
      completedAt: task.status === "completed" ? undefined : Date.now(),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-4 space-y-3 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={toggleComplete}
              className="mt-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {task.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            <div className="space-y-1 flex-1">
              <h3
                className={cn(
                  "font-medium line-clamp-2",
                  task.status === "completed" && "line-through text-gray-400"
                )}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          <div className="flex items-center gap-2">
            {task.status !== "completed" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => setFocusedTask(task)}
              >
                <Clock className="w-4 h-4 mr-1" /> Focus
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}