
import { useTaskStore } from "@/lib/store"
import { Card } from "./ui/card"
import { CheckCircle2, Clock, ListTodo, AlertCircle } from "lucide-react"

export function TaskStats() {
  const stats = useTaskStore((state) => state.getTaskStats())

  const items = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
      color: "text-blue-600",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "Today's Tasks",
      value: stats.todayCount,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {items.map((item) => (
        <Card key={item.label} className="p-4">
          <div className="flex items-center gap-3">
            <item.icon className={`h-5 w-5 ${item.color}`} />
            <div>
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="text-2xl font-semibold">{item.value}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}