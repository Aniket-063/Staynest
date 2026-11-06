import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState('')
  const [resendStatus, setResendStatus] = useState({ loading: false, message: '', error: '' })
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNeedsVerification(false)
    setResendStatus({ loading: false, message: '', error: '' })
    setLoading(true)

    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      const resp = err.response?.data
      if (resp?.needsVerification) {
        setNeedsVerification(true)
        setUnverifiedEmail(resp.email || form.email)
        setError(resp.message || 'Please verify your email address to log in.')
      } else {
        setError(resp?.message || 'Login failed. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    const targetEmail = unverifiedEmail || form.email
    if (!targetEmail) return

    setResendStatus({ loading: true, message: '', error: '' })
    try {
      const { data } = await api.post('/auth/resend-verification', { email: targetEmail })
      setResendStatus({ loading: false, message: data.message || 'Fresh verification link sent! Please check your inbox.', error: '' })
    } catch (err) {
      setResendStatus({
        loading: false,
        message: '',
        error: err.response?.data?.message || 'Failed to resend verification link.',
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
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-slate-400">Sign in to your StayNest account</p>
        </div>
        <div className="card p-8 shadow-xl">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
              <p>{error}</p>
              {needsVerification && (
                <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800/60">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendStatus.loading}
                    className="text-xs font-semibold underline hover:text-red-700 dark:hover:text-red-300 disabled:opacity-60"
                  >
                    {resendStatus.loading ? 'Sending verification link…' : '✉️ Click here to resend verification link'}
                  </button>
                  {resendStatus.message && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                      ✓ {resendStatus.message}
                    </p>
                  )}
                  {resendStatus.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      ✕ {resendStatus.error}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                Email address
              </label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
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
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}