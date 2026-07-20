import { useState, useEffect } from 'react'
import api from '../services/api'

export function useListings(filters = {}) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    api
      .get('/listings', { params: filters, signal: controller.signal })
      .then(res => {
        setListings(res.data)
        setError(null)
      })
      .catch(err => {
        if (err.name !== 'CanceledError') setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [JSON.stringify(filters)])

  return { listings, loading, error }
}