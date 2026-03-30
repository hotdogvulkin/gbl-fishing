import { useState } from 'react'
import { useFishingRecommendation } from '../hooks/useFishingRecommendation'
import LocationSearch from '../components/LocationSearch'
import ConditionsBar from '../components/ConditionsBar'
import RecommendationCard from '../components/RecommendationCard'

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
      <div className="px-4 mb-5">
        <h1 className="text-2xl font-bold text-gray-900">GBL Fishing</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time conditions. One clear recommendation.</p>
      </div>

      {/* Location search with autocomplete */}
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
      {!loading && weather && (
        <ConditionsBar conditions={weather} />
      )}
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
