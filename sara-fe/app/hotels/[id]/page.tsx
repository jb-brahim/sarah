"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import SiteHeader from "@/components/site-header"
import HotelReviews from "@/components/hotel-reviews"
import ReviewForm from "@/components/review-form"
import BookingDialog from "@/components/booking-dialog"
import { MapPin, Star, Wifi, ArrowLeft, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Hotel {
    _id: string
    name: string
    description: string
    address: string
    rating: number
    price: number
    amenities: string[]
    images: string[]
}

export default function HotelDetailPage() {
    const params = useParams()
    const router = useRouter()
    const hotelId = params.id as string

    const [hotel, setHotel] = useState<Hotel | null>(null)
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showBookingDialog, setShowBookingDialog] = useState(false)

    useEffect(() => {
        // Check authentication
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken')
            setIsAuthenticated(!!token)
        }

        fetchHotelData()
    }, [hotelId])

    const fetchHotelData = async () => {
        try {
            setLoading(true)
            const [hotelData, reviewsData] = await Promise.all([
                apiClient.hotels.getOne(hotelId),
                apiClient.reviews.getByItem(hotelId, 'hotel')
            ])
            setHotel(hotelData)
            setReviews(reviewsData)
        } catch (error) {
            console.error("Error fetching hotel data:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <SiteHeader />
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </main>
        )
    }

    if (!hotel) {
        return (
            <main className="min-h-screen bg-background">
                <SiteHeader />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">Hotel Not Found</h1>
                    <button
                        onClick={() => router.push('/hotels')}
                        className="text-primary hover:underline"
                    >
                        Back to Hotels
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background text-foreground pb-20">
            <SiteHeader />

            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-6">
                <button
                    onClick={() => router.push('/hotels')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Hotels
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {/* Image Gallery */}
                <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8">
                    <img
                        src={hotel.images[currentImageIndex] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Image Navigation */}
                    {hotel.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {hotel.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex
                                        ? "bg-white w-8"
                                        : "bg-white/50 hover:bg-white/75"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hotel Info */}
                        <div className="bg-card border border-border/50 rounded-2xl p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
                                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                        <MapPin size={18} />
                                        <span>{hotel.address}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold">{hotel.rating}</span>
                                </div>
                            </div>

                            <p className="text-foreground leading-relaxed mb-6">{hotel.description}</p>

                            {/* Amenities */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hotel.amenities.map((amenity, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <HotelReviews reviews={reviews} />

                        {/* Review Form */}
                        {isAuthenticated ? (
                            <ReviewForm hotelId={hotelId} onReviewSubmitted={fetchHotelData} />
                        ) : (
                            <div className="bg-card border border-border/50 rounded-2xl p-8 text-center">
                                <p className="text-muted-foreground mb-4">
                                    Please log in to write a review
                                </p>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    Log In
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-card border border-border/50 rounded-2xl p-6 sticky top-24">
                            <div className="mb-6">
                                <span className="text-sm text-muted-foreground">Price per night</span>
                                <div className="text-3xl font-bold text-primary">
                                    ${hotel.price}
                                </div>
                            </div>

                            <button
                                onClick={() => setShowBookingDialog(true)}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg"
                            >
                                Book Now
                            </button>

                            <div className="mt-6 pt-6 border-t border-border/50">
                                <p className="text-sm text-muted-foreground text-center">
                                    Free cancellation available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Dialog */}
            {hotel && (
                <BookingDialog
                    isOpen={showBookingDialog}
                    onClose={() => setShowBookingDialog(false)}
                    hotelId={hotel._id}
                    itemName={hotel.name}
                    price={hotel.price}
                    itemType="hotel"
                />
            )}
        </main>
    )
}
