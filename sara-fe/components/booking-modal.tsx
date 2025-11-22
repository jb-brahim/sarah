"use client"
import { useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/lib/hooks/use-toast-hook"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Calendar, Users, Loader2, CheckCircle } from "lucide-react"

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
}

export default function BookingModal({ open, onOpenChange, item }: BookingModalProps) {
  const [step, setStep] = useState<"date" | "guests" | "confirm" | "success">("date")
  const [selectedDate, setSelectedDate] = useState("")
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const stepOrder = ["date", "guests", "confirm"]
  const isStepCompleted = (s: string) => {
    if (step === "success") return true
    const currentIndex = stepOrder.indexOf(step)
    const checkIndex = stepOrder.indexOf(s)
    return currentIndex >= checkIndex
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      // Call backend reservations API
      // Backend expects { hotel | tour, from, to, price }
      const payload: any = {}
      const id = item?._id || item?.id
      if (item?.availableDates) {
        payload.tour = id
      } else {
        payload.hotel = id
      }
      payload.from = selectedDate
      payload.to = selectedDate
      payload.price = totalPrice

      const res = await apiClient.reservations.create(payload)
      if (res && res._id) {
        setStep('success')
        addToast({ title: 'Booking confirmed', description: 'Reservation created', type: 'success' })
        setTimeout(() => {
          onOpenChange(false)
          setStep('date')
          setSelectedDate('')
          setGuests(1)
        }, 1500)
      } else {
        const msg = res?.message || 'Booking failed'
        addToast({ title: 'Booking failed', description: msg, type: 'error' })
      }
    } catch (error) {
      console.error("Booking failed:", error)
      addToast({ title: 'Booking failed', description: String(error), type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const price = item.price ?? item.entryFee ?? 0
  const totalPrice = price * guests

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-describedby="booking-dialog-desc">
        <DialogHeader>
          <DialogTitle>Book {item.name || item.title}</DialogTitle>
        </DialogHeader>

        <p id="booking-dialog-desc" className="sr-only">Booking dialog for {item.name || item.title}</p>
        {step === "success" ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Booking Confirmed!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                A confirmation email has been sent to your inbox.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex gap-2 mb-6">
              {stepOrder.map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full transition ${
                    isStepCompleted(s)
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Date Selection */}
            {step === "date" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>✓ Same day confirmation</p>
                  <p>✓ Free cancellation up to 48 hours before</p>
                </div>
                <Button onClick={() => setStep("guests")} disabled={!selectedDate} className="w-full">
                  Continue
                </Button>
              </div>
            )}

            {/* Guest Selection */}
            {step === "guests" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                    >
                      −
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center">{guests}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(guests + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("date")} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setStep("confirm")} className="flex-1">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Confirmation */}
            {step === "confirm" && (
              <div className="space-y-4">
                <Card className="p-4 bg-muted/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="font-medium">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Guests</span>
                    <span className="font-medium">{guests} person{guests > 1 ? "s" : ""}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-sm font-medium">Total Price</span>
                    <span className="text-lg font-bold text-primary">${totalPrice}</span>
                  </div>
                </Card>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("guests")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
