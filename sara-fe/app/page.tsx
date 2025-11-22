"use client"

import { useState, useEffect } from "react"
import { Globe2, Clock, Shield, Building2, Compass, Calendar, Heart, Map, Star } from "lucide-react"
import HeroSection from "@/components/hero-section"
import RecommendationsSection from "@/components/recommendations-section"
import ItineraryBuilder from "@/components/itinerary-builder"
import FeatureShowcase from "@/components/feature-showcase"
import PrivacyToggle from "@/components/privacy-toggle"
import AuthModal from "@/components/auth-modal"
import HotelsShowcase from "@/components/hotels-showcase"
import ToursShowcase from "@/components/tours-showcase"
import SitesShowcase from "@/components/sites-showcase-enhanced"
import ReservationsSection from "@/components/reservations-section"
import TranslationWidget from "@/components/translation-widget"
import WeatherWidget from "@/components/weather-widget"
import AdminPanel from "@/components/admin-panel"
import UserProfile from "@/components/user-profile"
import Button from "@/components/ui/button"
import WishlistSection from "@/components/wishlist-section"
import MapComponent from "@/components/map-component"
import ToastDisplay from "@/components/toast-display"
import { useToast } from "@/lib/hooks/use-toast-hook"
import { useAuth } from "@/lib/hooks/use-auth"
import { apiClient } from "@/lib/api-client"
import { useLiveLocations } from "@/lib/hooks/use-live-locations"

