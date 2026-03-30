import type { Trip } from '../types'

interface Props {
  trip: Trip
}

function formatDate(dateStr: string): string {
  // Append T00:00:00 to parse as local time, not UTC (avoids off-by-one-day issues)
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function TripCard({ trip }: Props) {
  const catchCount = trip.catches.length
  const notesPreview = trip.notes && trip.notes.length > 80
    ? trip.notes.slice(0, 80) + '…'
    : trip.notes

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-900 truncate">{trip.lake}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(trip.date)}</p>
        </div>
        <span className="flex-shrink-0 text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
          {catchCount === 0
            ? 'No catches'
            : catchCount === 1
            ? '1 catch'
            : `${catchCount} catches`}
        </span>
      </div>

      {catchCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {trip.catches.map(c => (
            <span
              key={c.id}
              className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-full"
            >
              {c.species}
            </span>
          ))}
        </div>
      )}

      {notesPreview && (
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">{notesPreview}</p>
      )}
    </div>
  )
}
