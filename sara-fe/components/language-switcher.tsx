"use client"

import { Globe, Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useLanguage, type Language } from '@/lib/language-context'

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)

  const current = languages.find((l) => l.code === language) || languages[0]

  return (
    <div className="relative">
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 text-sm font-semibold text-foreground transition-all duration-300 hover:shadow-md hover:shadow-primary/20 group"
      >
        <Globe className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform duration-300" />
        <span className="hidden sm:inline text-xs tracking-wide uppercase">{current.code}</span>
        <ChevronDown className={`w-4 h-4 text-primary/60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-background/95 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2">
            {languages.map((lang, idx) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  lang.code === language
                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-foreground'
                    : 'hover:bg-secondary/40 text-foreground/80'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">{lang.name}</p>
                  <p className="text-xs text-muted-foreground">{lang.code.toUpperCase()}</p>
                </div>
                {lang.code === language && (
                  <Check className="w-5 h-5 text-primary font-bold" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
