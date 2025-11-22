"use client"
import { useEffect, useRef, useState } from "react"
import { API_BASE_URL } from "@/lib/api-client"

// Hook that subscribes to the backend SSE `/sites/stream` endpoint
// and falls back to periodic polling when SSE is not available or fails.
export function useLiveLocations(enabled: boolean, opts?: { pollingIntervalMs?: number }) {
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const esRef = useRef<EventSource | null>(null)
  const pollRef = useRef<number | null>(null)

  const pollingIntervalMs = opts?.pollingIntervalMs ?? 10000

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    setLoading(true)

    const streamUrl = `${API_BASE_URL.replace(/\/$/, "")}/sites/stream`

    const setupEventSource = () => {
      try {
        const es = new EventSource(streamUrl)
        esRef.current = es

        es.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data)
            setLocations((prev) => {
              // naive replace
              return data || []
            })
            setLoading(false)
          } catch (err) {
            console.error('Error parsing SSE data', err)
          }
        }

        es.onerror = (err) => {
          console.warn('EventSource error, falling back to polling', err)
          // close and start polling
          try { es.close() } catch (e) {}
          esRef.current = null
          startPolling()
        }
      } catch (err) {
        console.warn('EventSource not supported or failed, falling back to polling', err)
        startPolling()
      }
    }

    const startPolling = () => {
      const fetchAll = async () => {
        try {
          const resp = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/sites`)
          const data = await resp.json()
          setLocations(data || [])
          setLoading(false)
        } catch (err) {
          console.error('Polling fetch error', err)
        }
      }

      fetchAll()
      pollRef.current = window.setInterval(fetchAll, pollingIntervalMs)
    }

    setupEventSource()

    return () => {
      cancelled = true
      if (esRef.current) {
        try { esRef.current.close() } catch (e) {}
      }
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [enabled])

  return { locations, loading }
}