export default function Home() {
  const [showAI, setShowAI] = useState(true)
  const [activeTab, setActiveTab] = useState<"explore" | "sites" | "hotels" | "tours" | "itinerary" | "reservations" | "translate" | "admin" | "wishlist" | "map">("explore")
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { user, setUser, logout } = useAuth()
  const { toasts, addToast, removeToast } = useToast()
  const { locations: liveLocations, loading: mapLoading } = useLiveLocations(activeTab === "map")
  const [mapLocations, setMapLocations] = useState<any[]>([])

  // Normalize coordinates and combine types (sites currently streamed). When other kinds
  // (hotels/tours) need streaming, expand the SSE endpoint or merge as needed.
  useEffect(() => {
    const normalize = (items: any[]) => {
      if (!items) return []
      const defaultCenter: [number, number] = [2.3522, 48.8566]
      return items.map((s: any, idx: number) => {
        const coords = s.location?.coordinates || s.coordinates || [0, 0]
        const isZero = coords[0] === 0 && coords[1] === 0
        const coordinates = isZero ? [defaultCenter[0] + (idx % 10) * 0.02, defaultCenter[1] + (idx % 10) * 0.02] : coords
        return {
          _id: s._id || s.id,
          name: s.name,
          coordinates,
          address: s.location?.address || s.address,
          type: s.category ? 'site' : 'site',
        }
      })
    }

    setMapLocations(normalize(liveLocations))
  }, [liveLocations])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent/50 flex items-center justify-center text-white font-bold text-xl">
              ✈
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground">Portail Touristique</span>
              <span className="text-xs text-muted-foreground">Future of Travel</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <PrivacyToggle showAI={showAI} onToggle={setShowAI} />
            {user ? (
              <UserProfile user={user} onLogout={() => setUser(null)} />
            ) : (
              <Button variant="outline" size="sm" onClick={() => setAuthModalOpen(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <HeroSection />

      {/* Tab Navigation */}
      <div className="sticky top-20 z-40 backdrop-blur-sm bg-background/50 border-b border-border/50 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 py-4 min-w-min">
            <button
              onClick={() => setActiveTab("explore")}
              className={`pb-2 px-3 whitespace-nowrap font-medium transition-all duration-300 border-b-2 ${
                activeTab === "explore"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe2 size={18} />
                Discover
              </div>
            </button>
            <button
              onClick={() => setActiveTab("sites")}
              className={`pb-2 px-3 whitespace-nowrap font-medium transition-all duration-300 border-b-2 ${
                activeTab === "sites"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Compass size={18} />
                Sites
              </div>
            </button>
            <button
              onClick={() => setActiveTab("hotels")}
              className={`pb-2 px-3 whitespace-nowrap font-medium transition-all duration-300 border-b-2 ${
                activeTab === "hotels"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 size={18} />
                Hotels
              </div>
            </button>
            <button
              onClick={() => setActiveTab("tours")}
              className={`pb-2 px-3 whitespace-nowrap font-medium transition-all duration-300 border-b-2 ${
                activeTab === "tours"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock size={18} />
                Tours
              </div>
            </button>
            <button
              onClick={() => setActiveTab("itinerary")}
              className={`pb-2 px-3 whitespace-nowrap font-medium transition-all duration-300 border-b-2 ${
                activeTab === "itinerary"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                Itinerary
              </div>
            </button>
            {user && (
              <>
                <button
                  onClick={() => setActiveTab("reservations")}
                  className={`pb-2 px-3 whitespace-nowrap font-medium transition-all duration-300 border-b-2 ${
                    activeTab === "reservations"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    My Reservations
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("translate")}
                  className={`pb-2 px-3 whitespace-nowrap font-medium transition-all duration-300 border-b-2 ${
                    activeTab === "translate"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe2 size={18} />
                    Translate
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`pb-2 px-3 whitespace-nowrap font-medium transition-all duration-300 border-b-2 ${
                    activeTab === "wishlist"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart size={18} />
                    Wishlist
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("map")}
                  className={`pb-2 px-3 whitespace-nowrap font-medium transition-all duration-300 border-b-2 ${
                    activeTab === "map"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Map size={18} />
                    Map
                  </div>
                </button>
              </>
            )}
            {user && user.isAdmin && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`pb-2 px-3 whitespace-nowrap font-medium transition-all duration-300 border-b-2 ${
                  activeTab === "admin"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield size={18} />
                  Admin
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === "explore" && (
          <div className="space-y-12 animate-fade-in">
            <RecommendationsSection showAI={showAI} />
            <FeatureShowcase />
          </div>
        )}

        {activeTab === "sites" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Tourist Sites</h2>
              <p className="text-muted-foreground">Explore the most beautiful and historic sites around the world</p>
            </div>
            <SitesShowcase />
          </div>
        )}

        {activeTab === "hotels" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Explore Hotels</h2>
              <p className="text-muted-foreground">Discover the best accommodations for your trip</p>
            </div>
            <HotelsShowcase />
          </div>
        )}

        {activeTab === "tours" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Guided Tours</h2>
              <p className="text-muted-foreground">Book amazing guided tours and experiences</p>
            </div>
            <ToursShowcase />
          </div>
        )}

        {activeTab === "itinerary" && (
          <div className="animate-fade-in">
            <ItineraryBuilder />
          </div>
        )}

        {activeTab === "reservations" && user && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">My Reservations</h2>
              <p className="text-muted-foreground">View and manage all your bookings</p>
            </div>
            <ReservationsSection />
          </div>
        )}

        {activeTab === "translate" && user && (
          <div className="space-y-6 animate-fade-in max-w-2xl">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Translation Helper</h2>
              <p className="text-muted-foreground">Translate content to any language while traveling</p>
            </div>
            <TranslationWidget />
          </div>
        )}

        {activeTab === "admin" && user && user.isAdmin && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h2>
              <p className="text-muted-foreground">Manage your platform and users</p>
            </div>
            <AdminPanel />
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h2>
              <p className="text-muted-foreground">Saved sites, hotels and tours</p>
            </div>
            <WishlistSection />
          </div>
        )}

        {activeTab === "map" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Map</h2>
              <p className="text-muted-foreground">Explore locations on the map</p>
            </div>
            <MapComponent locations={mapLocations} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 backdrop-blur-sm bg-background/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                The future of web travel experiences with privacy-first design.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Privacy</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition">
                    Data Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Features</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition">
                    AI Recommendations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition">
                    Offline Mode
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Developer</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Portail Touristique Intelligent. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield size={14} />
              Privacy-First Design
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onSuccess={setUser} />
      {/* Toasts (global) */}
      <ToastDisplay toasts={toasts} onRemove={removeToast} />
    </main>
  )
}
