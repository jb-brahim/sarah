"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { useApi } from "@/lib/hooks/use-api"
import { MapPin, Image as ImageIcon, Loader2 } from "lucide-react"

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
}

export default function SitesShowcase() {
  const { data: sites, loading } = useApi<Site[]>(() => apiClient.sites.getAll())

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sites?.map((site) => (
        <Card
          key={site._id || site.id}
          className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up"
        >
          {site.images && site.images[0] ? (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <img src={site.images[0]} alt={site.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
            </div>
          )}
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-foreground text-lg">{site.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {typeof site.description === 'string' ? site.description : site.description?.en}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border pt-3 mt-3">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              {typeof site.location === 'string' ? site.location : site.location?.address || 'Location TBA'}
            </div>
            <Button className="w-full mt-2">View Details</Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
