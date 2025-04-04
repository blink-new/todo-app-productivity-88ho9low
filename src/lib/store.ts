
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Priority = 'low' | 'medium' | 'high'
export type Status = 'backlog' | 'today' | 'important' | 'completed'

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  status: Status
  createdAt: number
  completedAt?: number
}

interface TaskState {
  tasks: Task[]
  focusedTask: Task | null
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  setFocusedTask: (task: Task | null) => void
  moveTask: (taskId: string, newStatus: Status) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      focusedTask: null,
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Math.random().toString(36).substring(7),
              createdAt: Date.now(),
            },
          ],
        })),
      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      setFocusedTask: (task) => set({ focusedTask: task }),
      moveTask: (taskId, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          ),
        })),
    }),
    {
      name: 'task-store',
    }
  )
)