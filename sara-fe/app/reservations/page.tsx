"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, X, CheckCircle, Clock, AlertCircle } from "lucide-react"
import SiteHeader from "@/components/site-header"
import { useToast } from "@/lib/hooks/use-toast-hook"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/hooks/use-auth"
import ToastDisplay from "@/components/toast-display"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Reservation {
  _id: string
  hotel?: any
  tour?: any
  room?: any
  from: string
  to: string
  status: "pending" | "confirmed" | "cancelled"
  price?: number
  createdAt: string
}

export default function ReservationsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toasts, removeToast, addToast } = useToast()

  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return // Wait for auth to load
    if (!user) {
      router.push("/")
      return
    }
    fetchReservations()
  }, [user, authLoading, router])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const data = await apiClient.reservations.getUserReservations()
      setReservations(data)
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to load reservations.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: string) => {
    setCancelingId(id)
    try {
      await apiClient.reservations.cancel(id)
      setReservations((prev) =>
        prev.map((res) => (res._id === id ? { ...res, status: "cancelled" } : res))
      )
      addToast({
        title: "Reservation Cancelled",
        description: "Your reservation has been cancelled successfully.",
        type: "success",
      })
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to cancel reservation.",
        type: "error",
      })
    } finally {
      setCancelingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={18} />
      case "cancelled":
        return <X size={18} />
      case "pending":
        return <Clock size={18} />
      default:
        return <AlertCircle size={18} />
    }
  }

  if (!user) {
    return null
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground font-sans">
        <SiteHeader />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-12">
            <h1 className="text-5xl md:text-6xl font-bold">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Reservations</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage and track all your travel bookings in one place
            </p>
          </div>
        </div>
      </section>

      {/* Reservations List */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading your reservations...</p>
            </div>
          ) : reservations.length > 0 ? (
            <div className="space-y-6">
              {reservations.map((reservation) => (
                <div
                  key={reservation._id}
                  className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    {/* Left - Details */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {reservation.hotel?.name || reservation.tour?.title || "Reservation"}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
                          <MapPin size={14} />
                          {reservation.hotel?.address ||
                            (reservation.tour?.site?.name
                              ? typeof reservation.tour.site === "object"
                                ? reservation.tour.site.name
                                : reservation.tour.site
                              : "Location")}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                          <Calendar size={16} className="text-primary" />
                          <div>
                            <p className="text-muted-foreground">
                              {new Date(reservation.from).toLocaleDateString()}
                              {reservation.to
                                ? ` - ${new Date(reservation.to).toLocaleDateString()}`
                                : ""}
                            </p>
                          </div>
                        </div>

                        {reservation.hotel && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                            <Users size={16} className="text-primary" />
                            <p className="text-muted-foreground">Hotel Room</p>
                          </div>
                        )}

                        {reservation.tour && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                            <Users size={16} className="text-primary" />
                            <p className="text-muted-foreground">Guided Tour</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right - Status & Price */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Status</p>
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border capitalize font-medium ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {getStatusIcon(reservation.status)}
                          {reservation.status}
                        </div>
                      </div>

                      {reservation.price && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Total Price</p>
                          <p className="text-2xl font-bold text-primary">${reservation.price}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Booked {new Date(reservation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-end">
                      {reservation.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(reservation._id)}
                          disabled={cancelingId === reservation._id}
                          className="w-full px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {cancelingId === reservation._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <X size={16} />
                              Cancel
                            </>
                          )}
                        </button>
                      )}
                      {reservation.status === "cancelled" && (
                        <div className="w-full px-4 py-2 rounded-lg bg-gray-500/10 text-gray-600 border border-gray-500/20 text-center font-semibold">
                          Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-6">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-2xl font-bold mb-2">No Reservations Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start planning your next adventure by booking a hotel or tour
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <ToastDisplay toasts={toasts} onRemove={removeToast} />
    </main>
  )
}
