import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line,
} from 'recharts'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMode } from '../context/ModeContext'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawCatch {
  species: string
  bait: string
  weight: string | null
  length: string | null
}

interface RawTrip {
  id: string
  date: string
  lake: string
  catches: RawCatch[]
}

interface CatchWithContext extends RawCatch {
  tripDate: string
  tripLake: string
}

interface PersonalBest {
  value: string
  species: string
  lake: string
  date: string
}

interface TripBest {
  count: number
  lake: string
  date: string
}

interface ComputedStats {
  totalTrips: number
  totalCatches: number
  topSpecies: string
  biggestCatch: { value: string; species: string } | null
  speciesChart: { name: string; catches: number }[]
  monthlyChart: { month: string; catches: number }[]
  baitChart: { name: string; catches: number }[]
  bests: {
    heaviest: PersonalBest | null
    longest: PersonalBest | null
    mostFish: TripBest | null
    mostSpecies: TripBest | null
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function trunc(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

// Extract the leading number from a free-form string like "3.2 lbs" or "17 in"
function parseNum(s: string | null | undefined): number {
  if (!s) return 0
  const m = s.match(/(\d+\.?\d*)/)
  return m ? parseFloat(m[1]) : 0
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function computeStats(trips: RawTrip[]): ComputedStats {
  const catches: CatchWithContext[] = trips.flatMap(t =>
    t.catches.map(c => ({ ...c, tripDate: t.date, tripLake: t.lake }))
  )

  // ── Summary ──────────────────────────────────────────────────────────────
  const totalTrips = trips.length
  const totalCatches = catches.length

  // ── Species frequency ────────────────────────────────────────────────────
  const speciesMap = new Map<string, number>()
  for (const c of catches) speciesMap.set(c.species, (speciesMap.get(c.species) ?? 0) + 1)
  const sortedSpecies = [...speciesMap.entries()].sort((a, b) => b[1] - a[1])
  const topSpecies = sortedSpecies[0]?.[0] ?? '—'
  const speciesChart = sortedSpecies
    .slice(0, 8)
    .map(([s, n]) => ({ name: trunc(s, 12), catches: n }))

  // ── Biggest catch ────────────────────────────────────────────────────────
  let heaviestCatch: CatchWithContext | null = null
  let heaviestVal = 0
  let longestCatch: CatchWithContext | null = null
  let longestVal = 0
  for (const c of catches) {
    const w = parseNum(c.weight)
    if (w > heaviestVal) { heaviestVal = w; heaviestCatch = c }
    const l = parseNum(c.length)
    if (l > longestVal) { longestVal = l; longestCatch = c }
  }
  const biggestCatch = heaviestCatch
    ? { value: heaviestCatch.weight!, species: heaviestCatch.species }
    : longestCatch
    ? { value: longestCatch.length!, species: longestCatch.species }
    : null

  // ── Monthly trend — last 12 months ───────────────────────────────────────
  const now = new Date()
  const monthKeys: string[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  const monthlyMap = new Map<string, number>(monthKeys.map(k => [k, 0]))
  for (const t of trips) {
    const key = t.date.slice(0, 7)
    if (monthlyMap.has(key)) monthlyMap.set(key, monthlyMap.get(key)! + t.catches.length)
  }
  const monthlyChart = [...monthlyMap.entries()].map(([key, n]) => ({
    // Use the 2nd to avoid any UTC/local boundary issues
    month: new Date(key + '-02').toLocaleDateString('en-US', { month: 'short' }),
    catches: n,
  }))

  // ── Bait frequency ───────────────────────────────────────────────────────
  const baitMap = new Map<string, number>()
  for (const c of catches) baitMap.set(c.bait, (baitMap.get(c.bait) ?? 0) + 1)
  const baitChart = [...baitMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([b, n]) => ({ name: trunc(b, 16), catches: n }))

  // ── Per-trip personal bests ──────────────────────────────────────────────
  let mostFishTrip: RawTrip | null = null
  let mostSpeciesTrip: RawTrip | null = null
  let mostSpeciesCount = 0
  for (const t of trips) {
    if (!mostFishTrip || t.catches.length > mostFishTrip.catches.length) mostFishTrip = t
    const uniq = new Set(t.catches.map(c => c.species)).size
    if (uniq > mostSpeciesCount) { mostSpeciesCount = uniq; mostSpeciesTrip = t }
  }

  return {
    totalTrips,
    totalCatches,
    topSpecies,
    biggestCatch,
    speciesChart,
    monthlyChart,
    baitChart,
    bests: {
      heaviest: heaviestCatch ? {
        value: heaviestCatch.weight!,
        species: heaviestCatch.species,
        lake: heaviestCatch.tripLake,
        date: heaviestCatch.tripDate,
      } : null,
      longest: longestCatch ? {
        value: longestCatch.length!,
        species: longestCatch.species,
        lake: longestCatch.tripLake,
        date: longestCatch.tripDate,
      } : null,
      mostFish: mostFishTrip?.catches.length ? {
        count: mostFishTrip.catches.length,
        lake: mostFishTrip.lake,
        date: mostFishTrip.date,
      } : null,
      mostSpecies: mostSpeciesTrip && mostSpeciesCount > 0 ? {
        count: mostSpeciesCount,
        lake: mostSpeciesTrip.lake,
        date: mostSpeciesTrip.date,
      } : null,
    },
  }
}

// ─── Chart tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-gray-800">{label}</p>
      <p className="text-xs text-teal-600 font-medium">{payload[0].value} catches</p>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 leading-tight truncate">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">{title}</p>
      {children}
    </div>
  )
}

function BestRow({ label, value, sub }: { label: string; value: string | null; sub?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-gray-50 last:border-0">
      <p className="text-sm text-gray-600 leading-snug flex-1">{label}</p>
      <div className="text-right flex-shrink-0">
        {value ? (
          <>
            <p className="text-sm font-semibold text-gray-900">{value}</p>
            {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
          </>
        ) : (
          <p className="text-sm text-gray-300">—</p>
        )}
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <div className="animate-pulse space-y-4 px-4">
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
            <div className="h-7 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
          <div className="h-36 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Stats() {
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<ComputedStats | null>(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    let cancelled = false
    setDataLoading(true)
    setError(null)

    supabase
      .from('trips')
      .select('id, date, lake, catches(species, bait, weight, length)')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
      .then(({ data, error: dbError }) => {
        if (cancelled) return
        if (dbError) {
          setError('Failed to load stats — ' + dbError.message)
        } else {
          setStats(computeStats((data ?? []) as RawTrip[]))
        }
        setDataLoading(false)
      })

    return () => { cancelled = true }
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth loading ────────────────────────────────────────────────────────
  if (authLoading) return <div className="pt-6 pb-4"><StatsSkeleton /></div>

  // ── Not signed in ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="pt-6 pb-4">
        <div className="px-4 mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Stats</h1>
        </div>
        <div className="px-6 mt-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-teal-500">
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 4-4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Your fishing stats</h2>
          <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed mb-6">
            Sign in to see insights about your catches, best baits, and personal records.
          </p>
          <Link
            to="/login"
            className="text-sm font-semibold text-white bg-teal-600 px-6 py-3 rounded-xl shadow-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  // ── Data loading ─────────────────────────────────────────────────────────
  if (dataLoading || !stats) {
    return (
      <div className="pt-6 pb-4">
        <div className="px-4 mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Stats</h1>
        </div>
        <StatsSkeleton />
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="pt-6 pb-4">
        <div className="px-4 mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Stats</h1>
        </div>
        <div className="mx-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (stats.totalTrips === 0) {
    return (
      <div className="pt-6 pb-4">
        <div className="px-4 mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Stats</h1>
        </div>
        <div className="px-6 mt-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-gray-400">
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 4-4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">No data yet</h2>
          <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed mb-6">
            Log your first trip to start building your personal catch stats and records.
          </p>
          <Link
            to="/log/new"
            className="text-sm font-semibold text-white bg-teal-600 px-6 py-3 rounded-xl shadow-sm"
          >
            Log a trip
          </Link>
        </div>
      </div>
    )
  }

  // ── Stats display ─────────────────────────────────────────────────────────
  const { mode } = useMode()
  const isSaltwater = mode === 'saltwater'
  const chartAccent = isSaltwater ? '#0ea5e9' : '#0d9488'
  const gridColor   = isSaltwater ? '#1e3a5f' : '#f1f5f9'
  const cursorFill  = isSaltwater ? '#132a44' : '#f8fafc'
  const tickStyle   = { fontSize: 11, fill: isSaltwater ? '#7aa0c4' : '#94a3b8' }

  return (
    <div className="pt-6 pb-4">
      <div className="px-4 mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Stats</h1>
        <p className="text-sm text-gray-500 mt-1">Your fishing history</p>
      </div>

      <div className="px-4 space-y-4">

        {/* ── Summary grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard label="Trips logged"     value={String(stats.totalTrips)} />
          <SummaryCard label="Fish caught"      value={String(stats.totalCatches)} />
          <SummaryCard
            label="Top species"
            value={stats.topSpecies === '—' ? '—' : stats.topSpecies}
          />
          <SummaryCard
            label="Biggest catch"
            value={stats.biggestCatch?.value ?? '—'}
            sub={stats.biggestCatch?.species}
          />
        </div>

        {/* ── Catches by species ──────────────────────────────────────────── */}
        {stats.speciesChart.length > 0 && (
          <ChartCard title="Catches by species">
            {/* Horizontal bars — better for named categories on mobile */}
            <ResponsiveContainer width="100%" height={Math.max(160, stats.speciesChart.length * 34)}>
              <BarChart
                data={stats.speciesChart}
                layout="vertical"
                margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tick={tickStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: cursorFill }} />
                <Bar dataKey="catches" fill={chartAccent} radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* ── Monthly trend ───────────────────────────────────────────────── */}
        <ChartCard title="Monthly catch trend">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={stats.monthlyChart}
              margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="catches"
                stroke={chartAccent}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: chartAccent }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Most effective baits ────────────────────────────────────────── */}
        {stats.baitChart.length > 0 && (
          <ChartCard title="Most effective baits">
            <ResponsiveContainer width="100%" height={Math.max(160, stats.baitChart.length * 34)}>
              <BarChart
                data={stats.baitChart}
                layout="vertical"
                margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={112}
                  tick={tickStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: cursorFill }} />
                <Bar dataKey="catches" fill={chartAccent} radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* ── Personal bests ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Personal bests</p>
          <BestRow
            label="Heaviest fish"
            value={stats.bests.heaviest?.value ?? null}
            sub={stats.bests.heaviest
              ? `${stats.bests.heaviest.species} · ${stats.bests.heaviest.lake} · ${fmtDate(stats.bests.heaviest.date)}`
              : undefined}
          />
          <BestRow
            label="Longest fish"
            value={stats.bests.longest?.value ?? null}
            sub={stats.bests.longest
              ? `${stats.bests.longest.species} · ${stats.bests.longest.lake} · ${fmtDate(stats.bests.longest.date)}`
              : undefined}
          />
          <BestRow
            label="Most fish in one trip"
            value={stats.bests.mostFish ? `${stats.bests.mostFish.count} fish` : null}
            sub={stats.bests.mostFish
              ? `${stats.bests.mostFish.lake} · ${fmtDate(stats.bests.mostFish.date)}`
              : undefined}
          />
          <BestRow
            label="Most species in one trip"
            value={stats.bests.mostSpecies ? `${stats.bests.mostSpecies.count} species` : null}
            sub={stats.bests.mostSpecies
              ? `${stats.bests.mostSpecies.lake} · ${fmtDate(stats.bests.mostSpecies.date)}`
              : undefined}
          />
        </div>

      </div>
    </div>
  )
}
