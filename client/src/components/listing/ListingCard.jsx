import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ListingCard({ listing }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  
  const images = listing.images?.length ? listing.images : [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80'
  ]

  const prevImg = (e) => {
    e.preventDefault()
    setImgIdx(i => (i === 0 ? images.length - 1 : i - 1))
  }

  const nextImg = (e) => {
    e.preventDefault()
    setImgIdx(i => (i === images.length - 1 ? 0 : i + 1))
  }

  return (
    <Link to={`/listing/${listing._id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 mb-3">
        <img
          src={images[imgIdx]}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); setWishlisted(w => !w) }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:scale-110 transition-transform shadow-sm"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span className={`text-lg ${wishlisted ? 'text-brand-500' : 'text-gray-400'}`}>
            {wishlisted ? '♥' : '♡'}
          </span>
        </button>
        
        {/* Category Badge */}
        {listing.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-slate-200 rounded-full capitalize backdrop-blur-sm shadow-sm">
            {listing.category}
          </span>
        )}
        
        {/* Image Arrows — visible on hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-gray-700 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            >‹</button>
            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-gray-700 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            >›</button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-3' : 'bg-white/60'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Info */}
      <div className="space-y-1 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm leading-snug line-clamp-1 flex-1">
            {listing.title}
          </h3>
          {listing.rating > 0 && (
            <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-slate-300 shrink-0">
              ⭐ {listing.rating.toFixed(1)}
            </span>
          )}
        </div>
        {/* Location — gray-500 → gray-600 (zyada visible) */}
        <p className="text-sm text-gray-600 dark:text-slate-400 truncate">
          {listing.location?.city}, {listing.location?.country}
        </p>
        {/* Bed/bath — gray-500 → gray-600 (zyada visible) */}
        <p className="text-sm text-gray-600 dark:text-slate-300">
          {listing.bedrooms} bed · {listing.bathrooms} bath · up to {listing.maxGuests} guests
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 mt-1">
          <span className="text-brand-500">${listing.price}</span>
          {/* /night — gray-400 → gray-500 (thoda zyada visible) */}
          <span className="font-normal text-gray-500 dark:text-slate-400"> / night</span>
        </p>
      </div>
    </Link>
  )
}