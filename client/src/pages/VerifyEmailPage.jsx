import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import SuccessCheckmark from '../components/payment/SuccessCheckmark'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const [status, setStatus] = useState(token ? 'verifying' : 'no_token') // 'verifying' | 'success' | 'error' | 'no_token'
  const [message, setMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendStatus, setResendStatus] = useState({ loading: false, message: '', error: '' })

  useEffect(() => {
    if (!token) return

    let isMounted = true

    const verify = async () => {
      try {
        const { data } = await api.post('/auth/verify-email', { token })
        if (!isMounted) return

        setStatus('success')
        setMessage(data.message || 'Your email address has been verified successfully!')
        if (data.token && data.user) {
          setAuth(data.user, data.token)
        }
      } catch (err) {
        if (!isMounted) return
        setStatus('error')
        setMessage(err.response?.data?.message || 'This verification link is invalid or has expired.')
      }
    }

    verify()

    return () => {
      isMounted = false
    }
  }, [token, setAuth])

  const handleResend = async (e) => {
    e.preventDefault()
    if (!resendEmail.trim()) return

    setResendStatus({ loading: true, message: '', error: '' })
    try {
      const { data } = await api.post('/auth/resend-verification', { email: resendEmail.trim() })
      setResendStatus({ loading: false, message: data.message || 'Verification link sent! Please check your inbox.', error: '' })
    } catch (err) {
      setResendStatus({
        loading: false,
        message: '',
        error: err.response?.data?.message || 'Failed to resend verification link. Please check the email address.',
      })
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-xl text-center">
          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="py-8">
              <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verifying your email…
              </h2>
              <p className="text-gray-500 dark:text-slate-400 text-sm">
                Please wait while we confirm your StayNest account.
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="py-4">
              <SuccessCheckmark />
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Email Verified! 🎉
              </h2>
              <p className="text-gray-600 dark:text-slate-300 text-sm mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary w-full py-3.5 text-base"
                >
                  Explore Stays 🏡
                </button>
              </div>
            </div>
          )}

          {/* Error / Expired Link State */}
          {status === 'error' && (
            <div className="py-2">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚠️
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 dark:text-slate-300 text-sm mb-6">
                {message}
              </p>

              <div className="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-5 border border-gray-100 dark:border-slate-700 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  Need a new verification link?
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                  Enter your registered email address and we'll send you a fresh link.
                </p>

                {resendStatus.message && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-lg p-3 text-xs mb-3">
                    {resendStatus.message}
                  </div>
                )}
                {resendStatus.error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg p-3 text-xs mb-3">
                    {resendStatus.error}
                  </div>
                )}

                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="input-field text-sm"
                  />
                  <button
                    type="submit"
                    disabled={resendStatus.loading}
                    className="btn-primary w-full py-2.5 text-sm disabled:opacity-60"
                  >
                    {resendStatus.loading ? 'Sending link…' : 'Resend Verification Link'}
                  </button>
                </form>
              </div>

              <div className="mt-6">
                <Link to="/login" className="text-sm text-brand-500 hover:text-brand-600 font-medium">
                  ← Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* No Token State (User navigated here directly) */}
          {status === 'no_token' && (
            <div className="py-2">
              <div className="w-14 h-14 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                ✉️
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-600 dark:text-slate-300 text-sm mb-6">
                Please click the verification link sent to your inbox to activate your StayNest account.
              </p>

              <div className="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-5 border border-gray-100 dark:border-slate-700 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  Didn't receive the email?
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                  Check your spam folder or enter your email to get a new link.
                </p>

                {resendStatus.message && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-lg p-3 text-xs mb-3">
                    {resendStatus.message}
                  </div>
                )}
                {resendStatus.error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg p-3 text-xs mb-3">
                    {resendStatus.error}
                  </div>
                )}

                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="input-field text-sm"
                  />
                  <button
                    type="submit"
                    disabled={resendStatus.loading}
                    className="btn-primary w-full py-2.5 text-sm disabled:opacity-60"
                  >
                    {resendStatus.loading ? 'Sending link…' : 'Send Verification Link'}
                  </button>
                </form>
              </div>

              <div className="mt-6">
                <Link to="/login" className="text-sm text-brand-500 hover:text-brand-600 font-medium">
                  ← Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
