import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      return setError('Passwords do not match')
    }
    setLoading(true)
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, password: form.password })
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
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
            Create account
          </h1>
          <p className="text-gray-500 dark:text-slate-400">Join thousands of happy travellers</p>
        </div>
        <div className="card p-8 shadow-xl">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Full name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Aniket Sharma" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="At least 6 characters" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Confirm password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="••••••••" required className="input-field" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}