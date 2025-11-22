"use client"

import { useState } from "react"
import { Trash2, Plus, MapPin, Calendar, Clock } from "lucide-react"
import useItinerary, { ItineraryItem as HookItineraryItem } from "@/lib/hooks/use-itinerary"

export default function ItineraryBuilder() {
  const { items: items, addItem, removeItem } = useItinerary()

  const [newDestination, setNewDestination] = useState("")
  const [newDate, setNewDate] = useState("")
  const [newDuration, setNewDuration] = useState("1")
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)

  const addLocalItem = () => {
    if (newDestination && newDate) {
      const newItem: HookItineraryItem = {
        id: Date.now().toString(),
        destination: newDestination,
        date: newDate,
        duration: Number.parseInt(newDuration),
        notes: "",
        synced: false,
      }
      addItem(newItem)
      setNewDestination("")
      setNewDate("")
      setNewDuration("1")

      // Simulate sync: mark as synced locally after a short delay
      setTimeout(() => {
        // read current and update by removing and re-adding with synced flag
        const stored = JSON.parse(localStorage.getItem("itinerary") || "[]") as HookItineraryItem[]
        const next = stored.map((it) => (it.id === newItem.id ? { ...it, synced: true } : it))
        localStorage.setItem("itinerary", JSON.stringify(next))
        window.dispatchEvent(new Event("itineraryUpdated"))
      }, 800)
    }
  }

  const deleteItem = (id: string) => {
    removeItem(id)
  }

  return (
    <div className="space-y-8">
      <div className="animate-slide-right">
        <h2 className="text-3xl font-bold text-foreground mb-2">Your Itinerary</h2>
        <p className="text-muted-foreground">
          Works offline and syncs when you go online. All data stays private on your device.
        </p>
      </div>

      <div className="bg-secondary/20 border border-secondary/50 rounded-2xl p-6 space-y-4 animate-slide-up">
        <h3 className="font-semibold text-foreground">Add Destination</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Destination"
            value={newDestination}
            onChange={(e) => setNewDestination(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth hover:border-primary/50"
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth hover:border-primary/50"
          />
          <select
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth hover:border-primary/50"
          >
            {[1, 2, 3, 4, 5, 7, 10].map((n) => (
              <option key={n} value={n}>
                {n} day{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <button
            onClick={addLocalItem}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2 hover:scale-105 group relative overflow-hidden"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Add
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-96 transition-transform duration-1000 -z-10"></div>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-secondary/10 rounded-2xl border border-border/50 animate-fade-in">
            <Calendar className="mx-auto mb-4 text-muted-foreground animate-bounce-subtle" size={32} />
            <p className="text-muted-foreground">No itinerary items yet. Add one to get started!</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={`itin-${item.id}-${idx}`}
              className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:shadow-primary/10 transition-smooth animate-slide-up hover:-translate-y-1 group"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 transform group-hover:translate-x-1 transition-transform duration-300">
                    <MapPin
                      className="text-primary group-hover:scale-125 transition-transform duration-300"
                      size={20}
                    />
                    <h3 className="text-lg font-bold text-foreground">{item.destination}</h3>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-1 transform group-hover:-translate-y-0.5 transition-transform duration-300">
                      <Calendar size={16} />
                      {item.date ? new Date(item.date).toLocaleDateString() : "—"}
                    </span>
                    <span className="flex items-center gap-1 transform group-hover:translate-y-0.5 transition-transform duration-300">
                      <Clock size={16} />
                      {item.duration ?? 1} day{(item.duration ?? 1) > 1 ? "s" : ""}
                    </span>
                  </div>

                  {item.notes && <p className="text-sm text-foreground animate-fade-in">{item.notes}</p>}
                </div>

                <div className="flex items-center gap-2">
                  {!item.synced && (
                    <div className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium animate-pulse">
                      Offline
                    </div>
                  )}
                  {item.synced && (
                    <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium animate-fade-in">
                      Saved
                    </div>
                  )}
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-smooth transform hover:scale-125 hover:rotate-180 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-primary animate-slide-up hover:border-primary/50 transition-colors hover:bg-primary/15">
        <span className="inline-block animate-bounce-subtle">✓</span> All data saved locally on your device. Syncs
        automatically when online.
      </div>
    </div>
  )
}
