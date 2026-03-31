import { Link } from 'react-router-dom'
import { useTripLog } from '../hooks/useTripLog'
import TripCard from '../components/TripCard'

export default function TripLog() {
  const { trips, loading, error } = useTripLog()

  return (
    <div className="pt-6 pb-4">
      <div className="px-4 mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Trip Log</h1>
        <Link
          to="/log/new"
          className="text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl transition-colors"
        >
          + New Trip
        </Link>
      </div>

      {loading && (
        <div className="px-4 space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="mx-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && trips.length === 0 && (
        <div className="px-6 mt-10 flex flex-col items-center text-center">
          {/* Illustration */}
          <div className="w-32 h-32 rounded-full bg-teal-50 flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" className="w-20 h-20">
              {/* Water ripples */}
              <ellipse cx="40" cy="58" rx="28" ry="6" stroke="#99f6e4" strokeWidth="2" />
              <ellipse cx="40" cy="58" rx="18" ry="4" stroke="#5eead4" strokeWidth="1.5" />
              {/* Fishing rod */}
              <line x1="18" y1="20" x2="56" y2="38" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
              {/* Rod handle */}
              <rect x="12" y="16" width="10" height="6" rx="3" fill="#0d9488" />
              {/* Fishing line */}
              <path d="M56 38 Q62 44 56 52 Q52 58 50 58" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" fill="none" />
              {/* Hook */}
              <path d="M50 58 Q50 64 45 64 Q41 64 41 60" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              {/* Fish */}
              <ellipse cx="34" cy="48" rx="9" ry="5.5" fill="#5eead4" />
              <path d="M25 48 L20 44 L20 52 Z" fill="#5eead4" />
              <circle cx="39" cy="46" r="1.2" fill="#0f172a" />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-2">Start your log</h2>
          <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed mb-7">
            Track your catches, remember what worked, and watch your history grow trip by trip.
          </p>
          <Link
            to="/log/new"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-teal-600 px-6 py-3 rounded-xl shadow-sm active:bg-teal-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v5.5h5.5a.75.75 0 010 1.5h-5.5v5.5a.75.75 0 01-1.5 0v-5.5H3.75a.75.75 0 010-1.5h5.5V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
            </svg>
            Log Your First Trip
          </Link>
        </div>
      )}

      {!loading && !error && trips.length > 0 && (
        <div className="px-4 space-y-3">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}
