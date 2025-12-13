"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface ReviewFormProps {
    hotelId: string
    onReviewSubmitted: () => void
}

export default function ReviewForm({ hotelId, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [visitDate, setVisitDate] = useState("")
    const [hoveredRating, setHoveredRating] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const { apiClient } = await import("@/lib/api-client")
            await apiClient.reviews.create({
                itemId: hotelId,
                itemType: "hotel",
                rating,
                comment,
                visitDate: visitDate || undefined,
            })

            // Reset form
            setRating(5)
            setComment("")
            setVisitDate("")
            onReviewSubmitted()
        } catch (err: any) {
            setError(err.message || "Failed to submit review. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-card border border-border/50 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-6">Write a Review</h3>

            {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                    <label className="block text-sm font-semibold mb-3">Your Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={32}
                                    className={`${star <= (hoveredRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Visit Date */}
                <div>
                    <label htmlFor="visitDate" className="block text-sm font-semibold mb-2">
                        Visit Date (Optional)
                    </label>
                    <input
                        type="date"
                        id="visitDate"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Comment */}
                <div>
                    <label htmlFor="comment" className="block text-sm font-semibold mb-2">
                        Your Review
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        maxLength={1000}
                        rows={5}
                        placeholder="Share your experience at this hotel..."
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {comment.length}/1000 characters
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !comment.trim()}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </div>
    )
}
