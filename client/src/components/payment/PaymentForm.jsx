import { useState } from 'react'
import api from '../../services/api'
import ProcessingOverlay from './ProcessingOverlay'

export default function PaymentForm({ orderId, amount, currency, keyId, bookingId, onSuccess }) {
  const [message, setMessage] = useState('')
  const [overlayStatus, setOverlayStatus] = useState('idle')

  const handlePay = () => {
    if (!window.Razorpay) {
      setMessage('Payment SDK not loaded. Please refresh and try again.')
      return
    }

    const options = {
      key:      keyId,
      amount:   amount,
      currency: currency,
      name:     'StayNest',
      description: 'Booking payment',
      order_id: orderId,
      // Razorpay khud Card/UPI/Netbanking/Wallet/EMI sab dikhata hai is checkout mein
      handler: async (response) => {
        setOverlayStatus('processing')
        try {
          await new Promise(r => setTimeout(r, 1200)) // UX ke liye thoda delay
          await api.post('/payments/verify', {
            bookingId,
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          })
          onSuccess({ bookingId, paymentId: response.razorpay_payment_id })
        } catch (err) {
          setMessage(err.response?.data?.message || 'Payment verification failed. Please contact support.')
          setOverlayStatus('error')
          setTimeout(() => setOverlayStatus('idle'), 1600)
        }
      },
      modal: {
        ondismiss: () => {
          setMessage('Payment cancelled.')
        },
      },
      theme: { color: '#f43f5e' },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', () => {
      setMessage('Payment failed. Please try again.')
      setOverlayStatus('error')
      setTimeout(() => setOverlayStatus('idle'), 1600)
    })
    rzp.open()
  }

  return (
    <>
      <ProcessingOverlay status={overlayStatus} />

      <div className="space-y-5">
        {message && (
          <div className="flex gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3">
            <span className="text-red-500 shrink-0">⚠️</span>
            <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
          </div>
        )}

        <div className="flex gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl px-4 py-3">
          <span className="text-blue-400 shrink-0 text-sm">ℹ️</span>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            <strong>Test mode:</strong> Card <code className="bg-blue-100 dark:bg-blue-800/60 px-1.5 py-0.5 rounded-md">4111 1111 1111 1111</code>, any future date, any CVV.
            UPI ke liye <code className="bg-blue-100 dark:bg-blue-800/60 px-1.5 py-0.5 rounded-md">success@razorpay</code> use karo.
          </p>
        </div>

        <button
          onClick={handlePay}
          className="btn-primary w-full py-4 text-base font-semibold flex items-center justify-center gap-2"
        >
          🔒 Pay Now
        </button>

        <p className="text-center text-xs text-gray-400 dark:text-slate-500">
          Secured by Razorpay
        </p>
      </div>
    </>
  )
}