import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export function useMyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/bookings/my')
      setBookings(data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])
  return { bookings, loading, error, refetch: fetch }
}

export function useCreateBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const createBooking = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/bookings', payload)
      return data
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])
  return { createBooking, loading, error }
}

export function useCancelBooking() {
  const [loading, setLoading] = useState(false)
  const cancelBooking = useCallback(async (bookingId) => {
    setLoading(true)
    try {
      const { data } = await api.patch(`/bookings/${bookingId}/cancel`)
      return data
    } finally {
      setLoading(false)
    }
  }, [])
  return { cancelBooking, loading }
}