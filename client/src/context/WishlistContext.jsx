import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [ids, setIds]     = useState([])
  const [ready, setReady] = useState(false)

  // Login hote hi (ya page refresh par) database se saved ids le aao
  useEffect(() => {
    if (!user) { setIds([]); setReady(true); return }
    setReady(false)
    api.get('/wishlist/ids')
      .then(res => setIds(res.data))
      .catch(() => setIds([]))
      .finally(() => setReady(true))
  }, [user])

  const isWishlisted = useCallback(id => ids.includes(id), [ids])

  const toggle = useCallback(async (id) => {
    const has = ids.includes(id)
    // Pehle UI badlo (turant red/khali ho), phir server ko batao
    setIds(prev => has ? prev.filter(x => x !== id) : [...prev, id])
    try {
      if (has) await api.delete(`/wishlist/${id}`)
      else     await api.post(`/wishlist/${id}`)
    } catch {
      // Server fail hua to UI wapas purani halat mein
      setIds(prev => has ? [...prev, id] : prev.filter(x => x !== id))
    }
  }, [ids])

  return (
    <WishlistContext.Provider value={{ ids, ready, isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}