"use client"
import { useEffect, useRef, useState } from "react"
import { Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapProps {
  locations: Array<{
    _id: string
    name: string
    coordinates: [number, number]
    address?: string
    type: "site" | "hotel" | "tour"
  }>
  onLocationSelect?: (location: any) => void
}

export default function MapComponent({ locations, onLocationSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location._id)
    onLocationSelect?.(location)
  }

  if (loading) {
    return (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  // Calculate bounds
  const lats = locations.map((l) => l.coordinates[1])
  const lngs = locations.map((l) => l.coordinates[0])
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const centerLat = (minLat + maxLat) / 2
  const centerLng = (minLng + maxLng) / 2
  const zoomLevel = Math.max(2, 12 - Math.log2((maxLng - minLng) / 4))

  return (
    <div className="w-full space-y-4">
      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-border overflow-hidden relative"
      >
        {/* SVG Map Representation */}
        <svg
          className="w-full h-full"
          viewBox={`${minLng - 5} ${minLat - 5} ${maxLng - minLng + 10} ${maxLat - minLat + 10}`}
        >
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="2" height="2" patternUnits="userSpaceOnUse">
              <path d="M 2 0 L 0 0 0 2" fill="none" stroke="#f0f0f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Location markers */}
          {locations.map((location, idx) => (
            <g key={`map-loc-${location._id}-${idx}`}>
              {/* Marker circle */}
              <circle
                cx={location.coordinates[0]}
                cy={location.coordinates[1]}
                r={1.5}
                fill={selectedLocation === location._id ? "#e74c3c" : "#3b82f6"}
                opacity="0.8"
                className="cursor-pointer hover:opacity-100 transition"
                onClick={() => handleLocationClick(location)}
              />
              {/* Marker halo */}
              <circle
                cx={location.coordinates[0]}
                cy={location.coordinates[1]}
                r={2.5}
                fill="none"
                stroke={selectedLocation === location._id ? "#e74c3c" : "#3b82f6"}
                strokeWidth={0.3}
                opacity="0.3"
              />
            </g>
          ))}
        </svg>

        {/* Map Info Box */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-slate-900 rounded-lg shadow-lg p-3 z-10">
            {locations.find((l) => l._id === selectedLocation) && (
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">
                  {locations.find((l) => l._id === selectedLocation)?.name}
                </h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {locations.find((l) => l._id === selectedLocation)?.address}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <p className="text-sm font-medium text-foreground">Locations ({locations.length})</p>
        {locations.map((location, idx) => (
          <Button
            key={`map-list-${location._id}-${idx}`}
            variant={selectedLocation === location._id ? "default" : "outline"}
            size="sm"
            onClick={() => handleLocationClick(location)}
            className="w-full justify-start gap-2"
          >
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <div className="text-left">
              <div className="text-xs font-medium">{location.name}</div>
              <div className="text-xs text-muted-foreground">{location.address}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
