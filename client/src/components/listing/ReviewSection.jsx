import { useState } from 'react'
import { useReviews } from '../../hooks/useReviews'
import { useAuth } from '../../context/AuthContext'

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onChange(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="text-2xl transition-transform hover:scale-110">
          <span className={(hover || value) >= star ? 'text-yellow-400' : 'text-gray-200 dark:text-slate-600'}>★</span>
        </button>
      ))}
    </div>
  )}

function ReviewCard({ review }) {
  return (
    <div className="py-5 border-b border-gray-100 dark:border-slate-700 last:border-0">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-300 font-bold text-sm shrink-0">
          {review.author?.name?.[0] || '?'}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900 dark:text-slate-100">{review.author?.name}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">
            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="ml-auto flex gap-0.5">
          {[1,2,3,4,5].map(s => (
            <span key={s} className={`text-sm ${s <= review.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-slate-600'}`}>★</span>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed pl-12">{review.comment}</p>
    </div>
  )
}

export default function ReviewSection({ listingId }) {
  const { reviews, loading, addReview } = useReviews(listingId)
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating]     = useState(0)
  const [comment, setComment]   = useState('')
  const [bookingId, setBookingId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return setFormError('Please select a rating')
    if (comment.trim().length < 10) return setFormError('Comment must be at least 10 characters')
    setSubmitting(true)
    setFormError('')
    try {
      await addReview({ rating, comment, bookingId })
      setRating(0); setComment(''); setBookingId(''); setShowForm(false)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Reviews
          {avgRating && (
            <span className="ml-3 text-base font-normal text-gray-500 dark:text-slate-400">
              ⭐ {avgRating} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          )}
        </h2>
        {user && !showForm && (
          <button onClick={() => setShowForm(true)} className="btn-secondary text-sm py-2 px-4">Write a Review</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Your Review</h3>
          {formError && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2">{formError}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Comment</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} placeholder="Share your experience..." className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Booking ID <span className="text-gray-400 font-normal">(required)</span></label>
            <input type="text" value={bookingId} onChange={e => setBookingId(e.target.value)} placeholder="Paste your booking ID from My Bookings" className="input-field text-sm" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary text-sm py-2 px-5 disabled:opacity-60">{submitting ? 'Submitting…' : 'Submit Review'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm py-2 px-5">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse py-5 border-b border-gray-100 dark:border-slate-700">
              <div className="flex gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/4" />
                  <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full w-1/6" />
                </div>
              </div>
              <div className="pl-12 space-y-1.5">
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-full" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10">
          <span className="text-4xl mb-3 block">💬</span>
          <p className="text-gray-400 dark:text-slate-500 text-sm">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div>{reviews.map(review => <ReviewCard key={review._id} review={review} />)}</div>
      )}
    </div>
  )
}