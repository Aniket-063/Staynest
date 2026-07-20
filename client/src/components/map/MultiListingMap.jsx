import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './map.css'

// Fix Leaflet default icon in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createPriceMarker(price, active = false) {
  return L.divIcon({
    className: '',
    html: `<div class="staynest-marker ${active ? 'staynest-marker--active' : ''}">
             <span>$${price}</span>
           </div>`,
    iconSize: [64, 32],
    iconAnchor: [32, 32],
    popupAnchor: [0, -36],
  })
}

// Fit map bounds to show all markers
function FitBounds({ listings }) {
  const map = useMap()
  const fitted = useRef(false)
  useEffect(() => {
    if (!listings.length || fitted.current) return
    const valid = listings.filter(l => l.location?.lat && l.location?.lng)
    if (!valid.length) return
    
    if (valid.length === 1) {
      map.setView([valid[0].location.lat, valid[0].location.lng], 10)
    } else {
      const bounds = L.latLngBounds(valid.map(l => [l.location.lat, l.location.lng]))
      map.fitBounds(bounds, { padding: [40, 40] })
    }
    fitted.current = true
  }, [listings, map])
  return null
}

export default function MultiListingMap({ listings = [], activeId = null }) {
  const valid = listings.filter(l => l.location?.lat && l.location?.lng)
  const center = valid.length ? [valid[0].location.lat, valid[0].location.lng] : [20, 0]
  
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm h-full min-h-[500px]">
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds listings={valid} />
        {valid.map(listing => (
          <Marker
            key={listing._id}
            position={[listing.location.lat, listing.location.lng]}
            icon={createPriceMarker(listing.price, listing._id === activeId)}
          >
            <Popup className="staynest-popup" minWidth={200}>
              <Link to={`/listing/${listing._id}`} className="block p-1 no-underline group">
                {listing.images?.[0] && (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-28 object-cover rounded-lg mb-2"
                  />
                )}
                <p className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-brand-500 transition-colors">
                  {listing.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {listing.location.city}, {listing.location.country}
                </p>
                <p className="text-brand-500 font-bold text-sm mt-1">
                  ${listing.price} <span className="text-gray-400 font-normal">/ night</span>
                </p>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}