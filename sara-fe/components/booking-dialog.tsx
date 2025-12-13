"use client"

import { useState } from "react"
import { X, Calendar, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface BookingDialogProps {
    isOpen: boolean
    onClose: () => void
    hotelId?: string
    tourId?: string
    itemName: string
    price: number
    itemType: "hotel" | "tour"
}

export default function BookingDialog({
    isOpen,
    onClose,
    hotelId,
    tourId,
    itemName,
    price,
    itemType
}: BookingDialogProps) {
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const bookingData: any = {
                from: fromDate,
                to: toDate,
                price: price
            }

            if (hotelId) {
                bookingData.hotel = hotelId
            }

            if (tourId) {
                bookingData.tour = tourId
            }

            await apiClient.reservations.create(bookingData)
            setSuccess(true)

            // Close dialog after 2 seconds
            setTimeout(() => {
                onClose()
                setSuccess(false)
                setFromDate("")
                setToDate("")
            }, 2000)
        } catch (err: any) {
            setError(err.message || "Failed to create booking. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border/50 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Book {itemType === "hotel" ? "Hotel" : "Tour"}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {success ? (
                    <div className="py-8 text-center">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
                        <p className="text-muted-foreground">Your reservation has been successfully created.</p>
                    </div>
                ) : (
                    <>
                        {/* Item Info */}
                        <div className="bg-secondary/30 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold mb-2">{itemName}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    {itemType === "hotel" ? "Per Night" : "Total Price"}
                                </span>
                                <span className="text-xl font-bold text-primary">${price}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Booking Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="fromDate" className="block text-sm font-semibold mb-2">
                                    {itemType === "hotel" ? "Check-in Date" : "Tour Start Date"}
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="date"
                                        id="fromDate"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="toDate" className="block text-sm font-semibold mb-2">
                                    {itemType === "hotel" ? "Check-out Date" : "Tour End Date"}
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="date"
                                        id="toDate"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        min={fromDate || new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Booking...
                                        </>
                                    ) : (
                                        "Confirm Booking"
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
