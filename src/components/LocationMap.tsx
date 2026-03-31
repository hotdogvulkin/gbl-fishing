import { useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import type { FishingMode } from '../context/ModeContext'

// ── Fix Leaflet's default marker icon (broken by Vite's asset pipeline) ────────
// Leaflet resolves icon URLs at runtime using internal _getIconUrl logic that
// doesn't understand hashed asset paths. Deleting that method and supplying
// absolute CDN URLs is the standard workaround.
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Saltwater pin: glowing cyan circle matching the bioluminescence palette.
// DivIcon lets us use arbitrary HTML/CSS instead of an image file.
const SALT_MARKER = L.divIcon({
  html: `<div style="
    width:14px;height:14px;border-radius:50%;
    background:#00ffcc;
    box-shadow:0 0 8px #00ffcc,0 0 18px rgba(0,255,204,0.45);
    border:2.5px solid rgba(255,255,255,0.9);
    box-sizing:border-box;
  "></div>`,
  className: '',   // clear Leaflet's default white box around the icon
  iconSize:   [14, 14],
  iconAnchor: [7,  7],
})

const TILE_URLS: Record<FishingMode, string> = {
  freshwater: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  saltwater:  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
}

const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
  'contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

// ── Reverse geocode using Nominatim ───────────────────────────────────────────
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'en' } },
    )
    const data = await res.json()
    const a = (data.address ?? {}) as Record<string, string>
    const place = a.city ?? a.town ?? a.village ?? a.hamlet ?? a.county ?? ''
    const state  = a.state ?? ''
    const cc     = (a.country_code ?? '').toUpperCase()
    if (place && state && cc === 'US') return `${place}, ${state}`
    if (place && cc)                   return `${place}, ${cc}`
    const parts = ((data.display_name as string | undefined) ?? '').split(',')
    return parts.slice(0, 2).join(',').trim() || `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`
  } catch {
    return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`
  }
}

// ── Map click handler (must be inside MapContainer to use useMapEvents) ────────
function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: e => onMapClick(e.latlng.lat, e.latlng.lng) })
  return null
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface PinState {
  lat: number
  lng: number
  name: string       // reverse-geocoded display name
  resolving: boolean // true while geocode request is in flight
}

export interface Props {
  mode: FishingMode
  /** Called once reverse geocoding completes (or immediately with coords on failure) */
  onLocationSelect: (lat: number, lon: number, locationName: string) => void
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function LocationMap({ mode, onLocationSelect }: Props) {
  const [pin, setPin] = useState<PinState | null>(null)

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    // Show pin immediately at the tapped position while geocoding runs
    const fallback = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`
    setPin({ lat, lng, name: fallback, resolving: true })

    const name = await reverseGeocode(lat, lng)
    setPin({ lat, lng, name, resolving: false })
    onLocationSelect(lat, lng, name)
  }, [onLocationSelect])

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      {/*
        The wrapper div provides responsive height; MapContainer fills it at 100%.
        Leaflet requires an explicit pixel height — percentage height on MapContainer
        itself doesn't work reliably, but 100% inside a sized parent does.
      */}
      <div className="h-[280px] sm:h-[320px]">
        <MapContainer
          center={[27.9944024, -81.7602544]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl
        >
          {/*
            key={mode} forces TileLayer to unmount/remount when mode changes,
            guaranteeing fresh tiles rather than a URL-only prop update which
            can leave stale cached tiles visible briefly.
          */}
          <TileLayer
            key={mode}
            url={TILE_URLS[mode]}
            attribution={ATTRIBUTION}
          />

          <ClickHandler onMapClick={handleMapClick} />

          {pin && (
            <Marker
              position={[pin.lat, pin.lng]}
              icon={mode === 'saltwater' ? SALT_MARKER : new L.Icon.Default()}
            />
          )}
        </MapContainer>
      </div>

      {/* Location readout below the map */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 min-h-[48px] flex items-center gap-2">
        {pin ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              className="w-4 h-4 text-teal-600 flex-shrink-0">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.307 17 12.5 17 8A7 7 0 103 8c0 3.5 1.698 5.307 3.354 6.584A17.45 17.45 0 009.69 18.933zM10 11a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className={`text-sm font-medium text-gray-800 ${pin.resolving ? 'animate-pulse' : ''}`}>
              {pin.name}
            </span>
            {pin.resolving && (
              <span className="text-xs text-gray-400 ml-1">locating…</span>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400">
            {mode === 'saltwater'
              ? 'Tap the map to drop your launch point'
              : 'Tap anywhere on the map to set location'}
          </p>
        )}
      </div>
    </div>
  )
}
