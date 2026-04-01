import { Link } from 'react-router-dom'
import type { Recommendation, SaltwaterRecommendation, FishingRating } from '../types'
import { isSaltwaterRec } from '../types'
import { knotNameToSlug } from '../lib/knots'

interface Props {
  recommendation: Recommendation | SaltwaterRecommendation
  location: string
}

const ratingConfig: Record<FishingRating, { label: string; dot: string }> = {
  excellent: { label: 'Excellent', dot: 'bg-green-500'  },
  good:      { label: 'Good',      dot: 'bg-yellow-400' },
  fair:      { label: 'Fair',      dot: 'bg-orange-400' },
  slow:      { label: 'Slow',      dot: 'bg-red-500'    },
}

interface DetailRowProps {
  label: string
  value: string
  linkTo?: string
  linkState?: Record<string, unknown>
}

function DetailRow({ label, value, linkTo, linkState }: DetailRowProps) {
  return (
    <div className="py-2.5 border-b border-gray-50 last:border-0">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.08em] mb-0.5">{label}</p>
      {linkTo ? (
        <Link
          to={linkTo}
          state={linkState}
          className="text-sm font-medium text-teal-600 inline-flex items-center gap-1 hover:text-teal-700"
        >
          {value}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 flex-shrink-0">
            <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </Link>
      ) : (
        <p className="text-sm font-medium text-gray-800">{value}</p>
      )}
    </div>
  )
}

export default function RecommendationCard({ recommendation, location }: Props) {
  const rating = ratingConfig[recommendation.rating] ?? ratingConfig.fair
  const isSalt = isSaltwaterRec(recommendation)
  const knotName = isSalt ? recommendation.knot : recommendation.bestKnot
  const knotSlug = knotNameToSlug(knotName)

  return (
    <div className="mx-4 mt-4 bg-white border-l-[3px] border-teal-600 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-2.5 border-b border-gray-50">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.08em]">Recommendation for</p>
            <h2 className="text-base font-semibold text-gray-900 mt-0.5">{location}</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 flex-shrink-0">
            <span className={`w-2 h-2 rounded-full ${rating.dot}`} />
            {rating.label}
          </span>
        </div>
      </div>

      {/* Detail rows */}
      <div className="px-4">
        <DetailRow label="Target Fish" value={recommendation.targetFish} />
        {isSalt ? (
          <>
            <DetailRow label="Where to Go"      value={recommendation.recommendedArea} />
            <DetailRow label="Target Depth"     value={recommendation.depth} />
            <DetailRow label="Bait / Lure"      value={recommendation.bait} />
            <DetailRow
              label="Knot"
              value={knotName}
              linkTo={`/knots/${knotSlug}`}
              linkState={{ reason: knotName }}
            />
            <DetailRow label="Best Tide Window" value={recommendation.timing} />
          </>
        ) : (
          <>
            <DetailRow label="Best Bait" value={recommendation.bestBait} />
            <DetailRow
              label="Best Knot"
              value={knotName}
              linkTo={`/knots/${knotSlug}`}
              linkState={{ reason: knotName }}
            />
            <DetailRow label="Best Time" value={recommendation.timingWindow} />
          </>
        )}
      </div>

      {/* Reasoning */}
      <div className="px-4 pb-4 pt-2.5">
        <p className="text-sm text-gray-500 leading-relaxed">{recommendation.reasoning}</p>
      </div>
    </div>
  )
}
