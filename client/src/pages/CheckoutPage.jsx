import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useListing } from '../hooks/useListing'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

import PaymentForm from '../components/payment/PaymentForm'
import BookingSummary from '../components/payment/BookingSummary'
import PaymentSuccess from '../components/payment/PaymentSuccess'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function CheckoutPage() {
  const { id }                     = useParams()
  const [searchParams]             = useSearchParams()
  const { listing, loading: listingLoading } = useListing(id)
  const { user }                   = useAuth()
  const navigate                   = useNavigate()

  const [step, setStep]           = useState(1)

  const today    = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [checkIn,  setCheckIn]   = useState(searchParams.get('checkIn')  || today)
  const [checkOut, setCheckOut]  = useState(searchParams.get('checkOut') || tomorrow)
  const [guests,   setGuests]    = useState(Number(searchParams.get('guests')) || 1)

  const [orderData,     setOrderData]     = useState(null)
  const [bookingId,     setBookingId]     = useState('')
  const [breakdown,     setBreakdown]     = useState(null)
  const [intentLoading, setIntentLoading] = useState(false)
  const [intentError,   setIntentError]   = useState('')

  const [confirmedBooking, setConfirmedBooking] = useState(null)

  useEffect(() => {
    if (!user) navigate(`/login?redirect=/checkout/${id}`)
  }, [user, id, navigate])

  const mockListing = {
    _id: id,
    title: 'Beachfront Villa with Infinity Pool',
    price: 289,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80'],
    location: { city: 'Bali', country: 'Indonesia' },
    rating: 4.9, reviewCount: 124,
    maxGuests: 6, bedrooms: 3, bathrooms: 2,
  }
  const data = listing || mockListing

  const handleProceedToPayment = async () => {
    if (!checkIn || !checkOut) return setIntentError('Please select check-in and check-out dates')
    if (new Date(checkOut) <= new Date(checkIn)) return setIntentError('Check-out must be after check-in')

    setIntentError('')
    setIntentLoading(true)

    try {
      const { data: res } = await api.post('/payments/create-order', {
        listingId: id,
        checkIn,
        checkOut,
        guests,
      })
      setOrderData(res)
      setBookingId(res.bookingId)
      setBreakdown(res.breakdown)
      setStep(2)
    } catch (err) {
      setIntentError(err.response?.data?.message || 'Could not initiate payment. Try again.')
    } finally {
      setIntentLoading(false)
    }
  }

  const handlePaymentSuccess = (result) => {
    setConfirmedBooking({
      _id:        result.bookingId,
      checkIn,
      checkOut,
      guests,
      totalPrice: breakdown?.total,
      totalInr:   breakdown?.totalInr,
    })
    setStep(3)
  }

  if (listingLoading) return <LoadingSpinner size="lg" className="py-32" />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {step < 3 && (
        <Link to={`/listing/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-brand-500 mb-6 transition-colors">
          ← Back to listing
        </Link>
      )}

      {step < 3 && (
        <div className="flex items-center gap-3 mb-8">
          {['Trip Details', 'Payment'].map((label, i) => {
            const s = i + 1
            const active   = step === s
            const complete = step > s
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${complete ? 'bg-green-500 text-white' : active ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500'}`}>
                  {complete ? '✓' : s}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}`}>
                  {label}
                </span>
                {i < 1 && <div className={`w-8 sm:w-16 h-0.5 ${step > s ? 'bg-green-400' : 'bg-gray-200 dark:bg-slate-700'}`} />}
              </div>
            )
          })}
        </div>
      )}

      {step === 3 && (
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="card p-6 shadow-xl relative">
            <PaymentSuccess
              booking={confirmedBooking}
              listing={data}
              breakdown={breakdown}
            />
          </div>
        </div>
      )}

      {step < 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === 1 && (
              <div className="card p-6 shadow-sm">
                <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Your trip details
                </h1>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">CHECK-IN</label>
                      <input type="date" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">CHECK-OUT</label>
                      <input type="date" value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">GUESTS</label>
                    <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="input-field">
                      {Array.from({ length: data.maxGuests || 6 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {intentError && (
                  <div className="mt-4 flex gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3">
                    <span className="text-red-400 shrink-0">⚠️</span>
                    <p className="text-sm text-red-600 dark:text-red-400">{intentError}</p>
                  </div>
                )}
                <button
                  onClick={handleProceedToPayment}
                  disabled={intentLoading}
                  className="btn-primary w-full py-4 text-base mt-6 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {intentLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Preparing checkout…</> : 'Continue to Payment →'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Payment</h1>
                  <button onClick={() => setStep(1)} className="text-sm text-brand-500 hover:text-brand-600 transition-colors">← Edit dates</button>
                </div>
                {orderData ? (
                  <PaymentForm
                    orderId={orderData.orderId}
                    amount={orderData.amount}
                    currency={orderData.currency}
                    keyId={orderData.keyId}
                    bookingId={bookingId}
                    onSuccess={handlePaymentSuccess}
                  />
                ) : (
                  <p className="text-sm text-gray-500">Loading payment options…</p>
                )}
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <div className="card p-5 shadow-sm sticky top-24">
              <BookingSummary listing={data} checkIn={checkIn} checkOut={checkOut} guests={guests} breakdown={breakdown} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}