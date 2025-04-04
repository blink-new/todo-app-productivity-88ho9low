
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
  dueDate?: number
  labels?: string[]
  isCompleted?: boolean
}

interface TaskState {
  tasks: Task[]
  focusedTask: Task | null
  labels: string[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  setFocusedTask: (task: Task | null) => void
  moveTask: (taskId: string, newStatus: Status) => void
  toggleComplete: (taskId: string) => void
  addLabel: (label: string) => void
  removeLabel: (label: string) => void
  getTaskStats: () => {
    total: number
    completed: number
    overdue: number
    todayCount: number
  }
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      focusedTask: null,
      labels: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Math.random().toString(36).substring(7),
              createdAt: Date.now(),
              isCompleted: false,
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
      toggleComplete: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  isCompleted: !task.isCompleted,
                  completedAt: !task.isCompleted ? Date.now() : undefined,
                  status: !task.isCompleted ? 'completed' : task.status,
                }
              : task
          ),
        })),
      addLabel: (label) =>
        set((state) => ({
          labels: [...new Set([...state.labels, label])],
        })),
      removeLabel: (label) =>
        set((state) => ({
          labels: state.labels.filter((l) => l !== label),
          tasks: state.tasks.map((task) => ({
            ...task,
            labels: task.labels?.filter((l) => l !== label),
          })),
        })),
      getTaskStats: () => {
        const tasks = get().tasks
        const now = Date.now()
        return {
          total: tasks.length,
          completed: tasks.filter((t) => t.isCompleted).length,
          overdue: tasks.filter(
            (t) => !t.isCompleted && t.dueDate && t.dueDate < now
          ).length,
          todayCount: tasks.filter((t) => t.status === 'today').length,
        }
      },
    }),
    {
      name: 'task-store',
    }
  )
)