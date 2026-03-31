import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFishingRecommendation } from '../hooks/useFishingRecommendation'
import { useAuth } from '../context/AuthContext'
import LocationSearch from '../components/LocationSearch'
import ConditionsBar from '../components/ConditionsBar'
import RecommendationCard from '../components/RecommendationCard'

// ── Account dropdown ──────────────────────────────────────────────────────────

function AccountMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click-outside
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
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
            <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
          </div>
          {/* Sign out */}
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [submittedLocation, setSubmittedLocation] = useState('')
  const { weather, recommendation, loading, error, fetchRecommendation } = useFishingRecommendation()

  function handleSearch(location: string) {
    setSubmittedLocation(location)
    fetchRecommendation(location)
  }

  return (
    <div className="pt-6 pb-4">
      {/* Page header */}
      <div className="px-4 mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GBL Fishing</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time conditions. One clear recommendation.</p>
        </div>
        <AccountMenu />
      </div>

      {/* Location search */}
      <div className="px-4">
        <LocationSearch onSearch={handleSearch} loading={loading} />
      </div>

      {/* Error state */}
      {error && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
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

      {/* Results */}
      {!loading && weather && <ConditionsBar conditions={weather} />}
      {!loading && recommendation && (
        <RecommendationCard recommendation={recommendation} location={submittedLocation} />
      )}

      {/* Empty state */}
      {!loading && !recommendation && !error && (
        <div className="px-4 mt-10 flex flex-col items-center text-center">
          <span className="text-5xl mb-4">🎣</span>
          <p className="text-gray-500 text-sm max-w-xs">
            Enter a lake or city above to get a real-time fishing recommendation based on current weather and moon phase.
          </p>
        </div>
      )}
    </div>
  )
}
