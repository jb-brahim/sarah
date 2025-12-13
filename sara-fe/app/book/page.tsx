"use client"

import { useState, useEffect } from "react"
import { Globe2, MapPin, Calendar, Users, Search, Heart, Loader2, CheckCircle } from "lucide-react"
import SiteHeader from "@/components/site-header"
import LanguageSwitcher from "@/components/language-switcher"
import { useToast } from "@/lib/hooks/use-toast-hook"
import { useLanguage } from "@/lib/language-context"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/hooks/use-auth"
import ToastDisplay from "@/components/toast-display"
import Link from "next/link"

interface Hotel {
  _id: string
  name: string
  description: string
  address: string
  price: number
  rating: number
  amenities: string[]
  images?: string[]
}

interface Tour {
  _id: string
  title: string
  description: any
  price: number
  duration: number
  availableDates: string[]
  guides?: string[]
  site: any
  images?: string[]
}

export default function BookPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { toasts, removeToast, addToast } = useToast()

  const [tab, setTab] = useState<"hotels" | "tours">("hotels")
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(false)

  // Form states
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [tourDate, setTourDate] = useState("")
  const [participants, setParticipants] = useState(1)

  // Modals
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [reserving, setReserving] = useState(false)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [hotelsData, toursData] = await Promise.all([
        apiClient.hotels.getAll(),
        apiClient.tours.getAll(),
      ])
      setHotels(hotelsData)
      setTours(toursData)
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to load data",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToWishlist = async (id: string, type: string) => {
    if (!user) {
      addToast({ title: "Sign in required", description: "Please sign in to add to wishlist", type: "error" })
      return
    }
    try {
      await apiClient.wishlist.add({ itemId: id, itemType: type })
      setWishlist((prev) => new Set([...prev, id]))
      addToast({ title: "Added to wishlist", type: "success" })
    } catch (error) {
      addToast({ title: "Error", description: "Failed to add to wishlist", type: "error" })
    }
  }

  const handleRemoveFromWishlist = async (id: string) => {
    try {
      await apiClient.wishlist.remove(id)
      setWishlist((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      addToast({ title: "Removed from wishlist", type: "success" })
    } catch (error) {
      addToast({ title: "Error", description: "Failed to remove from wishlist", type: "error" })
    }
  }

  const confirmHotelReservation = async () => {
    if (!user || !selectedHotel) return
    setReserving(true)
    try {
      await apiClient.reservations.create({
        hotelId: selectedHotel._id,
        dates: [checkIn, checkOut],
      })
      addToast({ title: "Booking confirmed!", type: "success" })
      setSelectedHotel(null)
      setCheckIn("")
      setCheckOut("")
    } catch (error: any) {
      addToast({ title: "Booking failed", description: error.message, type: "error" })
    } finally {
      setReserving(false)
    }
  }

  const confirmTourReservation = async () => {
    if (!user || !selectedTour) return
    setReserving(true)
    try {
      await apiClient.reservations.create({
        tourId: selectedTour._id,
        dates: [tourDate, tourDate],
      })
      addToast({ title: "Booking confirmed!", type: "success" })
      setSelectedTour(null)
      setTourDate("")
    } catch (error: any) {
      addToast({ title: "Booking failed", description: error.message, type: "error" })
    } finally {
      setReserving(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between mb-12">
            <div className="space-y-4 flex-1">
              <h1 className="text-5xl md:text-6xl font-bold">
                {t('book.planYour', 'Plan Your')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t('book.perfectTrip', 'Perfect Trip')}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                {t('book.subtitle', 'Book accommodations and tours for an unforgettable experience')}
              </p>
            </div>
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setTab("hotels")}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${tab === "hotels" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                }`}
            >
              🏨 {t('header.hotels', 'Hotels')}
            </button>
            <button
              onClick={() => setTab("tours")}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${tab === "tours" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                }`}
            >
              ✈️ {t('header.tours', 'Tours')}
            </button>
          </div>

          {/* Hotel Search */}
          {tab === "hotels" && (
            <div className="bg-secondary/30 border border-border rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("book.checkIn", "Check-in")}</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("book.checkOut", "Check-out")}</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("book.guests", "Guests")}</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div />
                <button className="flex items-end px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors justify-center gap-2">
                  <Search size={18} />
                  {t("book.search", "Search")}
                </button>
              </div>
            </div>
          )}

          {/* Tour Search */}
          {tab === "tours" && (
            <div className="bg-secondary/30 border border-border rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("book.tourDate", "Tour Date")}</label>
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("book.participants", "Participants")}</label>
                  <select
                    value={participants}
                    onChange={(e) => setParticipants(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div />
                <div />
                <button className="flex items-end px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors justify-center gap-2">
                  <Search size={18} />
                  {t("book.search", "Search")}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Hotels Grid */}
      {tab === "hotels" && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12">🏨 {t("search.hotels", "Available Hotels")}</h2>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="animate-spin text-primary mx-auto mb-4" size={40} />
                <p className="text-muted-foreground">Loading hotels...</p>
              </div>
            ) : hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <div key={hotel._id} className="group rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                      {hotel.images && hotel.images[0] ? (
                        <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <MapPin className="w-16 h-16 text-primary/40" />
                      )}
                      <button
                        onClick={() =>
                          wishlist.has(hotel._id)
                            ? handleRemoveFromWishlist(hotel._id)
                            : handleAddToWishlist(hotel._id, "hotel")
                        }
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
                      >
                        <Heart size={20} className={wishlist.has(hotel._id) ? "fill-red-500 text-red-500" : ""} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{hotel.name}</h3>
                          <div className="flex items-center gap-1 ml-2">
                            <span className="text-yellow-400">⭐</span>
                            <span className="font-bold">{hotel.rating || 4.5}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <MapPin size={14} />
                          {hotel.address}
                        </div>
                      </div>

                      <p className="text-muted-foreground line-clamp-2">{hotel.description}</p>

                      {hotel.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {hotel.amenities.slice(0, 3).map((am, i) => (
                            <span key={i} className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                              {am}
                            </span>
                          ))}
                          {hotel.amenities.length > 3 && <span className="px-2 py-1 text-xs text-muted-foreground">+{hotel.amenities.length - 3}</span>}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">{t("book.perNight", "Per Night")}</p>
                          <p className="text-2xl font-bold text-primary">${hotel.price}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (!user) {
                              addToast({ title: "Sign in required", type: "error" })
                              return
                            }
                            if (!checkIn || !checkOut) {
                              addToast({ title: "Select dates first", type: "error" })
                              return
                            }
                            setSelectedHotel(hotel)
                          }}
                          className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                        >
                          {t("book.bookNow", "Book")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("book.noHotels", "No hotels available")}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tours Grid */}
      {tab === "tours" && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12">✈️ {t("search.tours", "Available Tours")}</h2>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="animate-spin text-primary mx-auto mb-4" size={40} />
                <p className="text-muted-foreground">Loading tours...</p>
              </div>
            ) : tours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <div key={tour._id} className="group rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                      {tour.images && tour.images[0] ? (
                        <img src={tour.images[0]} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <Globe2 className="w-16 h-16 text-primary/40" />
                      )}
                      <button
                        onClick={() =>
                          wishlist.has(tour._id)
                            ? handleRemoveFromWishlist(tour._id)
                            : handleAddToWishlist(tour._id, "tour")
                        }
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
                      >
                        <Heart size={20} className={wishlist.has(tour._id) ? "fill-red-500 text-red-500" : ""} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{tour.title}</h3>

                      <div className="space-y-2 text-sm">
                        {tour.duration && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar size={16} />
                            {tour.duration} {t("book.days", "days")}
                          </div>
                        )}
                        {tour.guides && tour.guides.length > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground text-xs">
                            👤 {tour.guides && tour.guides.length > 0 ? tour.guides.join(", ") : "N/A"}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">{t("book.price", "Price")}</p>
                          <p className="text-2xl font-bold text-primary">${tour.price}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (!user) {
                              addToast({ title: "Sign in required", type: "error" })
                              return
                            }
                            if (!tourDate) {
                              addToast({ title: "Select date first", type: "error" })
                              return
                            }
                            setSelectedTour(tour)
                          }}
                          className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                        >
                          {t("book.bookNow", "Book")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Globe2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("book.noTours", "No tours available")}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Hotel Confirmation Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-8 max-w-md w-full space-y-6 border border-border">
            <h2 className="text-2xl font-bold">{t("book.confirm", "Confirm Booking")}</h2>

            <div className="space-y-4 bg-secondary/30 rounded-xl p-4">
              <div>
                <p className="text-sm text-muted-foreground">Hotel</p>
                <p className="font-bold text-lg">{selectedHotel.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("book.checkIn", "Check-in")}</p>
                  <p className="font-bold">{new Date(checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("book.checkOut", "Check-out")}</p>
                  <p className="font-bold">{new Date(checkOut).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("book.guests", "Guests")}</p>
                <p className="font-bold">{guests}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={confirmHotelReservation}
                disabled={reserving}
                className="w-full px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {reserving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                {reserving ? t("book.confirming", "Confirming...") : t("book.confirm", "Confirm")}
              </button>
              <button
                onClick={() => setSelectedHotel(null)}
                className="w-full px-6 py-3 rounded-lg border border-border text-foreground font-bold hover:bg-secondary/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tour Confirmation Modal */}
      {selectedTour && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-8 max-w-md w-full space-y-6 border border-border">
            <h2 className="text-2xl font-bold">{t("book.confirm", "Confirm Booking")}</h2>

            <div className="space-y-4 bg-secondary/30 rounded-xl p-4">
              <div>
                <p className="text-sm text-muted-foreground">Tour</p>
                <p className="font-bold text-lg">{selectedTour.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("book.tourDate", "Date")}</p>
                  <p className="font-bold">{new Date(tourDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("book.participants", "Participants")}</p>
                  <p className="font-bold">{participants}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold text-primary">${selectedTour.price * participants}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={confirmTourReservation}
                disabled={reserving}
                className="w-full px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {reserving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                {reserving ? t("book.confirming", "Confirming...") : t("book.confirm", "Confirm")}
              </button>
              <button
                onClick={() => setSelectedTour(null)}
                className="w-full px-6 py-3 rounded-lg border border-border text-foreground font-bold hover:bg-secondary/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastDisplay toasts={toasts} onRemove={removeToast} />
    </main>
  )
}
