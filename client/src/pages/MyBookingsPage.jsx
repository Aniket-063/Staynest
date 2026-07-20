import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyBookings, useCancelBooking } from '../hooks/useBookings'
import LoadingSpinner from '../components/common/LoadingSpinner'

const STATUS_STYLES = {
  pending:   'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  confirmed: 'bg-green-50  dark:bg-green-900/20  text-green-700  dark:text-green-400  border-green-200  dark:border-green-800',
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Custom Cancel Confirmation Modal
function CancelModal({ booking, onConfirm, onClose, cancelling }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm p-6 z-10 animate-fade-in">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🗓️</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
          Cancel Booking?
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 text-center mb-1">
          Are you sure you want to cancel your stay at
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white text-center mb-1">
          {booking?.listing?.title}
        </p>
        <p className="text-xs text-gray-400 dark:text-slate-500 text-center mb-6">
          📅 {formatDate(booking?.checkIn)} → {formatDate(booking?.checkOut)}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-slate-600 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={cancelling}
            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {cancelling ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelling…
              </>
            ) : (
              'Yes, Cancel'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MyBookingsPage() {
  const { bookings, loading, error, refetch } = useMyBookings()
  const { cancelBooking, loading: cancelling } = useCancelBooking()

  const [cancelTarget, setCancelTarget] = useState(null) // jis booking ko cancel karna hai
  const [cancelError, setCancelError]   = useState('')

  // Sirf active bookings dikhao (cancelled hide)
  const activeBookings = bookings.filter(b => b.status !== 'cancelled')

  const handleCancelClick = (booking) => {
    setCancelError('')
    setCancelTarget(booking)
  }

  const handleCancelConfirm = async () => {
    try {
      await cancelBooking(cancelTarget._id)
      setCancelTarget(null)
      refetch()
    } catch {
      setCancelError('Could not cancel booking. Please try again.')
    }
  }

  const handleModalClose = () => {
    setCancelTarget(null)
    setCancelError('')
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onConfirm={handleCancelConfirm}
          onClose={handleModalClose}
          cancelling={cancelling}
        />
      )}

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          {activeBookings.length} active booking{activeBookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {cancelError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6 text-sm text-red-600 dark:text-red-400">
          {cancelError}
        </div>
      )}

      {activeBookings.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🗓️</span>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">No active bookings</h3>
          <p className="text-gray-400 dark:text-slate-500 mb-6">Start exploring and book your first stay!</p>
          <Link to="/" className="btn-primary">Browse Listings</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {activeBookings.map(booking => (
            <div key={booking._id} className="card p-5 flex flex-col sm:flex-row gap-5">
              <Link to={`/listing/${booking.listing?._id}`} className="shrink-0">
                <img
                  src={booking.listing?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&q=70'}
                  alt={booking.listing?.title}
                  className="w-full sm:w-32 h-32 object-cover rounded-xl"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <Link
                      to={`/listing/${booking.listing?._id}`}
                      className="font-semibold text-gray-900 dark:text-white hover:text-brand-500 transition-colors"
                    >
                      {booking.listing?.title || 'Listing'}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                      📍 {booking.listing?.location?.city}, {booking.listing?.location?.country}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${STATUS_STYLES[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 dark:text-slate-300">
                  <span>📅 {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
                  <span>👥 {booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Total: ${booking.totalPrice}</span>
                </div>

                <button
                  onClick={() => handleCancelClick(booking)}
                  disabled={cancelling}
                  className="mt-3 text-sm text-red-500 hover:text-red-600 hover:underline transition-colors disabled:opacity-50"
                >
                  Cancel booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}