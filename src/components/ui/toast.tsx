// 轻量级 Toast 通知 hook
import { useState, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, X, Info } from 'lucide-react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, showToast, dismiss }
}

export function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  if (toasts.length === 0) return null

  const iconMap = {
    success: <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />,
    error: <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />,
    info: <Info className="h-3.5 w-3.5 text-primary shrink-0" />,
    warning: <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--warning))] shrink-0" />,
  }

  const bgMap = {
    success: 'border-success/20 bg-success/5',
    error: 'border-destructive/20 bg-destructive/5',
    info: 'border-primary/20 bg-primary/5',
    warning: 'border-warning/20 bg-warning/5',
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 shadow-lg animate-fade-in ${bgMap[toast.type]}`}
        >
          {iconMap[toast.type]}
          <span className="text-xs font-medium text-foreground">{toast.message}</span>
          <button onClick={() => dismiss(toast.id)} className="ml-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
