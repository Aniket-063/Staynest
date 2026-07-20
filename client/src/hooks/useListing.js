import { useState, useEffect } from 'react'
import api from '../services/api'

export function useListing(id) {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .get(`/listings/${id}`)
      .then(res => {
        setListing(res.data)
        setError(null)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return { listing, loading, error }
}