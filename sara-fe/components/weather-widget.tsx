"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { Cloud, Droplets, Wind, Eye, Loader2 } from "lucide-react"

interface WeatherData {
  siteId: string
  siteName: string
  temperature: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
}

interface WeatherProps {
  siteId?: string
  siteLocation?: string
}

export default function WeatherWidget({ siteId, siteLocation }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (siteId) {
      fetchWeather()
    }
  }, [siteId])

  const fetchWeather = async () => {
    if (!siteId) return
    
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient.weather.getSiteWeather(siteId)
      setWeather(data)
    } catch (err) {
      setError("Failed to fetch weather data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-4 bg-destructive/10 border-destructive/20">
        <p className="text-sm text-destructive">{error}</p>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">No weather data available</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{weather.siteName}</h3>
            <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
          </div>
          <Cloud className="w-8 h-8 text-blue-500" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Temperature</p>
            <p className="text-2xl font-bold text-foreground">{weather.temperature}°C</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Droplets className="w-3 h-3" />
              Humidity
            </div>
            <p className="text-lg font-semibold text-foreground">{weather.humidity}%</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Wind className="w-3 h-3" />
              Wind Speed
            </div>
            <p className="text-lg font-semibold text-foreground">{weather.windSpeed} km/h</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              Visibility
            </div>
            <p className="text-lg font-semibold text-foreground">Good</p>
          </div>
        </div>

        <Button onClick={fetchWeather} variant="outline" size="sm" className="w-full">
          Refresh Weather
        </Button>
      </div>
    </Card>
  )
}
