import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import HeroSection from '../components/common/HeroSection'
import CategoryFilter from '../components/listing/CategoryFilter'
import PriceFilter from '../components/listing/PriceFilter'
import ListingGrid from '../components/listing/ListingGrid'
import { useListings } from '../hooks/useListings'
import MultiListingMap from '../components/map/MultiListingMap'

// --- Fallback mock data so UI works without a backend ---
const MOCK_LISTINGS = [
  {
    _id: '1', title: 'Beachfront Villa in Bali', price: 189,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80'],
    location: { city: 'Bali', country: 'Indonesia', lat: -8.4095, lng: 115.1889 },
    category: 'beach', bedrooms: 3, bathrooms: 2, maxGuests: 6, rating: 4.9, reviewCount: 124,
  },
  {
    _id: '2', title: 'Cozy Mountain Chalet', price: 142,
    images: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80'],
    location: { city: 'Zermatt', country: 'Switzerland', lat: 46.0207, lng: 7.7491 },
    category: 'mountain', bedrooms: 2, bathrooms: 1, maxGuests: 4, rating: 4.7, reviewCount: 89,
  },
  {
    _id: '3', title: 'Modern Loft in Manhattan', price: 225,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80'],
    location: { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
    category: 'city', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 4.8, reviewCount: 203,
  },
  {
    _id: '4', title: 'Luxury Private Pool Villa', price: 450,
    images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80'],
    location: { city: 'Santorini', country: 'Greece', lat: 36.3932, lng: 25.4615 },
    category: 'luxury', bedrooms: 4, bathrooms: 3, maxGuests: 8, rating: 5.0, reviewCount: 67,
  },
  {
    _id: '5', title: 'Tuscan Countryside Farmhouse', price: 165,
    images: ['https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=600&q=80'],
    location: { city: 'Siena', country: 'Italy', lat: 43.3186, lng: 11.3306 },
    category: 'countryside', bedrooms: 3, bathrooms: 2, maxGuests: 6, rating: 4.6, reviewCount: 45,
  },
  {
    _id: '6', title: 'Stylish Apartment in Paris', price: 198,
    images: ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80'],
    location: { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    category: 'city', bedrooms: 2, bathrooms: 1, maxGuests: 4, rating: 4.8, reviewCount: 178,
  },
  {
    _id: '7', title: 'Tropical Beach Bungalow', price: 119,
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80'],
    location: { city: 'Phuket', country: 'Thailand', lat: 7.8804, lng: 98.3923 },
    category: 'beach', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 4.5, reviewCount: 92,
  },
  {
    _id: '8', title: 'Ski-in/Ski-out Alpine Cabin', price: 310,
    images: ['https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80'],
    location: { city: 'Chamonix', country: 'France', lat: 45.9237, lng: 6.8694 },
    category: 'mountain', bedrooms: 3, bathrooms: 2, maxGuests: 6, rating: 4.9, reviewCount: 56,
  },
]

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState('')
  const [priceFilter, setPriceFilter] = useState({})
  
  const cityParam = searchParams.get('city') || ''
  const catParam  = searchParams.get('category') || ''
  
  useEffect(() => {
    if (catParam) setCategory(catParam)
  }, [catParam])
  
  const filters = {
    ...(category && { category }),
    ...(cityParam && { city: cityParam }),
    ...priceFilter,
  }
  
  const { listings: apiListings, loading, error } = useListings(filters)
  
  // Use mock data when API isn't connected yet
  const rawListings = apiListings?.listings || []
  
  // Client-side filter on mock data
  const listings = rawListings.filter(l => {
    if (category && l.category !== category) return false
    if (cityParam && !l.location.city.toLowerCase().includes(cityParam.toLowerCase())) return false
    if (priceFilter.minPrice && l.price < Number(priceFilter.minPrice)) return false
    if (priceFilter.maxPrice && l.price > Number(priceFilter.maxPrice)) return false
    return true
  })
  
  const showLoading = loading && !apiListings.length
  
  return (
    <>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="flex-1 min-w-0">
            <CategoryFilter selected={category} onSelect={setCategory} />
          </div>
          <div className="shrink-0">
            <PriceFilter onApply={setPriceFilter} />
          </div>
        </div>
        
        {/* Results Count */}
        {!showLoading && (
          <p className="text-sm text-gray-400 dark:text-slate-500 mb-5">
            {listings.length} {listings.length === 1 ? 'place' : 'places'} found
            {cityParam && ` near "${cityParam}"`}
          </p>
        )}
        
        {/* Grid (Full Width) */}
        <div className="mb-12">
          <ListingGrid
            listings={listings}
            loading={showLoading}
            error={error}
          />
        </div>
        
        {/* Map Section (At the bottom, full width) */}
        <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Explore on Map</h2>
          <div className="h-[500px] w-full">
            <MultiListingMap listings={listings} />
          </div>
        </div>
      </div>
    </>
  )
}