import { Link } from 'react-router-dom'
import type { Recommendation, FishingRating } from '../types'
import { knotNameToSlug } from '../lib/knots'

interface Props {
  recommendation: Recommendation
  location: string
}

const ratingConfig: Record<FishingRating, { label: string; bg: string; text: string; dot: string }> = {
  excellent: { label: 'Excellent',  bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  good:      { label: 'Good',       bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  fair:      { label: 'Fair',       bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
  slow:      { label: 'Slow',       bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },
}

interface DetailRowProps {
  icon: string
  label: string
  value: string
  linkTo?: string
  linkState?: Record<string, unknown>
}

function DetailRow({ icon, label, value, linkTo, linkState }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="text-lg mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        {linkTo ? (
          <Link
            to={linkTo}
            state={linkState}
            className="text-sm font-medium text-teal-600 mt-0.5 inline-flex items-center gap-1 hover:text-teal-700"
          >
            {value}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 flex-shrink-0">
              <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </Link>
        ) : (
          <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
        )}
      </div>
    </div>
  )
}

export default function RecommendationCard({ recommendation, location }: Props) {
  const rating = ratingConfig[recommendation.rating] ?? ratingConfig.fair
  const knotSlug = knotNameToSlug(recommendation.bestKnot)

  return (
    <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-50">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Recommendation for</p>
            <h2 className="text-base font-semibold text-gray-900 mt-0.5">{location}</h2>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${rating.bg} ${rating.text} flex-shrink-0`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${rating.dot}`} />
            {rating.label}
          </span>
        </div>
      </div>

      {/* Detail rows */}
      <div className="px-4">
        <DetailRow icon="🐟" label="Target Fish" value={recommendation.targetFish} />
        <DetailRow icon="🪱" label="Best Bait"   value={recommendation.bestBait} />
        <DetailRow
          icon="🪢"
          label="Best Knot"
          value={recommendation.bestKnot}
          linkTo={`/knots/${knotSlug}`}
          linkState={{ reason: recommendation.bestKnot }}
        />
        <DetailRow icon="⏰" label="Best Time"   value={recommendation.timingWindow} />
      </div>

      {/* Reasoning */}
      <div className="px-4 pb-4 pt-1">
        <p className="text-sm text-gray-500 leading-relaxed">{recommendation.reasoning}</p>
      </div>
    </div>
  )
}
