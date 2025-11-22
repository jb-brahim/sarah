"use client"

import { Shield, Sparkles } from "lucide-react"

interface PrivacyToggleProps {
  showAI: boolean
  onToggle: (show: boolean) => void
}

export default function PrivacyToggle({ showAI, onToggle }: PrivacyToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Privacy Mode</span>
      <button
        onClick={() => onToggle(!showAI)}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
          showAI ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
            showAI ? "translate-x-7" : "translate-x-1"
          } flex items-center justify-center text-sm`}
        >
          {showAI ? (
            <Sparkles size={14} className="text-primary" />
          ) : (
            <Shield size={14} className="text-muted-foreground" />
          )}
        </span>
      </button>
    </div>
  )
}
