import { useState, useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react'
import { useMode } from '../context/ModeContext'

interface NominatimResult {
  place_id: number
  display_name: string
  name: string
  address: {
    city?: string
    town?: string
    village?: string
    hamlet?: string
    lake?: string
    water?: string
    state?: string
    province?: string
    region?: string
    country?: string
    country_code?: string
  }
}

// Build a readable "City, State" or "City, Country" label from address parts
function formatLabel(item: NominatimResult): string {
  const a = item.address
  const place =
    a.city ?? a.town ?? a.village ?? a.hamlet ?? a.lake ?? a.water ?? item.name
  const region = a.state ?? a.province ?? a.region
  const country = a.country_code?.toUpperCase()

  if (!place) return item.display_name
  if (region && country === 'US') return `${place}, ${region}`
  if (region && country) return `${place}, ${region}, ${country}`
  if (country) return `${place}, ${country}`
  return place
}

interface Props {
  onSearch: (location: string) => void
  loading: boolean
}

const PLACEHOLDER = {
  freshwater: 'e.g. Lake Butler, FL',
  saltwater:  'Drop a pin or enter your launch point',
}

export default function LocationSearch({ onSearch, loading }: Props) {
  const { mode } = useMode()
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced autocomplete fetch — fires 300ms after the user stops typing
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (value.trim().length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }

    timerRef.current = setTimeout(async () => {
      try {
        const url =
          `https://nominatim.openstreetmap.org/search` +
          `?q=${encodeURIComponent(value)}&format=json&limit=5&addressdetails=1`
        const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
        const data: NominatimResult[] = await res.json()
        setSuggestions(data)
        setOpen(data.length > 0)
      } catch {
        // Silently fail — autocomplete is a convenience, not required
        setSuggestions([])
        setOpen(false)
      }
    }, 300)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value])

  // Close on click outside
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  function selectSuggestion(item: NominatimResult) {
    const label = formatLabel(item)
    setValue(label)
    setSuggestions([])
    setOpen(false)
    onSearch(label)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!value.trim() || loading) return
    setOpen(false)
    onSearch(value.trim())
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
            placeholder={PLACEHOLDER[mode]}
            autoComplete="off"
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-sm transition-colors whitespace-nowrap"
          >
            {loading ? 'Loading…' : 'Get Recommendation'}
          </button>
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {suggestions.map(item => (
            <li key={item.place_id}>
              {/* onMouseDown + preventDefault keeps focus on input so the click
                  registers before the blur-triggered close handler fires */}
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); selectSuggestion(item) }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors border-b border-gray-50 last:border-0"
              >
                {formatLabel(item)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
