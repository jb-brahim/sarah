"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, Clock, ArrowRight, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Tour {
    id: string
    title: string
    description: string
    price: number
    duration: string
    image?: string
}

export default function ToursSection() {
    const [tours, setTours] = useState<Tour[]>([])
    const [loading, setLoading] = useState(true)

    // Helper to extract string from potential localized object
    const getString = (val: any) => {
        if (!val) return ""
        if (typeof val === 'string') return val
        if (typeof val === 'object') return val.en || val.fr || val.ar || Object.values(val)[0] || ""
        return String(val)
    }

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await apiClient.tours.getAll()
                const mapped = res.map((t: any) => ({
                    id: t._id || t.id,
                    title: getString(t.title),
                    description: getString(t.description),
                    price: t.price || 0,
                    duration: t.duration ? `${t.duration} days` : "Flexible",
                    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" // Placeholder
                }))
                setTours(mapped)
            } catch (error) {
                console.error("Error fetching tours", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTours()
    }, [])

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>

    if (!tours || tours.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-muted-foreground text-lg">No tours available at the moment</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map(tour => (
                <div key={tour.id} className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-border/50">
                    <div className="h-72 overflow-hidden relative">
                        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
                            <h3 className="text-white text-xl font-bold leading-tight mb-2 opacity-90 group-hover:opacity-100">{tour.title}</h3>
                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                <span className="flex items-center gap-1"><Clock size={14} /> {tour.duration}</span>
                                <span className="flex items-center gap-1"><Users size={14} /> Small Group</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Starting From</p>
                            <p className="text-2xl font-bold text-primary">${tour.price}</p>
                        </div>
                        <button className="px-6 py-2.5 rounded-xl border-2 border-primary/20 bg-primary/5 text-primary font-bold hover:bg-primary hover:text-white hover:border-primary transition-all">
                            Details
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
