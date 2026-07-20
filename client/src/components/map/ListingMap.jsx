import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './map.css'

// Fix Leaflet's default icon broken paths in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom branded marker icon
function createBrandMarker(price) {
  return L.divIcon({
    className: '',
    html: `
      <div class="staynest-marker">
        <span>$${price}</span>
      </div>
    `,
    iconSize: [60, 32],
    iconAnchor: [30, 32],
    popupAnchor: [0, -36],
  })
}

// Helper: re-center map when coords change
function RecenterMap({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true })
  }, [lat, lng, map])
  return null
}

export default function ListingMap({ lat, lng, title, price, zoom = 13 }) {
  if (!lat || !lng) return null
  return (
    <div className="rounded-2xl overflow-hidden ... h-[300px] sm:h-[380px]">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={lat} lng={lng} />
        <Marker position={[lat, lng]} icon={createBrandMarker(price)}>
          <Popup className="staynest-popup">
            <div className="p-1">
              <p className="font-semibold text-gray-900 text-sm leading-snug">{title}</p>
              <p className="text-brand-500 font-bold text-sm mt-0.5">${price} / night</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}