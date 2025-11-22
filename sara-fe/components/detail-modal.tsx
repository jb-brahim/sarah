"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, Star, DollarSign, Calendar, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import BookingModal from "@/components/booking-modal"
import { useToast } from "@/lib/hooks/use-toast-hook"

interface DetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "site" | "hotel" | "tour"
  data: any
}

export default function DetailModal({ open, onOpenChange, type, data }: DetailModalProps) {
  const [imageIndex, setImageIndex] = useState<number>(0)
  const [showBooking, setShowBooking] = useState(false)
  const { addToast } = useToast()

  if (!data) return null

  const images: string[] = data.images || ["/placeholder.svg"]
  const currentImage: string = images[imageIndex] || "/placeholder.svg"

  const nextImage = () => setImageIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setImageIndex((prev) => (prev - 1 + images.length) % images.length)

  const description = typeof data.description === "string" ? data.description : data.description?.en || "No description"
  const location = typeof data.location === "string" ? data.location : data.location?.address || data.address || "Location TBA"

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{data.name || data.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="space-y-2">
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden group">
                <img
                  src={currentImage}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {imageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                        idx === imageIndex ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt={`${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Location */}
            <div className="flex gap-2">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium">{location}</p>
              </div>
            </div>

            {/* Rating (if applicable) */}
            {(data.rating || type === "hotel") && (
              <div className="flex gap-2">
                <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="text-sm font-medium">{data.rating ? `${data.rating}/5` : "No rating yet"}</p>
                </div>
              </div>
            )}

            {/* Price (if applicable) */}
            {(data.price !== undefined || data.entryFee !== undefined) && (
              <div className="flex gap-2">
                <DollarSign className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="text-sm font-medium">${data.price ?? data.entryFee}</p>
                </div>
              </div>
            )}

            {/* Duration (tours) */}
            {data.duration && (
              <div className="flex gap-2">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">{data.duration} days</p>
                </div>
              </div>
            )}

            {/* Guides (tours) */}
            {data.guides && data.guides.length > 0 && (
              <div className="flex gap-2">
                <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Guides</p>
                  <p className="text-sm font-medium">{data.guides.join(", ")}</p>
                </div>
              </div>
            )}

            {/* Category (sites) */}
            {data.category && (
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{data.category[0]}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">{data.category}</p>
                </div>
              </div>
            )}

            {/* Available Dates (tours) */}
            {data.availableDates && data.availableDates.length > 0 && (
              <div className="flex gap-2">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Available</p>
                  <p className="text-sm font-medium">{data.availableDates[0]}</p>
                </div>
              </div>
            )}

            {/* Amenities (hotels) */}
            {data.amenities && data.amenities.length > 0 && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {data.amenities.slice(0, 4).map((amenity: string, idx: number) => (
                    <span key={idx} className="text-xs bg-primary/10 text-primary rounded px-2 py-1">
                      {amenity}
                    </span>
                  ))}
                  {data.amenities.length > 4 && (
                    <span className="text-xs text-muted-foreground">+{data.amenities.length - 4} more</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
            {type === "hotel" && (
              <Button className="flex-1" onClick={() => setShowBooking(true)}>Book Now</Button>
            )}
            {type === "tour" && (
              <Button className="flex-1" onClick={() => setShowBooking(true)}>Reserve Tour</Button>
            )}
            {type === "site" && (
              <Button
                className="flex-1"
                onClick={() => {
                  // add to wishlist in localStorage
                  const current = JSON.parse(localStorage.getItem('wishlist') || '[]')
                  current.push({ ...data, _id: data._id || data.id, type: 'site' })
                  localStorage.setItem('wishlist', JSON.stringify(current))
                  addToast({ title: 'Added to wishlist', description: data.name || data.title, type: 'success' })
                }}
              >
                Add to Wishlist
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Booking Modal */}
    {(type === "hotel" || type === "tour") && (
      <BookingModal
        open={showBooking}
        onOpenChange={setShowBooking}
        item={data}
      />
    )}
    </>
  )
}
