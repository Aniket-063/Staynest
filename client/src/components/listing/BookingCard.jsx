import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAvailability } from '../../hooks/useReviews'

export default function BookingCard({ listing }) {
  const { user }     = useAuth()
  const navigate     = useNavigate()

  const today    = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [checkIn,  setCheckIn]  = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [guests,   setGuests]   = useState(1)

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0

  const subtotal    = listing.price * nights
  const cleaningFee = nights > 0 ? 45 : 0
  const serviceFee  = nights > 0 ? Math.round(subtotal * 0.12) : 0
  const total       = subtotal + cleaningFee + serviceFee

  const { available, loading: avLoading } = useAvailability(
    listing._id, checkIn, checkOut
  )

  const handleReserve = () => {
    if (!user) return navigate(`/login?redirect=/checkout/${listing._id}`)
    navigate(`/checkout/${listing._id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
  }

  return (
    <div className="sticky top-24 card p-6 shadow-xl">
      <div className="flex items-baseline gap-1 mb-5">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">${listing.price}</span>
        <span className="text-gray-400 dark:text-slate-500">/ night</span>
        {listing.rating > 0 && (
          <span className="ml-auto text-sm text-gray-500 dark:text-slate-400">
            ⭐ {listing.rating}
          </span>
        )}
      </div>

      <div className="border border-gray-200 dark:border-slate-600 rounded-2xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-slate-600">
          <div className="p-3">
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">Check-in</label>
            <input type="date" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)} className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-slate-100 focus:outline-none" />
          </div>
          <div className="p-3">
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">Check-out</label>
            <input type="date" value={checkOut} min={checkIn} onChange={e => setCheckOut(e.target.value)} className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-slate-100 focus:outline-none" />
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-slate-600 p-3">
          <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">Guests</label>
          <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-slate-100 focus:outline-none">
            {Array.from({ length: listing.maxGuests || 6 }, (_, i) => (
            <option key={i + 1} value={i + 1} className="text-gray-900 dark:text-white dark:bg-slate-800">
              {i + 1} guest{i > 0 ? 's' : ''}
            </option>
            ))}
          </select>
        </div>
      </div>

      {nights > 0 && available !== null && !avLoading && (
        <div className={`flex items-center gap-2 text-xs font-medium rounded-xl px-3 py-2 mb-3
          ${available ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50  dark:bg-red-900/20  text-red-600  dark:text-red-400'}`}>
          <span>{available ? '✅' : '❌'}</span>
          {available ? 'These dates are available!' : 'These dates are already booked.'}
        </div>
      )}

      <button onClick={handleReserve} disabled={nights === 0 || available === false} className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
        {!user ? 'Sign in to Reserve' : nights === 0 ? 'Select dates' : 'Reserve Now'}
      </button>

      <p className="text-xs text-center text-gray-400 dark:text-slate-500 mt-2">You won't be charged yet</p>

      {nights > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700 space-y-2 text-sm text-gray-600 dark:text-slate-300">
          <div className="flex justify-between"><span>${listing.price} × {nights} night{nights > 1 ? 's' : ''}</span><span>${subtotal}</span></div>
          <div className="flex justify-between"><span>Cleaning fee</span><span>${cleaningFee}</span></div>
          <div className="flex justify-between"><span>Service fee (12%)</span><span>${serviceFee}</span></div>
          <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-3 mt-1 border-t border-gray-100 dark:border-slate-700 text-base"><span>Total</span><span>${total}</span></div>
        </div>
      )}
    </div>
  )
}