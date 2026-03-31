import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFishingRecommendation } from '../hooks/useFishingRecommendation'
import { useAuth } from '../context/AuthContext'
import { useMode, type FishingMode } from '../context/ModeContext'
import LocationSearch from '../components/LocationSearch'
import LocationMap from '../components/LocationMap'
import ConditionsBar from '../components/ConditionsBar'
import RecommendationCard from '../components/RecommendationCard'

// ── Account dropdown ──────────────────────────────────────────────────────────

function AccountMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  if (!user) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="text-sm font-semibold text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
      >
        Sign in
      </button>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold hover:bg-teal-700 transition-colors"
        aria-label="Account menu"
        aria-expanded={open}
      >
        {user.email?.[0]?.toUpperCase() ?? '?'}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-50">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
            <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
          </div>
          <button
            onClick={async () => { setOpen(false); await signOut() }}
            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

// ── Mode toggle ───────────────────────────────────────────────────────────────

function ModeToggle() {
  const { mode, setMode } = useMode()
  const isSaltwater = mode === 'saltwater'

  const activeClass = isSaltwater
    ? 'bg-teal-600/20 text-teal-600 ring-1 ring-teal-600/50 shadow-[0_0_12px_rgba(14,165,233,0.25)]'
    : 'bg-white text-teal-600 shadow-sm'
  const inactiveClass = 'text-gray-400 hover:text-gray-600'

  return (
    <div className="flex items-center bg-gray-100 rounded-xl p-0.5 text-xs font-semibold select-none">
      <button
        onClick={() => setMode('freshwater')}
        className={`px-3 py-1.5 rounded-[10px] ${!isSaltwater ? activeClass : inactiveClass}`}
      >
        Freshwater
      </button>
      <button
        onClick={() => setMode('saltwater')}
        className={`px-3 py-1.5 rounded-[10px] ${isSaltwater ? activeClass : inactiveClass}`}
      >
        Saltwater
      </button>
    </div>
  )
}

// ── Saltwater target species ───────────────────────────────────────────────────

const SALT_SPECIES = [
  'Any species', 'Mahi-Mahi', 'Wahoo', 'Kingfish',
  'Sailfish', 'Grouper', 'Snapper', 'Cobia', 'Amberjack',
]

// ── Mode-specific copy ────────────────────────────────────────────────────────

