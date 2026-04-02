import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFishingRecommendation } from '../hooks/useFishingRecommendation'
import { useAuth } from '../context/AuthContext'
import { useMode } from '../context/ModeContext'
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

  // ── Guest state — person icon with sign-in/sign-up dropdown ──────────────
  if (!user) {
    return (
      <div ref={containerRef} className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          aria-label="Account menu"
          aria-expanded={open}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 top-11 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
            <button
              onClick={() => { setOpen(false); navigate('/login') }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => { setOpen(false); navigate('/signup') }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-teal-600 hover:bg-teal-50 transition-colors"
            >
              Create account
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Authenticated state ────────────────────────────────────────────────────
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
        <div className="absolute right-0 top-11 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
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

  return (
    <div className="flex border-b border-gray-200 -mx-4 px-4">
      <button
        onClick={() => setMode('freshwater')}
        className={`pb-2.5 mr-6 text-[11px] font-medium uppercase tracking-[0.08em] border-b-2 -mb-px transition-colors ${
          !isSaltwater ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-400'
        }`}
      >
        Freshwater
      </button>
      <button
        onClick={() => setMode('saltwater')}
        className={`pb-2.5 text-[11px] font-medium uppercase tracking-[0.08em] border-b-2 -mb-px transition-colors ${
          isSaltwater ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-400'
        }`}
      >
        Saltwater
      </button>
    </div>
  )
}

// ── Species lists ─────────────────────────────────────────────────────────────

const SALT_SPECIES = [
  'Any species', 'Mahi-Mahi', 'Wahoo', 'Kingfish',
  'Sailfish', 'Grouper', 'Snapper', 'Cobia', 'Amberjack',
]

const FRESH_SPECIES = [
  'Any', 'Largemouth Bass', 'Bluegill', 'Black Crappie',
  'Channel Catfish', 'Chain Pickerel', 'Florida Gar',
  'Redear Sunfish', 'Warmouth', 'Bowfin',
]

type TargetMode = 'species' | 'goal'

const GOAL_PLACEHOLDERS = [
  'e.g. I want my kid to catch a lot of fish',
  'e.g. looking for a trophy bass',
  'e.g. want to catch dinner',
  'e.g. easy fish for a beginner',
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const { mode } = useMode()
  const isSaltwater = mode === 'saltwater'

  const {
    weather, marine, recommendation, loading, error,
    fetchRecommendation, fetchRecommendationByCoords, fetchSaltwaterRecommendation, reset,
  } = useFishingRecommendation()

  const [submittedLocation, setSubmittedLocation] = useState('')

  // Freshwater: collapsible map + targeting
  const [mapOpen, setMapOpen] = useState(false)
  const [targetMode, setTargetMode] = useState<TargetMode>('species')
  const [freshSpecies, setFreshSpecies] = useState('Any')
  const [goalText, setGoalText] = useState('')

  // Saltwater: pin dropped on the map
  const [saltPin, setSaltPin] = useState<{ lat: number; lon: number; name: string } | null>(null)
  const [saltSpecies, setSaltSpecies] = useState('Any species')

  useEffect(() => {
    reset()
    setSubmittedLocation('')
    setSaltPin(null)
    setMapOpen(false)
    setFreshSpecies('Any')
    setGoalText('')
    setTargetMode('species')
    setSaltSpecies('Any species')
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  function getFreshTargeting() {
    if (targetMode === 'goal' && goalText.trim()) {
      return { species: freshSpecies !== 'Any' ? freshSpecies : undefined, goal: goalText.trim() }
    }
    if (targetMode === 'species' && freshSpecies !== 'Any') {
      return { species: freshSpecies, goal: undefined }
    }
    return { species: undefined, goal: undefined }
  }

  function handleTextSearch(location: string) {
    setSubmittedLocation(location)
    const { species, goal } = getFreshTargeting()
    fetchRecommendation(location, species, goal)
  }

  function handleFreshwaterMapSelect(lat: number, lon: number, name: string) {
    setSubmittedLocation(name)
    const { species, goal } = getFreshTargeting()
    fetchRecommendationByCoords(lat, lon, name, species, goal)
  }

  function handleSaltwaterPinDrop(lat: number, lon: number, name: string) {
    setSaltPin({ lat, lon, name })
    setSubmittedLocation(name)
  }

  function handleSaltwaterFetch() {
    if (!saltPin) return
    fetchSaltwaterRecommendation(saltPin.lat, saltPin.lon, saltPin.name, saltSpecies)
  }

  return (
    <div className="pt-6 pb-4">

      {/* Page header */}
      <div className="px-4 border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-gray-900">GBL Fishing</h1>
          <AccountMenu />
        </div>
        <ModeToggle />
      </div>

      {/* ── Input section ───────────────────────────────────────────────────── */}
      {isSaltwater ? (
        <div className="px-4 space-y-3 mt-4">
          <LocationMap
            mode="saltwater"
            onLocationSelect={handleSaltwaterPinDrop}
          />

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-gray-400 mb-1.5">
              Target species
            </label>
            <select
              value={saltSpecies}
              onChange={e => setSaltSpecies(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent appearance-none"
            >
              {SALT_SPECIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <button
            onClick={handleSaltwaterFetch}
            disabled={!saltPin || loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] font-medium uppercase tracking-[0.08em] rounded-md transition-colors"
          >
            {loading ? 'Getting conditions…' : 'Get Recommendation'}
          </button>
        </div>
      ) : (
        <div className="px-4 space-y-3 mt-4">
          <LocationSearch
            onSearch={handleTextSearch}
            loading={loading}
            onMapToggle={() => setMapOpen(o => !o)}
            targetContent={
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-gray-400">
                  What are you targeting?
                </p>
                {/* Toggle tabs */}
                <div className="flex border border-gray-200 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setTargetMode('species')}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${
                      targetMode === 'species'
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Pick a species
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetMode('goal')}
                    className={`flex-1 py-2 text-xs font-medium border-l border-gray-200 transition-colors ${
                      targetMode === 'goal'
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Describe your goal
                  </button>
                </div>
                {/* Input */}
                {targetMode === 'species' ? (
                  <select
                    value={freshSpecies}
                    onChange={e => setFreshSpecies(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent appearance-none"
                  >
                    {FRESH_SPECIES.map(s => <option key={s}>{s}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={goalText}
                    onChange={e => setGoalText(e.target.value)}
                    placeholder={GOAL_PLACEHOLDERS[0]}
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                )}
              </div>
            }
          />

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
        <div className="mx-4 mt-4 bg-red-50 border border-red-100 rounded-md px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* ── Loading skeleton ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="mt-4 animate-pulse">
          <div className="border-t border-b border-gray-100 py-3 flex gap-6 overflow-x-hidden px-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5">
                <div className="w-4 h-4 bg-gray-100 rounded" />
                <div className="w-12 h-4 bg-gray-100 rounded" />
                <div className="w-10 h-3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
          <div className="mx-4 mt-4 bg-white border-l-[3px] border-gray-200 p-4 space-y-3">
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
              className="w-12 h-12 mb-4 text-gray-300" aria-hidden="true"
            >
              <circle cx="24" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="24" y1="17" x2="24" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 24 C10 34 38 34 38 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <line x1="10" y1="24" x2="10" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="38" y1="24" x2="38" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"
              className="w-12 h-12 mb-4 text-gray-300" aria-hidden="true"
            >
              <line x1="8" y1="12" x2="40" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M40 26 Q44 32 40 38 Q36 42 32 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <ellipse cx="28" cy="40" rx="5" ry="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          )}
          <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
            {isSaltwater
              ? 'Enter your launch point to get offshore conditions and recommendations.'
              : 'Enter a lake or city above to get a real-time fishing recommendation based on current weather and moon phase.'}
          </p>
        </div>
      )}

    </div>
  )
}
