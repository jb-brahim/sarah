"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { useApi } from "@/lib/hooks/use-api"
import { Calendar, Hotel, MapPin, DollarSign, Loader2, X } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast-hook"

interface Reservation {
  id: string
  hotelId?: string
  tourId?: string
  hotelName?: string
  tourName?: string
  startDate: string
  endDate: string
  totalPrice: number
  status: string
}

export default function ReservationsSection() {
  const { data: reservations, loading, refetch } = useApi<Reservation[]>(() => 
    apiClient.reservations.getUserReservations()
  )
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const { addToast } = useToast()
  const [reservationsState, setReservationsState] = useState<Reservation[]>([])

  // Initialize local reservations state when data loads
  useEffect(() => {
    if (Array.isArray(reservations)) {
      const normalized = reservations.map((r: any) => ({ ...r, id: r._id || r.id }))
      setReservationsState(normalized)
    } else {
      setReservationsState([])
    }
  }, [reservations])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  // Use local state for rendering so we can update UI after cancel without reloading
  const reservationsList = reservationsState

  if (!reservationsList || reservationsList.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No Reservations Yet</h3>
        <p className="text-muted-foreground mb-6">Start booking your dream vacation today!</p>
        <Button>Browse Hotels & Tours</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={async () => {
            try {
              if (refetch) {
                await refetch()
                addToast({ title: 'Refreshed', description: 'Reservations list updated', type: 'info' })
              }
            } catch (err) {
              console.error('Refresh failed', err)
              addToast({ title: 'Refresh failed', description: String(err), type: 'error' })
            }
          }}
        >
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reservationsList.map((reservation, idx) => (
          <Card
            key={`res-${reservation.id || reservation._id}-${idx}`}
            className="p-6 hover:shadow-lg transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {reservation.hotelName || reservation.tourName || "Reservation"}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                    reservation.status === "confirmed" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}>
                    {reservation.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReservation(reservation)}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">${reservation.totalPrice}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedReservation(reservation)}>
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedReservation && (
        <Card className="p-6 border-primary/50 bg-primary/5">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Reservation Details</h3>
            <button onClick={() => setSelectedReservation(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-semibold text-foreground">
                {selectedReservation.hotelId ? "Hotel" : "Tour"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-semibold text-foreground capitalize">{selectedReservation.status}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Check-in</p>
              <p className="font-semibold text-foreground">
                {new Date(selectedReservation.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Check-out</p>
              <p className="font-semibold text-foreground">
                {new Date(selectedReservation.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Total Price</p>
              <p className="text-2xl font-bold text-primary">${selectedReservation.totalPrice}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="outline" className="flex-1" onClick={() => setSelectedReservation(null)}>
              Close
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={async () => {
                try {
                  const id = (selectedReservation as any).id || (selectedReservation as any)._id
                  if (!id) throw new Error('Reservation id missing')
                  const resp = await apiClient.reservations.cancel(id)
                  addToast({ title: 'Reservation cancelled', description: 'Your reservation was cancelled', type: 'success' })
                  // Update UI: remove cancelled reservation from local list
                  setReservationsState((prev) => prev.filter((r) => !(r.id === id || r._id === id)))
                  setSelectedReservation(null)
                } catch (err) {
                  console.error('Cancel failed', err)
                  addToast({ title: 'Cancel failed', description: String(err), type: 'error' })
                }
              }}
            >
              Cancel Reservation
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