const COPY: Record<FishingMode, { subtitle: string }> = {
  freshwater: { subtitle: 'Real-time conditions. One clear recommendation.' },
  saltwater:  { subtitle: 'Offshore conditions. Know before you go.' },
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const { mode } = useMode()
  const isSaltwater = mode === 'saltwater'

  const {
    weather, marine, recommendation, loading, error,
    fetchRecommendation, fetchRecommendationByCoords, fetchSaltwaterRecommendation, reset,
  } = useFishingRecommendation()

  const [submittedLocation, setSubmittedLocation] = useState('')

  // Freshwater: collapsible map below the text input
  const [mapOpen, setMapOpen] = useState(false)

  // Saltwater: pin dropped on the map
  const [saltPin, setSaltPin] = useState<{ lat: number; lon: number; name: string } | null>(null)
  const [targetSpecies, setTargetSpecies] = useState('Any species')

  // Clear stale results and UI state when the user switches modes
  useEffect(() => {
    reset()
    setSubmittedLocation('')
    setSaltPin(null)
    setMapOpen(false)
    setTargetSpecies('Any species')
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleTextSearch(location: string) {
    setSubmittedLocation(location)
    fetchRecommendation(location)
  }

  // Freshwater map: auto-fetch as soon as a pin is confirmed
  function handleFreshwaterMapSelect(lat: number, lon: number, name: string) {
    setSubmittedLocation(name)
    fetchRecommendationByCoords(lat, lon, name)
  }

  // Saltwater map: just store the pin; fetch triggered by explicit button press
  function handleSaltwaterPinDrop(lat: number, lon: number, name: string) {
    setSaltPin({ lat, lon, name })
    setSubmittedLocation(name)
  }

  function handleSaltwaterFetch() {
    if (!saltPin) return
    fetchSaltwaterRecommendation(saltPin.lat, saltPin.lon, saltPin.name, targetSpecies)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="pt-6 pb-4">

      {/* Page header */}
      <div className="px-4 mb-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">GBL Fishing</h1>
            <p className="text-sm text-gray-500 mt-1">{COPY[mode].subtitle}</p>
          </div>
          <AccountMenu />
        </div>
        <ModeToggle />
      </div>

      {/* ── Input section ───────────────────────────────────────────────────── */}
      {isSaltwater ? (
        /*
         * SALTWATER: map is the primary input. The "Get Recommendation" button
         * is explicit (not auto-triggered) so the user can adjust species first.
         */
        <div className="px-4 space-y-3">
          <LocationMap
            mode="saltwater"
            onLocationSelect={handleSaltwaterPinDrop}
          />

          {/* Target species dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              What are you targeting?
            </label>
            <select
              value={targetSpecies}
              onChange={e => setTargetSpecies(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent appearance-none"
            >
              {SALT_SPECIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Get Recommendation button */}
          <button
            onClick={handleSaltwaterFetch}
            disabled={!saltPin || loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm transition-colors"
          >
            {loading ? 'Getting conditions…' : 'Get Recommendation'}
          </button>
        </div>
      ) : (
        /*
         * FRESHWATER: text input is primary. Map is a secondary option behind
         * a toggle. Clicking a map pin auto-triggers the recommendation fetch
         * (same UX as selecting a suggestion from the autocomplete list).
         */
        <div className="px-4 space-y-3">
          <LocationSearch onSearch={handleTextSearch} loading={loading} />

          {/* Collapsible map toggle */}
          <button
            onClick={() => setMapOpen(o => !o)}
            className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M8.157 2.176a1.5 1.5 0 00-1.147 0l-4.084 1.69A1.5 1.5 0 002 5.25v10.877a.75.75 0 001.067.672l3.766-1.561 4.175 1.809a1.5 1.5 0 001.147 0l4.084-1.69A1.5 1.5 0 0018 13.75V2.873a.75.75 0 00-1.067-.672l-3.766 1.561-4.175-1.809a1.5 1.5 0 00-.835-.107zM7.25 4.905v9.674l-3.5 1.45V6.355l3.5-1.45zM8.75 14.58V4.905l4.5 1.95v9.674l-4.5-1.95zM14.75 15.645V5.97l3.5-1.45v9.674l-3.5 1.45z" clipRule="evenodd" />
            </svg>
            {mapOpen ? 'Hide map' : 'Or pick on map'}
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
              className={`w-3.5 h-3.5 transition-transform ${mapOpen ? 'rotate-180' : ''}`}
            >
              <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          {mapOpen && (
            <LocationMap
              mode="freshwater"
              onLocationSelect={handleFreshwaterMapSelect}
            />
          )}
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────────────── */}
      {error && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* ── Loading skeleton ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="mt-4 animate-pulse">
          <div className="flex gap-3 overflow-x-hidden px-4 pb-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[72px] h-[90px] bg-gray-100 rounded-xl" />
            ))}
          </div>
          <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-16 bg-gray-100 rounded" />
          </div>
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {!loading && weather && <ConditionsBar conditions={weather} marine={marine} />}
      {!loading && recommendation && (
        <RecommendationCard recommendation={recommendation} location={submittedLocation} />
      )}

      {/* ── Empty state ─────────────────────────────────────────────────────── */}
      {!loading && !recommendation && !error && (
        <div className="px-4 mt-10 flex flex-col items-center text-center">
          {isSaltwater ? (
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"
              className="w-14 h-14 mb-4 text-teal-600 opacity-70" aria-hidden="true"
            >
              <circle cx="24" cy="12" r="5" stroke="currentColor" strokeWidth="2.5" />
              <line x1="24" y1="17" x2="24" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M10 24 C10 34 38 34 38 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <line x1="10" y1="24" x2="10" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="38" y1="24" x2="38" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="16" y1="12" x2="32" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <span className="text-5xl mb-4">🎣</span>
          )}
          <p className="text-gray-500 text-sm max-w-xs">
            {isSaltwater
              ? 'Enter your launch point to get offshore conditions and recommendations.'
              : 'Enter a lake or city above to get a real-time fishing recommendation based on current weather and moon phase.'}
          </p>
        </div>
      )}

    </div>
  )
}
