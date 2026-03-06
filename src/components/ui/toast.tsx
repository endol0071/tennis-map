import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

type ToastPayload = {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type ToastItem = ToastPayload & {
  id: string
  variant: ToastVariant
}

type ToastContextValue = {
  toast: (payload: ToastPayload) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

function getToastStyle(variant: ToastVariant) {
  if (variant === 'success') {
    return 'border-slate-800 bg-black text-white'
  }
  if (variant === 'error') {
    return 'border-slate-800 bg-black text-white'
  }
  return 'border-slate-800 bg-black text-white'
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback(
    ({ title, description, variant = 'info', duration = 2400 }: ToastPayload) => {
      const id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`

      setItems((prev) => [...prev, { id, title, description, variant, duration }])

      window.setTimeout(() => {
        removeToast(id)
      }, duration)
    },
    [removeToast],
  )

  const contextValue = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        data-toast-root="true"
        className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex w-[min(92vw,360px)] -translate-x-1/2 flex-col gap-2"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'pointer-events-auto rounded-xl border p-3 shadow-xl shadow-black/40',
              getToastStyle(item.variant),
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                {item.description ? <p className="mt-0.5 text-xs text-white/85">{item.description}</p> : null}
              </div>
              <button
                type="button"
                aria-label="토스트 닫기"
                onClick={() => removeToast(item.id)}
                className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
