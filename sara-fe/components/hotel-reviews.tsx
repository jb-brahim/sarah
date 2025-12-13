"use client"

import { Star, Calendar, User } from "lucide-react"

interface Review {
    _id: string
    user: {
        _id: string
        name: string
        email: string
    }
    rating: number
    comment: string
    visitDate?: string
    createdAt: string
}

interface HotelReviewsProps {
    reviews: Review[]
}

export default function HotelReviews({ reviews }: HotelReviewsProps) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="bg-card border border-border/50 rounded-2xl p-8 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review this hotel!</p>
            </div>
        )
    }

    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
                    <div>
                        <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={20}
                                    className={`${star <= Math.round(averageRating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold">Guest Reviews</h3>
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                    >
                        {/* Review Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{review.user.name}</h4>
                                    <div className="flex gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={14}
                                                className={`${star <= review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-muted-foreground"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Visit Date */}
                        {review.visitDate && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                <Calendar size={14} />
                                <span>Visited on {new Date(review.visitDate).toLocaleDateString()}</span>
                            </div>
                        )}

                        {/* Comment */}
                        <p className="text-foreground leading-relaxed">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
