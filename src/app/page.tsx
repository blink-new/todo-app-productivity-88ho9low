
"use client"

import { AddTaskDialog } from "@/components/add-task-dialog"
import { TaskColumn } from "@/components/task-column"
import { FocusMode } from "@/components/focus-mode"
import { TaskStats } from "@/components/task-stats"
import { useTaskStore } from "@/lib/store"
import { DragDropContext, DropResult } from "react-beautiful-dnd"
import { useHotkeys } from "react-hotkeys-hook"

export default function Home() {
  const { tasks, moveTask, addTask } = useTaskStore()

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const taskId = result.draggableId
    const newStatus = result.destination.droppableId as any
    moveTask(taskId, newStatus)
  }

  // Quick add task with keyboard shortcut
  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault()
    const quickTask = {
      title: "New Task",
      status: "today",
      priority: "medium",
    } as any
    addTask(quickTask)
  })

  const columns = [
    { title: "Today", status: "today" },
    { title: "Important", status: "important" },
    { title: "Backlog", status: "backlog" },
    { title: "Completed", status: "completed" },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Task Board</h1>
            <p className="text-gray-500 mt-1">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded">⌘K</kbd> to quickly add a task
            </p>
          </div>
          <AddTaskDialog />
        </div>

        <TaskStats />

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <TaskColumn
                key={column.status}
                title={column.title}
                status={column.status as any}
                tasks={tasks
                  .filter((task) => task.status === column.status)
                  .sort((a, b) => {
                    // Sort by due date if exists
                    if (a.dueDate && b.dueDate) {
                      return a.dueDate - b.dueDate
                    }
                    // Then by priority
                    const priorityOrder = { high: 0, medium: 1, low: 2 }
                    return (
                      priorityOrder[a.priority] - priorityOrder[b.priority] ||
                      b.createdAt - a.createdAt
                    )
                  })}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
      <FocusMode />
    </main>
  )
}