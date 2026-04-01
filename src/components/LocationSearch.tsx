import { useState, useEffect, useRef, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
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
  onMapToggle?: () => void
  targetContent?: ReactNode
}

export default function LocationSearch({ onSearch, loading, onMapToggle, targetContent }: Props) {
  const { mode } = useMode()
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
        setSuggestions([])
        setOpen(false)
      }
    }, 300)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value])

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

  const placeholder = mode === 'saltwater'
    ? 'Drop a pin or enter your launch point'
    : 'Search location'

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Input row */}
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
            placeholder={placeholder}
            autoComplete="off"
            className={`w-full bg-white border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent ${onMapToggle ? 'pr-12' : ''}`}
          />
          {onMapToggle && (
            <button
              type="button"
              onClick={onMapToggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
              aria-label="Toggle map"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M8.157 2.176a1.5 1.5 0 00-1.147 0l-4.084 1.69A1.5 1.5 0 002 5.25v10.877a.75.75 0 001.067.672l3.766-1.561 4.175 1.809a1.5 1.5 0 001.147 0l4.084-1.69A1.5 1.5 0 0018 13.75V2.873a.75.75 0 00-1.067-.672l-3.766 1.561-4.175-1.809a1.5 1.5 0 00-.835-.107zM7.25 4.905v9.674l-3.5 1.45V6.355l3.5-1.45zM8.75 14.58V4.905l4.5 1.95v9.674l-4.5-1.95zM14.75 15.645V5.97l3.5-1.45v9.674l-3.5 1.45z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Optional targeting content between input and CTA */}
        {targetContent}

        {/* CTA button */}
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-medium uppercase tracking-[0.08em] px-5 py-3 rounded-md transition-colors"
        >
          {loading ? 'Loading…' : 'Get Recommendation'}
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden">
          {suggestions.map(item => (
            <li key={item.place_id}>
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
