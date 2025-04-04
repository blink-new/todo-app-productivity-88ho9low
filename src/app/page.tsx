
"use client"

import { AddTaskDialog } from "@/components/add-task-dialog"
import { TaskColumn } from "@/components/task-column"
import { FocusMode } from "@/components/focus-mode"
import { useTaskStore } from "@/lib/store"
import { DragDropContext, DropResult } from "react-beautiful-dnd"

export default function Home() {
  const { tasks, moveTask } = useTaskStore()

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const taskId = result.draggableId
    const newStatus = result.destination.droppableId as any
    moveTask(taskId, newStatus)
  }

  const columns = [
    { title: "Today", status: "today" },
    { title: "Important", status: "important" },
    { title: "Backlog", status: "backlog" },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Task Board</h1>
          <AddTaskDialog />
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <TaskColumn
                key={column.status}
                title={column.title}
                status={column.status as any}
                tasks={tasks.filter((task) => task.status === column.status)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
      <FocusMode />
    </main>
  )
}