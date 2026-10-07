import { Link } from 'react-router-dom'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function BookingSummary({ listing, checkIn, checkOut, guests, breakdown }) {
  if (!listing) return null
  const image = listing.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=70'

  return (
    <div className="space-y-5">
      {/* Listing snapshot */}
      <div className="flex gap-4 items-start pb-5 border-b border-gray-100 dark:border-slate-700">
        <img
          src={image}
          alt={listing.title}
          className="w-24 h-20 rounded-2xl object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
            {listing.title}
          </p>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
            📍 {listing.location?.city}, {listing.location?.country}
          </p>
          <div className="flex gap-3 mt-1 text-xs text-gray-400 dark:text-slate-500">
            <span>⭐ {listing.rating}</span>
            <span>·</span>
            <span>{listing.reviewCount} reviews</span>
          </div>
        </div>
      </div>

      {/* Trip dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-3">
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1">
            Check-in
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(checkIn)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-3">
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1">
            Check-out
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(checkOut)}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-slate-300">
        👥 {guests} guest{guests > 1 ? 's' : ''}
      </p>

      {/* Price breakdown */}
      {breakdown && (
        <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex justify-between text-sm text-gray-600 dark:text-slate-300">
            <span>${breakdown.pricePerNight} × {breakdown.nights} night{breakdown.nights > 1 ? 's' : ''}</span>
            <span>${breakdown.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-slate-300">
            <span>Cleaning fee</span>
            <span>${breakdown.cleaningFee}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-slate-300">
            <span>Service fee</span>
            <span>${breakdown.serviceFee}</span>
          </div>
          
          <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-slate-700 text-base">
            <span>Total (USD)</span>
            <span>${breakdown.total}</span>
          </div>

          {breakdown.totalInr && (
            <div className="flex justify-between text-sm text-gray-500 dark:text-slate-400 pt-1">
              <span>You will pay (1 USD = ₹{breakdown.rate})</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{breakdown.totalInr.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}