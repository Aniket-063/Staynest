import { Link } from 'react-router-dom'

const FOOTER_LINKS = {
  Explore: [
    { label: 'Beach Stays', to: '/?category=beach' },
    { label: 'Mountain Retreats', to: '/?category=mountain' },
    { label: 'City Apartments', to: '/?category=city' },
    { label: 'Luxury Villas', to: '/?category=luxury' },
  ],
  Company: [
    { label: 'About Us', to: '#' },
    { label: 'Careers', to: '#' },
    { label: 'Press', to: '#' },
    { label: 'Blog', to: '#' },
  ],
  Support: [
    { label: 'Help Center', to: '#' },
    { label: 'Safety Info', to: '#' },
    { label: 'Cancellation Policy', to: '#' },
    { label: 'Contact Us', to: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🏡</span>
              </div>
              <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
                StayNest
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              Discover unique places to stay around the world. From cozy apartments to luxury villas.
            </p>
          </div>
          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{section}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400 dark:text-slate-500">
            © {new Date().getFullYear()} StayNest, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-slate-500">
            <a href="#" className="hover:text-brand-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}