import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1400&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80',
]

const POPULAR = ['Bali', 'Paris', 'New York', 'Santorini', 'Tokyo']

export default function HeroSection() {
  const [search, setSearch] = useState('')
  const [bgIdx] = useState(() => Math.floor(Math.random() * HERO_IMAGES.length))
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const term = search.trim()
    if (term) navigate(`/?city=${encodeURIComponent(term)}`)
  }

  return (
    <section className="relative h-[480px] sm:h-[560px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src={HERO_IMAGES[bgIdx]}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-2xl mx-auto">
        <p className="text-brand-300 text-sm font-semibold tracking-widest uppercase mb-3">
          Welcome to StayNest
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
          Find your perfect<br />place to stay
        </h1>
        
        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl"
        >
          <span className="pl-2 text-gray-400">📍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Where do you want to go?"
            className="flex-1 py-3 px-2 bg-transparent text-gray-900 dark:text-slate-100 placeholder-gray-400 focus:outline-none text-base"
          />
          <button type="submit" className="btn-primary px-6 py-3 text-base whitespace-nowrap">
            Search
          </button>
        </form>
        
        {/* Popular */}
        <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
          <span className="text-white/70 text-sm">Popular:</span>
          {POPULAR.map(place => (
            <button
              key={place}
              onClick={() => navigate(`/?city=${encodeURIComponent(place)}`)}
              className="text-sm text-white/90 hover:text-white border border-white/30 hover:border-white/60 rounded-full px-3 py-1 transition-colors backdrop-blur-sm"
            >
              {place}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}