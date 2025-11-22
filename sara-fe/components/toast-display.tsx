"use client"
import { Toast } from "@/lib/hooks/use-toast-hook"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

interface ToastDisplayProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export default function ToastDisplay({ toasts, onRemove }: ToastDisplayProps) {
  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
      case "error":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
      case "info":
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
    }
  }

  const getTextColor = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "text-green-900 dark:text-green-100"
      case "error":
        return "text-red-900 dark:text-red-100"
      case "warning":
        return "text-yellow-900 dark:text-yellow-100"
      case "info":
        return "text-blue-900 dark:text-blue-100"
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getBgColor(toast.type)} ${getTextColor(
            toast.type
          )} border rounded-lg p-4 flex items-start gap-3 animate-slide-up shadow-lg`}
        >
          {getIcon(toast.type)}
          <div className="flex-1">
            <p className="font-semibold text-sm">{toast.title}</p>
            {toast.description && <p className="text-xs mt-1">{toast.description}</p>}
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-current opacity-50 hover:opacity-100 transition flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
