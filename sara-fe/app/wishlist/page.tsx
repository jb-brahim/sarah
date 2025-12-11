"use client"

import { useState, useEffect } from "react"
import { Heart, MapPin, DollarSign, Trash2, Calendar } from "lucide-react"
import SiteHeader from "@/components/site-header"
import { useToast } from "@/lib/hooks/use-toast-hook"
import { useLanguage } from "@/lib/language-context"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/hooks/use-auth"
import ToastDisplay from "@/components/toast-display"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface WishlistItem {
  _id: string
  itemId: string
  itemType: string
  meta?: any
  createdAt: string
}

export default function WishlistPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toasts, removeToast, addToast } = useToast()
  const { t } = useLanguage()

  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return // Wait for auth to load
    if (!user) {
      router.push("/")
      return
    }
    fetchWishlist()
  }, [user, authLoading, router])

  const fetchWishlist = async () => {
    setLoading(true)
    try {
      const data = await apiClient.wishlist.get()
      setWishlist(data)
    } catch (error) {
      addToast({
        title: t('message.error', 'Error'),
        description: t('message.error', 'Failed to load wishlist.'),
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (itemId: string) => {
    setRemovingId(itemId)
    try {
      await apiClient.wishlist.remove(itemId)
      setWishlist((prev) => prev.filter((item) => item._id !== itemId))
      addToast({
        title: "Removed",
        description: "Item removed from your wishlist.",
        type: "success",
      })
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to remove item.",
        type: "error",
      })
    } finally {
      setRemovingId(null)
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
          <p className="text-muted-foreground">{t('message.loading', 'Loading...')}</p>
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
              {t('wishlist.title', 'My')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Wishlist</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('wishlist.noItemsDesc', 'Save your favorite hotels, tours, and destinations for later')}
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Items */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading your wishlist...</p>
            </div>
          ) : wishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                    <Heart className="w-16 h-16 text-primary/40 fill-primary/20" />
                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={removingId === item._id}
                      className="absolute top-4 right-4 p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={20} className="text-red-600" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2 capitalize">
                        {item.itemType}
                      </span>
                      <h3 className="text-xl font-bold">
                        {item.meta?.name || `${item.itemType} #${item.itemId.slice(0, 8)}`}
                      </h3>
                    </div>

                    {item.meta?.address && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin size={14} />
                        {item.meta.address}
                      </div>
                    )}

                    {item.meta?.price && (
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <DollarSign size={16} />
                        ${item.meta.price}
                      </div>
                    )}

                    {item.meta?.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {item.meta.description}
                      </p>
                    )}

                    <div className="pt-4 border-t border-border flex gap-2">
                      <Link href="/book" className="flex-1">
                        <button className="w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                          Book Now
                        </button>
                      </Link>
                      <button
                        onClick={() => handleRemove(item._id)}
                        disabled={removingId === item._id}
                        className="px-4 py-2 rounded-lg border border-red-500/20 text-red-600 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-6">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-2xl font-bold mb-2">{t('wishlist.noItems', 'No Items in Wishlist')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('wishlist.noItemsDesc', 'Start adding your favorite hotels and tours to your wishlist')}
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  {t('wishlist.explore', 'Explore & Add Items')}
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
