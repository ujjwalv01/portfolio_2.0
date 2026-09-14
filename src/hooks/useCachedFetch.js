import { useEffect, useState } from 'react'

const ONE_HOUR = 60 * 60 * 1000

/**
 * Fetch JSON from a URL and cache it in localStorage for `ttl` ms.
 * Returns { data, error, loading }. Serves stale cache while refetching on expiry.
 */
export default function useCachedFetch(url, { ttl = ONE_HOUR, transform } = {}) {
  const cacheKey = `cache:${url}`

  const readCache = () => {
    try {
      const raw = localStorage.getItem(cacheKey)
      if (!raw) return null
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  const cached = readCache()
  const [data, setData] = useState(cached?.data ?? null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(!cached)

  useEffect(() => {
    let cancelled = false
    const entry = readCache()
    const fresh = entry && Date.now() - entry.ts < ttl

    if (fresh) {
      setData(entry.data)
      setLoading(false)
      return
    }

    setLoading(!entry)
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        const value = transform ? transform(json) : json
        setData(value)
        setError(null)
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: value }))
        } catch { /* storage full or unavailable — ignore */ }
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ttl])

  return { data, error, loading }
}
