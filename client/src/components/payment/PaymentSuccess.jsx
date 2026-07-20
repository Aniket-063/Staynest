import { Link } from 'react-router-dom'
import Confetti from './Confetti'
import SuccessCheckmark from './SuccessCheckmark'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function PaymentSuccess({ booking, listing, breakdown }) {
  return (
    <div className="relative overflow-hidden">
      <Confetti />
      <div className="text-center py-4 px-2">
        <SuccessCheckmark />

        <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2 animate-slide-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
          Booking Confirmed! 🎉
        </h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 animate-slide-up" style={{ animationDelay: '0.85s', opacity: 0 }}>
          Your stay has been booked. Check your email for confirmation details.
        </p>

        {/* Booking card */}
        <div
          className="bg-gray-50 dark:bg-slate-800/60 rounded-3xl p-5 text-left mb-6 space-y-4 animate-slide-up"
          style={{ animationDelay: '1s', opacity: 0 }}
        >
          {listing && (
            <div className="flex gap-4 items-center pb-4 border-b border-gray-100 dark:border-slate-700">
              <img
                src={listing.images?.[0]}
                alt={listing.title}
                className="w-16 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">{listing.title}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                  📍 {listing.location?.city}, {listing.location?.country}
                </p>
              </div>
            </div>
          )}

          {booking && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wide mb-0.5">Check-in</p>
                <p className="font-semibold text-gray-900 dark:text-white">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wide mb-0.5">Check-out</p>
                <p className="font-semibold text-gray-900 dark:text-white">{formatDate(booking.checkOut)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wide mb-0.5">Guests</p>
                <p className="font-semibold text-gray-900 dark:text-white">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wide mb-0.5">Total Paid</p>
                <p className="font-semibold text-green-600 dark:text-green-400">${booking.totalPrice}</p>
              </div>
            </div>
          )}

          {booking?._id && (
            <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">Booking ID</p>
              <code className="text-xs bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-3 py-1.5 rounded-xl text-gray-600 dark:text-slate-300 block break-all">
                {booking._id}
              </code>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '1.15s', opacity: 0 }}>
          <Link to="/my-bookings" className="btn-primary py-3.5 text-base">
            View My Bookings
          </Link>
          <Link to="/" className="btn-secondary py-3 text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}