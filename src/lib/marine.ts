import type { MarineConditions, TideEvent } from '../types'

// ── NOAA tide station mapping ─────────────────────────────────────────────────
// Florida coastal stations only. Station selected by closest longitude to the
// dropped pin, as specified — good enough for Florida coastal use cases.

const TIDE_STATIONS = [
  { name: 'Jacksonville', id: '8720218', lon: -81.6 },
  { name: 'Miami',        id: '8723170', lon: -80.2 },
  { name: 'Key West',     id: '8724580', lon: -81.8 },
  { name: 'Tampa Bay',    id: '8726520', lon: -82.5 },
  { name: 'Pensacola',    id: '8729840', lon: -87.2 },
] as const

function nearestStation(lon: number) {
  return TIDE_STATIONS.reduce((best, s) =>
    Math.abs(s.lon - lon) < Math.abs(best.lon - lon) ? s : best
  )
}

// ── Time helpers ──────────────────────────────────────────────────────────────

// Parse NOAA datetime "YYYY-MM-DD HH:MM" as local time (not UTC).
// Using the Date constructor form that explicitly takes components avoids
// the ambiguity in Date.parse for strings without a timezone specifier.
function parseNoaaTime(t: string): Date {
  const [datePart, timePart] = t.split(' ')
  const [y, mo, d]  = datePart.split('-').map(Number)
  const [hr, min]   = timePart.split(':').map(Number)
  return new Date(y, mo - 1, d, hr, min)
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

// ── Tide status ───────────────────────────────────────────────────────────────

function computeTideStatus(
  tides: { date: Date; type: 'H' | 'L' }[]
): { status: MarineConditions['tideStatus']; nextTideLabel: string } {
  const now = new Date()
  const sorted = [...tides].sort((a, b) => a.date.getTime() - b.date.getTime())

  const prev = [...sorted].reverse().find(t => t.date <= now)
  const next = sorted.find(t => t.date > now)

  if (!prev && !next) return { status: 'Unknown', nextTideLabel: '' }

  // Within 20 minutes of a tide event — call it High or Low
  const nearPrev = prev && Math.abs(now.getTime() - prev.date.getTime()) < 20 * 60_000
  if (nearPrev) {
    return {
      status: prev!.type === 'H' ? 'High' : 'Low',
      nextTideLabel: next ? `${next.type === 'H' ? 'High' : 'Low'} at ${formatTime(next.date)}` : '',
    }
  }

  const status = prev
    ? (prev.type === 'L' ? 'Rising' : 'Falling')
    : (next!.type === 'H' ? 'Rising' : 'Falling')

  return {
    status,
    nextTideLabel: next ? `${next.type === 'H' ? 'High' : 'Low'} at ${formatTime(next.date)}` : '',
  }
}

// ── NOAA tide fetch ───────────────────────────────────────────────────────────

interface NoaaPrediction { t: string; v: string; type: string }

async function fetchTides(station: typeof TIDE_STATIONS[number]): Promise<{
  tides: TideEvent[]
  tideStatus: MarineConditions['tideStatus']
  nextTideLabel: string
}> {
  const url =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` +
    `?date=today&station=${station.id}&product=predictions&datum=MLLW` +
    `&time_zone=lst_ldt&interval=hilo&units=english&application=gbl_fishing&format=json`

  // 6-second timeout — NOAA can be slow; don't hold up the whole fetch
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) throw new Error('NOAA API error')

    const data = await res.json()
    const predictions: NoaaPrediction[] = data.predictions ?? []

    const parsed = predictions.map(p => ({
      date: parseNoaaTime(p.t),
      time: formatTime(parseNoaaTime(p.t)),
      height: Math.round(parseFloat(p.v) * 10) / 10,
      type: p.type as 'H' | 'L',
    }))

    const { status, nextTideLabel } = computeTideStatus(parsed)

    return {
      tides: parsed.map(({ time, height, type }) => ({ time, height, type })),
      tideStatus: status,
      nextTideLabel,
    }
  } catch {
    clearTimeout(timer)
    // Tide data is enrichment — don't abort the whole recommendation if it fails
    return { tides: [], tideStatus: 'Unknown', nextTideLabel: '' }
  }
}

// ── Open-Meteo marine API ─────────────────────────────────────────────────────

async function fetchMarineWeather(lat: number, lon: number): Promise<{
  waveHeightFt: number
  wavePeriodSec: number
  seaTempF: number | null
}> {
  const url =
    `https://marine-api.open-meteo.com/v1/marine` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=wave_height,wave_period,wind_wave_height,sea_surface_temperature`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Marine API unavailable')

  const data = await res.json()
  const c = data.current ?? {}

  const waveM: number = c.wave_height ?? c.wind_wave_height ?? 0
  const seaC: number | null = c.sea_surface_temperature ?? null

  return {
    waveHeightFt: Math.round(waveM * 3.281 * 10) / 10,  // metres → feet
    wavePeriodSec: Math.round(c.wave_period ?? 0),
    seaTempF: seaC !== null ? Math.round(seaC * 9 / 5 + 32) : null,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchMarineConditions(
  lat: number,
  lon: number,
): Promise<MarineConditions> {
  const station = nearestStation(lon)

  // Fetch weather and tides in parallel — independent APIs, no need to serialize
  const [marine, tideData] = await Promise.all([
    fetchMarineWeather(lat, lon),
    fetchTides(station),
  ])

  return {
    ...marine,
    ...tideData,
    nearestStation: station.name,
  }
}
