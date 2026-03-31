import { useState, useEffect } from 'react'
import { SPECIES, searchSpecies, type Species } from '../lib/species'

// Fetches the first matching species photo from iNaturalist (no API key required)
async function fetchPhoto(query: string): Promise<string | null> {
  try {
    const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(query)}&rank=species&per_page=1`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json() as {
      results?: Array<{ default_photo?: { medium_url?: string } }>
    }
    return data.results?.[0]?.default_photo?.medium_url ?? null
  } catch {
    return null
  }
}

function PhotoThumbnail({ query }: { query: string }) {
  const [src, setSrc] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchPhoto(query).then(url => {
      if (!cancelled) {
        setSrc(url)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [query])

  if (loading) {
    return <div className="w-20 h-20 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
  }

  if (!src || failed) {
    return (
      <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center">
        <span className="text-2xl">🐟</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100"
    />
  )
}

function SpeciesCard({ species }: { species: Species }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Collapsed row */}
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left p-4"
        aria-expanded={expanded}
      >
        <div className="flex gap-3 items-start">
          <PhotoThumbnail query={species.iNaturalistQuery} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-gray-900 leading-snug">{species.commonName}</h2>
                <p className="text-xs italic text-gray-400 mt-0.5">{species.scientificName}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{species.description}</p>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-5 space-y-4">
          {/* Full description */}
          <div className="pt-4">
            <p className="text-sm text-gray-600 leading-relaxed">{species.description}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Average Size</p>
              <p className="text-sm text-gray-700 leading-snug">{species.averageSize}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">FL Record</p>
              <p className="text-sm text-gray-700 leading-snug">{species.floridaRecord}</p>
            </div>
          </div>

          {/* Habitat */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Habitat</p>
            <p className="text-sm text-gray-600 leading-relaxed">{species.habitat}</p>
          </div>

          {/* Catching tips */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2.5">Catching Tips</p>
            <ul className="space-y-2.5">
              {species.tips.map((tip, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-50 text-teal-600 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Photo credit */}
          <p className="text-[10px] text-gray-300">Photos via iNaturalist · CC-BY-NC</p>
        </div>
      )}
    </div>
  )
}

export default function SpeciesPage() {
  const [query, setQuery] = useState('')
  const results = searchSpecies(query)

  return (
    <div className="pt-6 pb-4">
      <div className="px-4 mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Species</h1>
        <p className="text-sm text-gray-500 mt-1">Florida freshwater fish guide</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search species…"
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {results.length > 0 ? (
        <div className="px-4 space-y-3">
          {results.map(s => (
            <SpeciesCard key={s.id} species={s} />
          ))}
        </div>
      ) : (
        <div className="px-4 mt-12 flex flex-col items-center text-center">
          <span className="text-4xl mb-3">🔍</span>
          <p className="text-sm text-gray-500">No species matching "{query}"</p>
          <button onClick={() => setQuery('')} className="mt-3 text-sm font-medium text-teal-600">
            Clear search
          </button>
        </div>
      )}

      {!query && (
        <p className="mt-4 px-4 text-xs text-gray-400 text-center">
          {SPECIES.length} species · tap any card for full details
        </p>
      )}
    </div>
  )
}
