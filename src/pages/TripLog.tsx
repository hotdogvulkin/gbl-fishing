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
          className="text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md transition-colors"
        >
          + New Trip
        </Link>
      </div>

      {loading && (
        <div className="px-4 space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-md border border-gray-100 p-4 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="mx-4 bg-red-50 border border-red-100 rounded-md px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && trips.length === 0 && (
        <div className="px-6 mt-10 flex flex-col items-center text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-14 h-14 mb-5 text-gray-300" aria-hidden="true">
            <line x1="8" y1="12" x2="36" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M36 24 Q40 30 36 36 Q33 40 30 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <ellipse cx="27" cy="39" rx="4" ry="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>

          <h2 className="text-lg font-bold text-gray-900 mb-2">Start your log</h2>
          <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed mb-7">
            Track your catches, remember what worked, and watch your history grow trip by trip.
          </p>
          <Link
            to="/log/new"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-teal-600 px-6 py-3 rounded-md active:bg-teal-700"
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
