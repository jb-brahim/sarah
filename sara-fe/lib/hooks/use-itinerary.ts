"use client"

import { useEffect, useState, useCallback } from "react"

export interface ItineraryItem {
  id: string
  destination: string
  date?: string
  duration?: number
  notes?: string
  synced?: boolean
}

const STORAGE_KEY = "itinerary"

function readStorage(): ItineraryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

export default function useItinerary() {
  const [items, setItems] = useState<ItineraryItem[]>(() => {
    if (typeof window === "undefined") return []
    return readStorage()
  })

  useEffect(() => {
    const onUpdate = () => setItems(readStorage())
    // listen to custom events from other tabs/components
    window.addEventListener("itineraryUpdated", onUpdate)
    // also listen to storage in other tabs
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) onUpdate()
    })
    return () => {
      window.removeEventListener("itineraryUpdated", onUpdate)
      window.removeEventListener("storage", (e: StorageEvent) => {
        if (e.key === STORAGE_KEY) onUpdate()
      })
    }
  }, [])

  const persist = useCallback((next: ItineraryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      // notify same-window listeners
      window.dispatchEvent(new Event("itineraryUpdated"))
    } catch (e) {
      // ignore
    }
  }, [])

  const addItem = useCallback((item: ItineraryItem) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === item.id)
      if (exists) return prev
      const next = [...prev, item]
      persist(next)
      return next
    })
  }, [persist])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== id)
      persist(next)
      return next
    })
  }, [persist])

  const clear = useCallback(() => {
    setItems([])
    persist([])
  }, [persist])

  return { items, addItem, removeItem, clear }
}
