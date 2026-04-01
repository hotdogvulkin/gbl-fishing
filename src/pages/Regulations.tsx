import { useState } from 'react'
import { REGULATIONS, searchRegulations, SALTWATER_REGULATIONS, searchSaltwaterRegulations } from '../lib/regulations'
import type { Regulation, SaltwaterRegulation } from '../lib/regulations'
import { useMode } from '../context/ModeContext'

function SizeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.45 3h11.301a1 1 0 01.98 1.196l-1.8 8A1 1 0 0114.952 13H5.048a1 1 0 01-.98-.804L2.199 3.236A.25.25 0 001.95 3H1.75A.75.75 0 011 2.25v-.5zM5.24 6.5a.75.75 0 00-.748.808l.5 5a.75.75 0 001.493-.15L6 7.558 7.993 8.5a.75.75 0 00.638-1.354l-2.5-1.25a.75.75 0 00-.89.604zm5.5 0a.75.75 0 00-.748.808l.5 5a.75.75 0 001.493-.15L11.5 7.558 13.493 8.5a.75.75 0 00.638-1.354l-2.5-1.25a.75.75 0 00-.89.604z" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0 mt-0.5">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  )
}

// ── Freshwater card ───────────────────────────────────────────────────────────

function RegCard({ reg }: { reg: Regulation }) {
  const [expanded, setExpanded] = useState(false)

  const sizeLabel = reg.minSizeIn != null ? `${reg.minSizeIn}" minimum` : 'No minimum'
  const bagLabel = typeof reg.dailyBag === 'number'
    ? `${reg.dailyBag} per day`
    : reg.dailyBag

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left px-4 py-4"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xl">{reg.emoji}</span>
              <h2 className="text-base font-semibold text-gray-900">{reg.species}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
                <SizeIcon />
                {sizeLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                <BagIcon />
                {bagLabel}
              </span>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {reg.season}
              </span>
            </div>
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
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-2.5">Special Rules &amp; Notes</p>
          <ul className="space-y-2.5">
            {reg.notes.map((note, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                <InfoIcon />
                <span>{note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-400">{reg.source}</p>
        </div>
      )}
    </div>
  )
}

// ── Saltwater card ────────────────────────────────────────────────────────────

const JURISDICTION_STYLES: Record<SaltwaterRegulation['jurisdiction'], { bg: string; text: string }> = {
  'Federal':          { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  'State (FWC)':      { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Federal / State':  { bg: 'bg-purple-50', text: 'text-purple-700' },
}

function SaltwaterRegCard({ reg }: { reg: SaltwaterRegulation }) {
  const [expanded, setExpanded] = useState(false)

  const sizeLabel = reg.minSizeIn != null ? `${reg.minSizeIn}" min` : 'No min size'
  const bagLabel = typeof reg.dailyBag === 'number'
    ? `${reg.dailyBag} per day`
    : reg.dailyBag
  const jStyle = JURISDICTION_STYLES[reg.jurisdiction]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left px-4 py-4"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xl">{reg.emoji}</span>
              <h2 className="text-base font-semibold text-gray-900">{reg.species}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
                <SizeIcon />
                {sizeLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                <BagIcon />
                {bagLabel}
              </span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${jStyle.bg} ${jStyle.text}`}>
                {reg.jurisdiction}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{reg.season}</p>
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
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-2.5">Rules &amp; Notes</p>
          <ul className="space-y-2.5">
            {reg.notes.map((note, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                <InfoIcon />
                <span>{note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-400">{reg.source}</p>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Regulations() {
  const { mode } = useMode()
  const isSaltwater = mode === 'saltwater'
  const [query, setQuery] = useState('')

  const freshResults = searchRegulations(query)
  const saltResults  = searchSaltwaterRegulations(query)

  return (
    <div className="pt-6 pb-4">
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Regulations</h1>
      </div>

      {/* Ruleset indicator */}
      <div className={`mx-4 mb-4 rounded-xl px-4 py-3 flex items-center gap-3 ${
        isSaltwater
          ? 'bg-indigo-50 border border-indigo-100'
          : 'bg-teal-50 border border-teal-100'
      }`}>
        <span className="text-xl flex-shrink-0">{isSaltwater ? '🌊' : '🏞️'}</span>
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${isSaltwater ? 'text-indigo-800' : 'text-teal-800'}`}>
            {isSaltwater ? 'Florida Offshore — NOAA Federal Rules' : 'Florida Freshwater — FWC Rules'}
          </p>
          <p className={`text-xs mt-0.5 ${isSaltwater ? 'text-indigo-600' : 'text-teal-600'}`}>
            {isSaltwater
              ? `${SALTWATER_REGULATIONS.length} species covered · Federal & State jurisdictions`
              : `${REGULATIONS.length} species covered · Statewide rules`}
          </p>
        </div>
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

      {/* Disclaimer banner */}
      <div className="mx-4 mb-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-amber-700 leading-relaxed">
          {isSaltwater
            ? <>Regulations change. Verify at <span className="font-semibold">fisheries.noaa.gov/southeast</span> and <span className="font-semibold">myfwc.com</span> before fishing. Seasons and bag limits are adjusted annually.</>
            : <>Regulations change. Always verify with <span className="font-semibold">myfwc.com</span> before fishing — some water bodies have special rules not shown here.</>
          }
        </p>
      </div>

      {/* Results */}
      {isSaltwater ? (
        saltResults.length > 0 ? (
          <div className="px-4 space-y-3">
            {saltResults.map(reg => (
              <SaltwaterRegCard key={reg.species} reg={reg} />
            ))}
          </div>
        ) : (
          <div className="px-4 mt-12 flex flex-col items-center text-center">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm text-gray-500">No results for "{query}"</p>
            <button onClick={() => setQuery('')} className="mt-3 text-sm font-medium text-teal-600">
              Clear search
            </button>
          </div>
        )
      ) : (
        freshResults.length > 0 ? (
          <div className="px-4 space-y-3">
            {freshResults.map(reg => (
              <RegCard key={reg.species} reg={reg} />
            ))}
          </div>
        ) : (
          <div className="px-4 mt-12 flex flex-col items-center text-center">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm text-gray-500">No results for "{query}"</p>
            <button onClick={() => setQuery('')} className="mt-3 text-sm font-medium text-teal-600">
              Clear search
            </button>
          </div>
        )
      )}

      {/* Total count */}
      {!query && (
        <p className="mt-4 px-4 text-xs text-gray-400 text-center">
          {isSaltwater
            ? `${SALTWATER_REGULATIONS.length} species covered · NOAA federal rules`
            : `${REGULATIONS.length} species covered · Florida FWC statewide rules`}
        </p>
      )}
    </div>
  )
}
