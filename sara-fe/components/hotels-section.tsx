"use client"

import { useState, useEffect } from "react"
import { MapPin, Wifi, Star, ArrowRight, Loader2, BedDouble } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Hotel {
    id: string
    name: string
    description: string
    address: string
    rating: number
    price: number
    amenities: string[]
    image?: string
}

export default function HotelsSection() {
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(true)

    // Helper to extract string from potential localized object
    const getString = (val: any) => {
        if (!val) return ""
        if (typeof val === 'string') return val
        if (typeof val === 'object') return val.en || val.fr || val.ar || Object.values(val)[0] || ""
        return String(val)
    }

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await apiClient.hotels.getAll()
                const mapped = res.map((h: any) => ({
                    id: h._id || h.id,
                    name: getString(h.name),
                    description: getString(h.description),
                    address: getString(h.address) || "Unknown Location",
                    rating: h.rating || 4,
                    price: h.price || "Contact for Price",
                    amenities: h.amenities || ["Wifi", "Pool"],
                    image: (h.images && h.images[0]) ? h.images[0] : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
                }))
                setHotels(mapped)
            } catch (error) {
                console.error("Error fetching hotels", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHotels()
    }, [])

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>

    if (!hotels || hotels.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-muted-foreground text-lg">No hotels available at the moment</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map(hotel => (
                <div key={hotel.id} className="border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group bg-card">
                    <div className="h-64 overflow-hidden relative">
                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" /> {hotel.rating}
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-foreground">{hotel.name}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                            <MapPin size={14} /> {hotel.address}
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{hotel.description}</p>

                        <div className="flex items-center gap-2 mb-6 flex-wrap">
                            {hotel.amenities.slice(0, 3).map((am, i) => (
                                <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{am}</span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div>
                                <span className="text-xs text-muted-foreground block">Per Night</span>
                                <span className="font-bold text-primary text-lg">{typeof hotel.price === 'number' ? `$${hotel.price}` : hotel.price}</span>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90 transition-colors shadow-md">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
