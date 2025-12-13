"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { useApi } from "@/lib/hooks/use-api"
import { MapPin, Clock, DollarSign, Loader2 } from "lucide-react"
import DetailModal from "@/components/detail-modal"
import { useState } from "react"

interface Tour {
  _id: string
  id?: string
  title?: string
  name?: string
  description: string | { en: string;[key: string]: string }
  destination?: string
  duration?: number
  price: number
  guides?: string[]
  availableDates?: string[]
  image?: string
  images?: string[]
}

export default function ToursShowcase() {
  const { data: tours, loading } = useApi<Tour[]>(() => apiClient.tours.getAll())
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
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
      {tours?.map((tour, idx) => (
        <Card
          key={`tour-${tour._id || tour.id}-${idx}`}
          className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up"
        >
          {(tour.image || (tour.images && tour.images.length > 0)) && (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <img
                src={tour.image || (tour.images && tour.images[0]) || "/placeholder.svg"}
                alt={tour.name || tour.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-foreground">{tour.title || tour.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {typeof tour.description === 'string' ? tour.description : tour.description?.en}
            </p>
            <div className="space-y-2">
              {tour.destination && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {tour.destination}
                </div>
              )}
              {tour.duration && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {tour.duration} days
                </div>
              )}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-1 text-lg font-bold text-primary">
                <DollarSign className="w-5 h-5" />
                {tour.price}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedTour(tour)
                  setShowDetail(true)
                }}
              >
                Book Tour
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <DetailModal
        open={showDetail}
        onOpenChange={setShowDetail}
        type="tour"
        data={selectedTour}
      />
    </div>
  )
}
