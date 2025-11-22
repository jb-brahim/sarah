"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { useApi } from "@/lib/hooks/use-api"
import { MapPin, Star, Loader2 } from "lucide-react"
import DetailModal from "@/components/detail-modal"
import { useState } from "react"

interface Hotel {
  _id: string
  id?: string
  name: string
  location?: string | { address?: string; coordinates?: [number, number] }
  address?: string
  rating?: number
  price?: number
  description?: string
  amenities?: string[]
  image?: string
  images?: string[]
}

export default function HotelsShowcase() {
  const { data: hotels, loading } = useApi<Hotel[]>(() => apiClient.hotels.getAll())
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels?.map((hotel, idx) => (
        <Card
          key={`hotel-${hotel._id || hotel.id}-${idx}`}
          className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up"
        >
          {(hotel.image || hotel.images?.[0]) && (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <img src={hotel.image || hotel.images?.[0] || "/placeholder.svg"} alt={hotel.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-foreground">{hotel.name}</h3>
            {hotel.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">{hotel.description}</p>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {typeof hotel.location === 'string' ? hotel.location : hotel.location?.address || hotel.address || 'Location TBA'}
            </div>
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {hotel.amenities.slice(0, 3).join(', ')}
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              {hotel.rating && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`star-${hotel._id}-${i}`}
                      className={`w-4 h-4 ${
                        i < Math.floor(hotel.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              )}
              {hotel.price && (
                <span className="text-lg font-bold text-primary">${hotel.price}</span>
              )}
            </div>
            <Button
              className="w-full mt-2"
              onClick={() => {
                setSelectedHotel(hotel)
                setShowDetail(true)
              }}
            >
              Book Now
            </Button>
          </div>
        </Card>
      ))}

      <DetailModal
        open={showDetail}
        onOpenChange={setShowDetail}
        type="hotel"
        data={selectedHotel}
      />
    </div>
  )
}
