"use client"

import { useEffect, useState, useCallback } from "react"

export interface WishlistItem {
  id: string
  name: string
  type: "site" | "hotel" | "tour"
  addedAt?: number
}

const STORAGE_KEY = "wishlist"

function readStorage(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    // Normalize items so they always have `id` populated (use `_id` if present)
    if (Array.isArray(parsed)) {
      const byId = new Map<string, WishlistItem>()
      for (const it of parsed) {
        const id = it.id ?? it._id ?? ""
        if (!id) continue
        if (!byId.has(id)) {
          byId.set(id, { ...it, id })
        }
      }
      return Array.from(byId.values())
    }
    return []
  } catch (e) {
    return []
  }
}

export default function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window === "undefined") return []
    return readStorage()
  })

  useEffect(() => {
    const onUpdate = () => setItems(readStorage())
    window.addEventListener("wishlistUpdated", onUpdate)
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) onUpdate()
    })
    return () => {
      window.removeEventListener("wishlistUpdated", onUpdate)
      window.removeEventListener("storage", (e: StorageEvent) => {
        if (e.key === STORAGE_KEY) onUpdate()
      })
    }
  }, [])

  const persist = useCallback((next: WishlistItem[]) => {
    try {
      // Ensure we persist canonical id field and deduplicate by id
      const byId = new Map<string, WishlistItem>()
      for (const it of next) {
        const id = it.id ?? (it as any)._id ?? ""
        if (!id) continue
        if (!byId.has(id)) byId.set(id, { ...it, id })
      }
      const normalized = Array.from(byId.values())
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
      window.dispatchEvent(new Event("wishlistUpdated"))
    } catch (e) {
      // ignore
    }
  }, [])

  // On mount, rewrite storage with normalized/deduplicated items (migrate legacy data)
  useEffect(() => {
    try {
      const current = readStorage()
      // persist will dedupe and normalize
      persist(current)
    } catch (e) {
      // ignore
    }
  }, [persist])

  const addItem = useCallback(
    (item: WishlistItem) => {
      setItems((prev) => {
        const canonicalId = item.id ?? (item as any)._id ?? ""
        const exists = prev.some((p) => (p.id ?? (p as any)._id ?? "") === canonicalId)
        if (exists) return prev
        const next = [...prev, { ...item, id: canonicalId, addedAt: Date.now() }]
        persist(next)
        return next
      })
    },
    [persist]
  )

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((p) => (p.id ?? (p as any)._id ?? "") !== id)
        persist(next)
        return next
      })
    },
    [persist]
  )

  const isFavorited = useCallback((id: string) => {
    return items.some((p) => (p.id ?? (p as any)._id ?? "") === id)
  }, [items])

  const clear = useCallback(() => {
    setItems([])
    persist([])
  }, [persist])

  return { items, addItem, removeItem, isFavorited, clear }
}
