"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { useApi } from "@/lib/hooks/use-api"
import { useToast } from "@/lib/hooks/use-toast-hook"
import useWishlist from "@/lib/hooks/use-wishlist"
import { MapPin, Image as ImageIcon, Loader2, Heart } from "lucide-react"
import OptimizedImage from "@/components/ui/optimized-image"
import SearchFilter, { FilterState } from "@/components/search-filter"
import DetailModal from "@/components/detail-modal"
import ReviewsModal from "@/components/reviews-modal"
import { useState, useMemo } from "react"

interface Site {
  _id: string
  id?: string
  name: string
  description: string | { en: string; [key: string]: string }
  location?: {
    address?: string
    coordinates?: [number, number]
  }
  images?: string[]
  rating?: number
  category?: string
  entryFee?: number
}

export default function SitesShowcase() {
  const { data: sites, loading } = useApi<Site[]>(() => apiClient.sites.getAll())
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [filters, setFilters] = useState<FilterState>({ query: "" })
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist, isFavorited } = useWishlist()
  const [addingId, setAddingId] = useState<string | null>(null)
  const { addToast } = useToast()

  const filteredSites = useMemo(() => {
    if (!sites) return []
    return sites.filter((site) => {
      if (filters.query && !site.name.toLowerCase().includes(filters.query.toLowerCase())) return false
      if (filters.minRating && (!site.rating || site.rating < filters.minRating)) return false
      if (filters.category && site.category !== filters.category) return false
      return true
    })
  }, [sites, filters])

  const handleAddToWaitlist = (site: Site) => {
    const isWishlisted = isFavorited(site._id)

    if (isWishlisted) {
      removeFromWishlist(site._id)
      addToast({ title: 'Removed from waitlist', description: `${site.name} removed`, type: 'info' })
    } else {
      setAddingId(site._id)
      addToWishlist({ id: site._id, name: site.name, type: "site" })
      addToast({ title: 'Added to waitlist', description: `${site.name} added`, type: 'success' })
      setTimeout(() => setAddingId(null), 600)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SearchFilter
        onSearch={() => {}}
        onFilter={setFilters}
        type="sites"
      />

      {filteredSites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sites found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site, idx) => (
            <Card
              key={`site-${site._id || site.id}-${idx}`}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up group"
            >
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                {site.images && site.images[0] ? (
                  // OptimizedImage provides lazy loading, async decoding and a fallback SVG
                  <OptimizedImage src={site.images[0]} alt={site.name} title={site.name} className="group-hover:scale-105 transition-transform" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-muted-foreground/50 absolute inset-0 m-auto" />
                )}
                <button
                  onClick={() => handleAddToWaitlist(site)}
                  className={`absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 rounded-full p-2 transition-all duration-300 flex items-center justify-center overflow-visible ${
                    addingId === site._id ? 'scale-110 bg-green-500 shadow-lg' : 'hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="relative">
                    <Heart
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isFavorited(site._id)
                          ? 'fill-red-500 text-red-500 scale-105'
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                    />

                    {/* transient added badge */}
                    {addingId === site._id && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold rounded-full px-2 py-1 shadow-md animate-fade-in">
                        Added
                      </span>
                    )}

                    {/* subtle ping effect when adding */}
                    {addingId === site._id && (
                      <span className="absolute inset-0 -m-1 rounded-full bg-green-400 opacity-30 animate-ping" />
                    )}
                  </div>
                </button>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-foreground text-lg">{site.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {typeof site.description === 'string' ? site.description : site.description?.en}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  {typeof site.location === 'string' ? site.location : site.location?.address || 'Location TBA'}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReviews(true)}
                    className="flex-1 text-xs"
                  >
                    Reviews
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedSite(site)
                      setShowDetail(true)
                    }}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <DetailModal
        open={showDetail}
        onOpenChange={setShowDetail}
        type="site"
        data={selectedSite}
      />

      <ReviewsModal
        open={showReviews}
        onOpenChange={setShowReviews}
        itemId={selectedSite?._id || ""}
        itemName={selectedSite?.name || ""}
      />
    </div>
  )
}
