import ListingCard from './ListingCard'
import ListingCardSkeleton from './ListingCardSkeleton'

export default function ListingGrid({ listings, loading, error }) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-5xl mb-4">😕</span>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">
          Something went wrong
        </h3>
        <p className="text-sm text-gray-400 dark:text-slate-500">{error}</p>
      </div>
    )
  }

  if (!loading && listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-5xl mb-4">🔍</span>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">
          No listings found
        </h3>
        <p className="text-sm text-gray-400 dark:text-slate-500">
          Try adjusting your filters or search for a different location.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <ListingCardSkeleton key={i} />)
        : listings.map(listing => <ListingCard key={listing._id} listing={listing} />)
      }
    </div>
  )
}