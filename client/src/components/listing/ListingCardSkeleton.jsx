export default function ListingCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] rounded-2xl bg-gray-200 dark:bg-slate-700 mb-3" />
      <div className="space-y-2 px-0.5">
        <div className="flex justify-between gap-4">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full flex-1" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-10" />
        </div>
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-1/3 mt-1" />
      </div>
    </div>
  )
}