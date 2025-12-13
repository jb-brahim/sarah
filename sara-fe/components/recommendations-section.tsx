
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/lib/hooks/use-toast-hook"
import { MapPin, Sparkles, Heart, Share2 } from "lucide-react"
import useItinerary from "@/lib/hooks/use-itinerary"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

interface Destination {
  id: string
  name: string
  region: string
  description: string
  image: string
  rating: number
  tags: string[]
  temperature: number
}



export default function RecommendationsSection({ showAI }: { showAI: boolean }) {
  const { t } = useLanguage()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { addToast } = useToast()
  const { items: itineraryItems, addItem: addToItinerary } = useItinerary()
  const [addingId, setAddingId] = useState<string | null>(null)

  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/destinations`)
        if (response.ok) {
          const data = await response.json()
          // Map the API data to local structure if needed, but it should match
          // We need to apply translations here or during render
          // The render logic uses t('dest.' + id + '.name') which expects '1', '2' etc.
          // The API returns 'id' as '1', '2' etc so it should work fine.


          // However, if the API returns new destinations that don't have keys,
          // we should probably fallback to the name from the DB.
          setDestinations(data)
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground animate-slide-right">
            {showAI ? t('rec.aiTitle', "AI-Powered Recommendations") : t('rec.popTitle', "Popular Destinations")}
          </h2>
          <p className="text-muted-foreground mt-2 animate-slide-right" style={{ animationDelay: "0.1s" }}>
            {showAI ? t('rec.aiDesc', "Personalized for your interests with privacy preserved") : t('rec.popDesc', "Browse destinations around the world")}
          </p>
        </div>
        {showAI && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-bounce-subtle">
            <Sparkles size={16} className="animate-spin-slow" />
            {t('rec.aiBadge', "AI-Assisted")}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {destinations.map((dest, idx) => (
          <div
            key={`rec-dest-${dest.id}-${idx}`}
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-2xl animate-scale-in hover:-translate-y-2 h-96"
            style={{ animationDelay: `${idx * 0.1}s` }}
            onClick={() => setSelectedDestination(dest)}
            onMouseEnter={() => setHoveredId(dest.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Background image with advanced hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent"></div>
            <Image
              src={dest.image || "/placeholder.svg"}
              alt={dest.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-125 transition-transform duration-700"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20 group-hover:via-black/40 transition-all duration-500"></div>

            {/* Content with staggered animations */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
              <div className="flex justify-between items-start transform group-hover:scale-110 transition-transform duration-300">
                <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span className="text-sm font-medium opacity-90">
                      {t(`dest.${dest.id}.region`, dest.region)}
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold transform group-hover:scale-125 transition-transform duration-300 origin-top-right">
                  {dest.temperature}°
                </div>
              </div>

              <div className="space-y-3 transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {t(`dest.${dest.id}.name`, dest.name)}
                  </h3>
                  <p className="text-sm opacity-90 line-clamp-2 group-hover:line-clamp-none transition-all">
                    {t(`dest.${dest.id}.desc`, dest.description)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  {dest.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-white/30 backdrop-blur text-white text-xs font-medium animate-slide-up"
                    >
                      {t(`tags.${tag}`, tag)}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-yellow-300">★</span>
                    <span className="text-sm font-semibold">{dest.rating}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(dest.id)
                    }}
                    className="p-2 hover:bg-white/30 rounded-full transition-all duration-300 transform hover:scale-125"
                  >
                    <Heart
                      size={18}
                      fill={favorites.has(dest.id) ? "currentColor" : "none"}
                      className={`transition-all duration-300 ${favorites.has(dest.id) ? "text-red-400 animate-bounce-subtle" : ""
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in-slow shadow-2xl">
            <div className="relative w-full h-64">
              <Image
                src={selectedDestination.image || "/placeholder.svg"}
                alt={selectedDestination.name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover rounded-t-2xl"
              />
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between animate-slide-up">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{selectedDestination.name}</h2>
                  <p className="text-muted-foreground mt-2 flex items-center gap-2">
                    <MapPin size={16} />
                    {selectedDestination.region}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="text-muted-foreground hover:text-foreground text-2xl transition-transform duration-300 hover:rotate-90 hover:scale-125"
                >
                  ✕
                </button>
              </div>

              <div
                className="prose prose-sm dark:prose-invert max-w-none animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <p className="text-foreground">{selectedDestination.description}</p>
              </div>

              <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestination.tags.map((tag, idx) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 animate-slide-left hover:bg-primary/20 transition-all duration-300"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // prevent duplicates
                      if (itineraryItems.some((it) => it.id === selectedDestination.id)) {
                        addToast({ title: 'Already in itinerary', description: `${selectedDestination.name} is already added`, type: 'info' })
                        return
                      }
                      setAddingId(selectedDestination.id)
                      addToItinerary({ id: selectedDestination.id, destination: selectedDestination.name, date: undefined, duration: 1, notes: '', synced: false })
                      addToast({ title: 'Added to itinerary', description: `${selectedDestination.name} added`, type: 'success' })
                      setTimeout(() => setAddingId(null), 600)
                    }}
                    className={`flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-500 transform ${addingId === selectedDestination.id
                      ? 'scale-95 bg-green-500 shadow-lg shadow-green-500/50'
                      : 'hover:scale-105'
                      }`}
                  >
                    Add to Itinerary
                  </button>
                  <button className="p-2 border border-border rounded-lg hover:bg-secondary/50 transition-smooth hover:scale-110 transform">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
