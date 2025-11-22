"use client"

import { useState, useEffect, useCallback } from "react"

export function useApi<T>(apiFn: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await apiFn()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setData(null)
    } finally {
      setLoading(false)
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  dependencies)

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    fetchData()
    return () => {
      mounted = false
    }
  }, [fetchData])

  const refetch = async () => {
    await fetchData()
  }

  return { data, loading, error, refetch }
}
