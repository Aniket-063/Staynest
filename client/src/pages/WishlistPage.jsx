import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import ListingCard from '../components/listing/ListingCard'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function WishlistPage() {
  const { user } = useAuth()
  const { ids, ready } = useWishlist()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get('/wishlist')
      .then(res => setListings(res.data))
      .finally(() => setLoading(false))
  }, [user, navigate])

  if (loading || !ready) return <LoadingSpinner size="lg" className="py-32" />

  // Heart hatate hi card list se gayab ho jaye
  const visible = listings.filter(l => ids.includes(l._id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
      <p className="text-gray-500 dark:text-slate-400 mt-1 mb-8">
        {visible.length} saved place{visible.length !== 1 ? 's' : ''}
      </p>

      {visible.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🤍</span>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">Nothing saved yet</h3>
          <p className="text-gray-400 dark:text-slate-500 mb-6">Tap the heart on any stay to save it here.</p>
          <Link to="/" className="btn-primary">Browse Listings</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visible.map(l => <ListingCard key={l._id} listing={l} />)}
        </div>
      )}
    </div>
  )
}