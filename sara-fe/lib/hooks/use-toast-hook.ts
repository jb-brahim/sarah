import { useState, useCallback, useEffect } from "react"

export interface Toast {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
}

// A tiny cross-component/global toast store using window and a custom event.
const GLOBAL_TOASTS_KEY = "__app_global_toasts_v1"
const GLOBAL_TOAST_EVENT = "app:global_toasts_updated"

function ensureGlobalStore() {
  if (typeof window === "undefined") return
  if (!(window as any)[GLOBAL_TOASTS_KEY]) {
    ;(window as any)[GLOBAL_TOASTS_KEY] = [] as Toast[]
  }
}

function readGlobalToasts(): Toast[] {
  if (typeof window === "undefined") return []
  ensureGlobalStore()
  return (window as any)[GLOBAL_TOASTS_KEY] as Toast[]
}

function writeGlobalToasts(list: Toast[]) {
  if (typeof window === "undefined") return
  ensureGlobalStore()
  ;(window as any)[GLOBAL_TOASTS_KEY] = list
  window.dispatchEvent(new CustomEvent(GLOBAL_TOAST_EVENT))
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(() => readGlobalToasts())

  useEffect(() => {
    const onUpdate = () => setToasts(readGlobalToasts())
    window.addEventListener(GLOBAL_TOAST_EVENT, onUpdate)
    return () => window.removeEventListener(GLOBAL_TOAST_EVENT, onUpdate)
  }, [])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { ...toast, id }
    const next = [...readGlobalToasts(), newToast]
    writeGlobalToasts(next)

    if (toast.duration !== 0) {
      setTimeout(() => {
        const cur = readGlobalToasts().filter((t) => t.id !== id)
        writeGlobalToasts(cur)
      }, toast.duration || 3000)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    const next = readGlobalToasts().filter((t) => t.id !== id)
    writeGlobalToasts(next)
  }, [])

  return { toasts, addToast, removeToast }
}
