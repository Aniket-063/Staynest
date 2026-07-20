import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/?city=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🏡</span>
          </div>
          <span className="font-display font-bold text-xl text-gray-900 dark:text-white tracking-tight hidden sm:block">
            StayNest
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex">
          <div className="flex w-full items-center bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-400 transition-all">
            <span className="pl-4 text-gray-400 text-sm">📍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="flex-1 px-3 py-2.5 bg-transparent text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="m-1 px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right Nav */}
        <nav className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-lg"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200 hidden sm:block">
                  {user.name}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-xl py-1 z-50">
                  <Link
                    to="/my-bookings"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    My Bookings
                  </Link>
                  <hr className="border-gray-100 dark:border-slate-700 my-1" />
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="flex items-center bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-400 transition-all">
          <span className="pl-4 text-gray-400 text-sm">📍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search destinations..."
            className="flex-1 px-3 py-2.5 bg-transparent text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 focus:outline-none"
          />
          <button type="submit" className="m-1 px-4 py-1.5 bg-brand-500 text-white text-sm font-medium rounded-xl">
            Go
          </button>
        </form>
      </div>
    </header>
  )
}