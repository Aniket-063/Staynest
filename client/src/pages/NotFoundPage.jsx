import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-8xl mb-6">🏚️</span>
      <h1 className="font-display text-5xl font-bold text-gray-900 dark:text-white mb-3">404</h1>
      <p className="text-xl text-gray-500 dark:text-slate-400 mb-8">
        Oops! This page has checked out.
      </p>
      <Link to="/" className="btn-primary py-3 px-8 text-base">
        Back to Home
      </Link>
    </div>
  )
}