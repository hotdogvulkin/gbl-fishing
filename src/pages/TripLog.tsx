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
        <div className="px-4 mt-16 flex flex-col items-center text-center">
          <span className="text-5xl mb-4">📒</span>
          <h2 className="text-base font-semibold text-gray-800 mb-1">No trips yet</h2>
          <p className="text-sm text-gray-500 max-w-xs mb-6">
            Head out and log your first trip — track your catches and build your history over time.
          </p>
          <Link
            to="/log/new"
            className="text-sm font-semibold text-white bg-teal-600 px-6 py-3 rounded-xl"
          >
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
