import { useParams, Link } from 'react-router-dom'
import ListingMap from '../components/map/ListingMap'
import { useState } from 'react'
import { useListing } from '../hooks/useListing'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ReviewSection from '../components/listing/ReviewSection'
// Naya BookingCard import kar liya gaya hai
import BookingCard from '../components/listing/BookingCard'

const AMENITY_ICONS = {
  wifi: '📶', pool: '🏊', gym: '💪', kitchen: '🍳',
  parking: '🅿️', ac: '❄️', tv: '📺', washer: '🧺',
}

export default function ListingDetailPage() {
  const { id } = useParams()
  const { listing, loading, error } = useListing(id)
  const [activeImg, setActiveImg] = useState(0)

  // Fallback mock for when API isn't connected
  const mockListing = {
    _id: id, title: 'Luxury Beachfront Villa', price: 350,
    description: 'Experience paradise in this stunning beachfront property. Wake up to breathtaking ocean views, enjoy a private pool, and relax on your own stretch of white sand beach. This fully equipped villa offers the perfect blend of luxury and comfort.',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80',
    ],
    location: { city: 'Bali', country: 'Indonesia', lat: -8.4095, lng: 115.1889 },
    category: 'beach', bedrooms: 3, bathrooms: 2, maxGuests: 6, rating: 4.9, reviewCount: 124,
    amenities: ['wifi', 'pool', 'kitchen', 'ac', 'parking', 'tv'],
    host: { name: 'Priya Sharma', avatar: '' },
  }

  const data = listing 
  
  if (loading) return <LoadingSpinner size="lg" className="py-32" />
  
  if (!data) return (
    <div className="text-center py-32">
      <p className="text-gray-500">Listing not found.</p>
      <Link to="/" className="text-brand-500 hover:underline mt-2 block">← Back to listings</Link>
    </div>
  )
  
  const images = data.images?.length ? data.images : [mockListing.images[0]]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-brand-500 mb-6 transition-colors">
        ← Back to listings
      </Link>
      
      {/* Title */}
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {data.title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-gray-500 dark:text-slate-400">
        <span>⭐ {data.rating} ({data.reviewCount} reviews)</span>
        <span>·</span>
        <span>📍 {data.location.city}, {data.location.country}</span>
        <span className="capitalize bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs">
          {data.category}
        </span>
      </div>
      
      {/* Image Gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-3xl overflow-hidden h-[360px] sm:h-[420px] mb-8">
        <div className="col-span-2 row-span-2 relative cursor-pointer" onClick={() => setActiveImg(0)}>
          <img src={images[0]} alt="" className="w-full h-full object-cover" />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="relative cursor-pointer overflow-hidden" onClick={() => setActiveImg(i + 1)}>
            <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        ))}
        {images.length < 4 &&
          Array.from({ length: 4 - images.length }).map((_, i) => (
            <div key={`ph-${i}`} className="bg-gray-100 dark:bg-slate-700" />
          ))
        }
      </div>
      
      {/* Body: Info + Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 pb-6 border-b border-gray-100 dark:border-slate-700">
            {[
              { icon: '🛏️', label: `${data.bedrooms} Bedroom${data.bedrooms > 1 ? 's' : ''}` },
              { icon: '🚿', label: `${data.bathrooms} Bathroom${data.bathrooms > 1 ? 's' : ''}` },
              { icon: '👥', label: `Up to ${data.maxGuests} Guests` },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-2.5">
                <span className="text-xl">{stat.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">{stat.label}</span>
              </div>
            ))}
          </div>
          
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About this place</h2>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed">{data.description}</p>
          </div>
          
          {/* Amenities */}
          {data.amenities?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                    <span className="text-xl">{AMENITY_ICONS[a] || '✓'}</span>
                    <span className="text-sm text-gray-700 dark:text-slate-200 capitalize">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Host */}
          <div className="pb-6 border-b border-gray-100 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your host</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 font-bold text-xl">
                {data.host?.name?.[0] || 'H'}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{data.host?.name || 'Host'}</p>
                <p className="text-sm text-gray-400 dark:text-slate-500">Joined StayNest · Superhost</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 border-t border-gray-100 dark:border-slate-700 pt-8 lg:col-span-2">
          <ReviewSection listingId={data._id} />
        </div>

        {/* Map Section */}
        <div className="mt-8 lg:col-span-2"> 
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Location</h2>
          <div className="w-full h-[380px]"> 
            <ListingMap 
              lat={data.location.lat} 
              lng={data.location.lng} 
              title={data.title} 
              price={data.price} 
            />
          </div>
        </div>
        
        {/* Booking Card — Right Column (Ise hi replace kiya hai) */}
        <div className="lg:col-span-1">
          <BookingCard listing={data} />
        </div>

      </div>
    </div>
  )
}