import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export function useReviews(listingId) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchReviews = useCallback(async () => {
    if (!listingId) return
    setLoading(true)
    try {
      const { data } = await api.get(`/listings/${listingId}/reviews`)
      setReviews(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [listingId])

  useEffect(() => { fetchReviews() }, [fetchReviews])

  const addReview = useCallback(async (payload) => {
    const { data } = await api.post(`/listings/${listingId}/reviews`, payload)
    setReviews(prev => [data, ...prev])
    return data
  }, [listingId])

  return { reviews, loading, error, addReview, refetch: fetchReviews }
}

export function useAvailability(listingId, checkIn, checkOut) {
  const [available, setAvailable] = useState(null)
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (!listingId || !checkIn || !checkOut) return
    setLoading(true)
    api.get(`/listings/${listingId}/availability`, { params: { checkIn, checkOut } })
      .then(r => setAvailable(r.data.available))
      .catch(() => setAvailable(null))
      .finally(() => setLoading(false))
  }, [listingId, checkIn, checkOut])

  return { available, loading }
}