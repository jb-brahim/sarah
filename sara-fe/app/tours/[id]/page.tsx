"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import SiteHeader from "@/components/site-header"
import HotelReviews from "@/components/hotel-reviews"
import ReviewForm from "@/components/review-form"
import BookingDialog from "@/components/booking-dialog"
import { MapPin, Star, ArrowLeft, Loader2, Calendar, Users, Clock } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Tour {
    _id: string
    title: string
    description: any
    price: number
    duration: number
    guides: string[]
    availableDates: string[]
    images: string[]
    rating: number
}

export default function TourDetailPage() {
    const params = useParams()
    const router = useRouter()
    const tourId = params.id as string

    const [tour, setTour] = useState<Tour | null>(null)
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showBookingDialog, setShowBookingDialog] = useState(false)

    // Helper to extract string from localized object
    const getString = (val: any) => {
        if (!val) return ""
        if (typeof val === 'string') return val
        if (typeof val === 'object') {
            if (val.en) return val.en
            if (val.fr) return val.fr
            if (val.ar) return val.ar
            return Object.values(val)[0] || ""
        }
        return String(val)
    }

    useEffect(() => {
        // Check authentication
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken')
            setIsAuthenticated(!!token)
        }

        fetchTourData()
    }, [tourId])

    const fetchTourData = async () => {
        try {
            setLoading(true)
            const [tourData, reviewsData] = await Promise.all([
                apiClient.tours.getOne(tourId),
                apiClient.reviews.getByItem(tourId, 'tour')
            ])
            setTour(tourData)
            setReviews(reviewsData)
        } catch (error) {
            console.error("Error fetching tour data:", error)
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

    if (!tour) {
        return (
            <main className="min-h-screen bg-background">
                <SiteHeader />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">Tour Not Found</h1>
                    <button
                        onClick={() => router.push('/tours')}
                        className="text-primary hover:underline"
                    >
                        Back to Tours
                    </button>
                </div>
            </main>
        )
    }

    const description = getString(tour.description)
    const defaultImage = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
    const tourImages = tour.images && tour.images.length > 0 ? tour.images : [defaultImage]

    return (
        <main className="min-h-screen bg-background text-foreground pb-20">
            <SiteHeader />

            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-6">
                <button
                    onClick={() => router.push('/tours')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Tours
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {/* Image Gallery */}
                <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8">
                    <img
                        src={tourImages[currentImageIndex]}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                    />

                    {/* Image Navigation */}
                    {tourImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {tourImages.map((_, index) => (
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
                        {/* Tour Info */}
                        <div className="bg-card border border-border/50 rounded-2xl p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold mb-4">{tour.title}</h1>
                                    <div className="flex items-center gap-4 text-muted-foreground mb-4">
                                        <span className="flex items-center gap-2">
                                            <Clock size={18} />
                                            {tour.duration} days
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Users size={18} />
                                            Small Group
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold">{tour.rating || 4.5}</span>
                                </div>
                            </div>

                            <p className="text-foreground leading-relaxed mb-6">{description}</p>

                            {/* Tour Details */}
                            <div className="space-y-4">
                                {/* Guides */}
                                {tour.guides && tour.guides.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3">Tour Guides</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {tour.guides.map((guide, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
                                                >
                                                    {guide}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Available Dates */}
                                {tour.availableDates && tour.availableDates.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3">Available Dates</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {tour.availableDates.slice(0, 6).map((date, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm font-medium flex items-center gap-2"
                                                >
                                                    <Calendar size={14} />
                                                    {new Date(date).toLocaleDateString()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <HotelReviews reviews={reviews} />

                        {/* Review Form */}
                        {isAuthenticated ? (
                            <ReviewForm hotelId={tourId} onReviewSubmitted={fetchTourData} />
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
                                <span className="text-sm text-muted-foreground">Starting from</span>
                                <div className="text-3xl font-bold text-primary">
                                    ${tour.price}
                                </div>
                                <span className="text-xs text-muted-foreground">per person</span>
                            </div>

                            <button
                                onClick={() => setShowBookingDialog(true)}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg mb-4"
                            >
                                Book This Tour
                            </button>

                            <div className="space-y-3 pt-4 border-t border-border/50">
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock size={16} className="text-muted-foreground" />
                                    <span>{tour.duration} day adventure</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Users size={16} className="text-muted-foreground" />
                                    <span>Small group experience</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar size={16} className="text-muted-foreground" />
                                    <span>Multiple dates available</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border/50">
                                <p className="text-sm text-muted-foreground text-center">
                                    Free cancellation up to 24 hours before
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Dialog */}
            {tour && (
                <BookingDialog
                    isOpen={showBookingDialog}
                    onClose={() => setShowBookingDialog(false)}
                    tourId={tour._id}
                    itemName={tour.title}
                    price={tour.price}
                    itemType="tour"
                />
            )}
        </main>
    )
}
