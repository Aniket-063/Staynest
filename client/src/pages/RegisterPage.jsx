import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [resendStatus, setResendStatus] = useState({ loading: false, message: '', error: '' })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      return setError('Passwords do not match')
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      })
      setSubmittedEmail(form.email)
      setEmailSent(true)
    } catch (err) {
      if (err.response?.data?.needsVerification) {
        setSubmittedEmail(form.email)
        setEmailSent(true)
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendStatus({ loading: true, message: '', error: '' })
    try {
      const { data } = await api.post('/auth/resend-verification', { email: submittedEmail })
      setResendStatus({ loading: false, message: data.message || 'Fresh verification link sent!', error: '' })
    } catch (err) {
      setResendStatus({
        loading: false,
        message: '',
        error: err.response?.data?.message || 'Failed to resend. Please try again.',
      })
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">🏡</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {emailSent ? 'Check your email' : 'Create account'}
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            {emailSent ? 'Almost there! Verify your account to start' : 'Join thousands of happy travellers'}
          </p>
        </div>

        <div className="card p-8 shadow-xl">
          {emailSent ? (
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-3xl flex items-center justify-center mx-auto mb-5 text-3xl shadow-sm">
                ✉️
              </div>
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
                Verification link sent!
              </h2>
              <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                We've sent an email to <strong className="text-gray-900 dark:text-white">{submittedEmail}</strong>.
                Please check your inbox and click the verification button to activate your account.
              </p>

              {resendStatus.message && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs mb-4 text-left">
                  {resendStatus.message}
                </div>
              )}
              {resendStatus.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-3 text-xs mb-4 text-left">
                  {resendStatus.error}
                </div>
              )}

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendStatus.loading}
                  className="btn-secondary w-full py-3 text-sm disabled:opacity-60"
                >
                  {resendStatus.loading ? 'Resending…' : 'Resend Verification Email'}
                </button>

                <Link
                  to="/login"
                  className="btn-primary block w-full py-3 text-sm text-center"
                >
                  Go to Sign In
                </Link>
              </div>

              <p className="text-xs text-gray-400 dark:text-slate-500 mt-5">
                Didn't see it? Check your spam/junk folder.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Full name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Aniket Sharma"
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Confirm password</label>
                  <input
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="input-field"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>
              <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-5">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}