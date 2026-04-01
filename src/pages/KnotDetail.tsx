import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { findKnot } from '../lib/knots'
import KnotAnimation from '../components/KnotAnimation'

export default function KnotDetail() {
  const { knotName } = useParams<{ knotName: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  // "Why this knot" context passed from the recommendation card via Link state
  const reason = (location.state as { reason?: string } | null)?.reason

  const knot = findKnot(knotName ?? '')

  return (
    <div className="pt-6 pb-8">
      {/* Back button */}
      <div className="px-4 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>

      {knot ? (
        <div className="px-4 space-y-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{knot.name}</h1>
          </div>

          {/* Why this knot */}
          <div className="bg-teal-50 border border-teal-100 rounded-md p-4">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">Why this knot</p>
            {reason && (
              <p className="text-sm font-medium text-teal-800 mb-2">{reason}</p>
            )}
            <p className="text-sm text-teal-700 leading-relaxed">{knot.tagline}</p>
          </div>

          {/* Animation */}
          <KnotAnimation knotSlug={knotName ?? ''} />

          {/* Steps */}
          <div className="bg-white rounded-md border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">How to tie it</p>
            <ol className="space-y-4">
              {knot.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-md border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Tips &amp; common mistakes</p>
            <ul className="space-y-3">
              {knot.tips.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 text-teal-500 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* Fallback for unknown knots */
        <div className="px-4 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {knotName?.replace(/-/g, ' ')}
          </h1>

          {reason && (
            <div className="bg-teal-50 border border-teal-100 rounded-md p-4">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">Why this knot</p>
              <p className="text-sm text-teal-700 leading-relaxed">{reason}</p>
            </div>
          )}

          <div className="bg-white rounded-md border border-gray-100 p-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              Detailed step-by-step instructions for this knot are coming soon. In the meantime, a quick search for <span className="font-medium text-gray-700">"{knotName?.replace(/-/g, ' ')}"</span> will turn up plenty of good video tutorials.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
