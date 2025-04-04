
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTaskStore } from "@/lib/store"
import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Play, Pause, XCircle } from "lucide-react"

export function FocusMode() {
  const { focusedTask, setFocusedTask, updateTask } = useTaskStore()
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes
  const [isRunning, setIsRunning] = useState(false)
  
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    }
    
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleComplete = () => {
    if (!focusedTask) return
    updateTask(focusedTask.id, {
      status: "completed",
      completedAt: Date.now(),
    })
    setFocusedTask(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100

  if (!focusedTask) return null

  return (
    <Dialog open={!!focusedTask} onOpenChange={() => setFocusedTask(null)}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-8 py-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Focus Mode</h2>
            <p className="text-gray-500">Stay focused on your current task</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">{focusedTask.title}</h3>
            <div className="text-center text-4xl font-mono">{formatTime(timeLeft)}</div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleComplete}
              className="text-green-500"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFocusedTask(null)}
              className="text-red-500"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}