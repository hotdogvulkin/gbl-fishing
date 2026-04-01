import type { WeatherConditions, Recommendation, SaltwaterRecommendation, MarineConditions, FishIdentification } from '../types'

export async function getRecommendation(
  location: string,
  weather: WeatherConditions,
  targetSpecies?: string
): Promise<Recommendation> {

  const systemPrompt = `You are an expert fishing guide with deep knowledge of freshwater and saltwater fish behavior, seasonal patterns, weather effects, and fishing techniques.

When given current conditions, return a fishing recommendation as ONLY a valid JSON object — no markdown, no explanation, no code fences. The JSON must match this exact shape:

{
  "targetFish": "specific species to target right now",
  "bestBait": "specific bait or lure with color/size if relevant",
  "bestKnot": "the knot name only — e.g. 'Palomar Knot' or 'Improved Clinch Knot'. No description, just the name.",
  "timingWindow": "best time window today, e.g. 'Dawn to 9am, then 5–7pm'",
  "reasoning": "2–3 sentences explaining why these conditions favor this approach",
  "rating": "excellent" | "good" | "fair" | "slow"
}

Rating guide:
- excellent: multiple strong signals (stable or rising pressure, full/new moon, low wind, ideal temp)
- good: mostly favorable with minor negatives
- fair: mixed signals — fishable but not optimal
- slow: poor conditions (rapid pressure drop, extreme wind, midday heat, etc.)`

  const userPrompt = `Location: ${location}
Current conditions:
- Temperature: ${weather.tempF}°F
- Wind: ${weather.windSpeedMph} mph
- Cloud cover: ${weather.cloudCoverPct}%
- Barometric pressure: ${weather.pressureHpa} hPa
- Sky: ${weather.description}
- Moon: ${weather.moonPhase.name} (${Math.round(weather.moonPhase.illumination * 100)}% illuminated)${
  targetSpecies && targetSpecies !== 'Any species'
    ? `\n- Target species: ${targetSpecies}`
    : ''
}

Respond with the JSON recommendation only.`

  // In dev: Vite proxies /api/anthropic/* → https://api.anthropic.com/*
  // In production: /api/recommendation is a Vercel serverless function that
  // calls Anthropic server-side so the API key never reaches the browser.
  const isDev = import.meta.env.DEV
  const [url, headers] = isDev
    ? [
        '/api/anthropic/v1/messages',
        {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY as string,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        } as Record<string, string>,
      ]
    : [
        '/api/recommendation',
        { 'Content-Type': 'application/json' } as Record<string, string>,
      ]

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? 'Recommendation failed')
  }

  const data = await res.json()
  const text: string = data.content[0].text.trim()

  try {
    return JSON.parse(text) as Recommendation
  } catch {
    throw new Error('Claude returned invalid JSON — try again')
  }
}

// ─── Saltwater recommendation ─────────────────────────────────────────────────

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return 'Spring'
  if (month >= 6 && month <= 8) return 'Summer'
  if (month >= 9 && month <= 11) return 'Fall'
  return 'Winter'
}

export async function getSaltwaterRecommendation(
  lat: number,
  lon: number,
  locationName: string,
  weather: WeatherConditions,
  marine: MarineConditions,
  targetSpecies?: string,
): Promise<SaltwaterRecommendation> {
  const now   = new Date()
  const month = MONTHS[now.getMonth()]
  const season = getSeason(now.getMonth())

  const tideSchedule = marine.tides.length > 0
    ? marine.tides.map(t => `  ${t.type === 'H' ? 'High' : 'Low'} ${t.time} — ${t.height} ft`).join('\n')
    : '  Tide data unavailable'

  const systemPrompt = `You are an expert offshore saltwater fishing guide specializing in Florida coastal and offshore waters. You have deep knowledge of:
- Pelagic and bottom species behavior relative to tides, moon phase, and ocean temperature
- Reading marine conditions to determine productive fishing windows and locations
- Offshore navigation — reef edges, shelf breaks, wrecks, ledges, color changes
- Seasonal migration patterns and species-specific depth ranges

When given current marine conditions, respond with ONLY a valid JSON object — no markdown, no explanation, no code fences. The JSON must match this exact shape:

{
  "targetFish": "specific species recommended given all conditions",
  "recommendedArea": "where to go — general direction, distance from launch, target structure (e.g. 'Head 18–22 miles SW toward the shelf break at 100 ft')",
  "bait": "specific offshore bait or lure with color, size, or rigging detail",
  "knot": "recommended offshore knot name only",
  "timing": "best tide window today — reference the actual high/low times provided",
  "depth": "target depth range in feet",
  "reasoning": "2–3 sentences explaining the recommendation using the actual conditions provided",
  "rating": "excellent" | "good" | "fair" | "slow"
}

Rating guide:
- excellent: strong solunar period, favorable tides, ideal SST, light wind, active moon
- good: mostly favorable with one limiting factor
- fair: mixed signals — fishable but timing or conditions are marginal
- slow: rough seas, extreme wind, dead tides, or off-temperature for target species`

  const userPrompt = `Launch point: ${locationName} (${lat.toFixed(4)}°, ${lon.toFixed(4)}°) — nearest tide station: ${marine.nearestStation}, FL
Month / Season: ${month} (${season})
Target species: ${targetSpecies && targetSpecies !== 'Any species' ? targetSpecies : 'any — recommend best option'}

── Atmospheric conditions ─────────────────────────────
Temperature:       ${weather.tempF}°F
Wind:              ${weather.windSpeedMph} mph
Cloud cover:       ${weather.cloudCoverPct}%
Barometric pressure: ${weather.pressureHpa} hPa
Sky:               ${weather.description}
Moon:              ${weather.moonPhase.name} (${Math.round(weather.moonPhase.illumination * 100)}% illuminated)

── Marine conditions ──────────────────────────────────
Wave height:       ${marine.waveHeightFt} ft (${marine.wavePeriodSec}s period)
Sea surface temp:  ${marine.seaTempF !== null ? `${marine.seaTempF}°F` : 'unavailable'}
Current tide:      ${marine.tideStatus}${marine.nextTideLabel ? ` — next ${marine.nextTideLabel}` : ''}

Tide schedule today (${marine.nearestStation} station):
${tideSchedule}

Respond with the JSON recommendation only.`

  const isDev = import.meta.env.DEV
  const [url, headers]: [string, Record<string, string>] = isDev
    ? [
        '/api/anthropic/v1/messages',
        {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY as string,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
      ]
    : ['/api/recommendation', { 'Content-Type': 'application/json' }]

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? 'Recommendation failed')
  }

  const data = await res.json()
  const text: string = data.content[0].text.trim()

  try {
    return JSON.parse(text) as SaltwaterRecommendation
  } catch {
    throw new Error('Claude returned invalid JSON — try again')
  }
}

// ─── Fish Identifier ──────────────────────────────────────────────────────────

// Shared helper — returns [url, headers] for an Anthropic API call
function anthropicFetch(body: unknown): Promise<Response> {
  const isDev = import.meta.env.DEV
  const [url, headers]: [string, Record<string, string>] = isDev
    ? [
        '/api/anthropic/v1/messages',
        {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY as string,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
      ]
    : [
        '/api/identify',
        { 'Content-Type': 'application/json' },
      ]

  return fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
}

// base64Data should be the raw base64 string (no data: URI prefix)
export async function identifyFish(
  base64Data: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'
): Promise<FishIdentification> {
  const res = await anthropicFetch({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64Data },
          },
          {
            type: 'text',
            text: `Identify the fish species in this image. Respond with ONLY a valid JSON object — no markdown, no explanation:

{
  "species": "common name of the fish (empty string if unidentifiable)",
  "confidence": "high" | "medium" | "low",
  "description": "one sentence about this species relevant to fishing"
}

Use confidence "low" and empty species if the image is unclear, not a fish, or you cannot identify it with reasonable certainty.`,
          },
        ],
      },
    ],
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? 'Identification failed')
  }

  const data = await res.json()
  const text: string = data.content[0].text.trim()

  try {
    return JSON.parse(text) as FishIdentification
  } catch {
    return { species: '', confidence: 'low', description: 'Could not parse response.' }
  }
}

// ─── Pattern Analysis ─────────────────────────────────────────────────────────

export interface PatternInsight {
  title: string
  insight: string
  confidence: 'high' | 'medium' | 'low'
  dataPoints: number
}

interface TripSummary {
  date: string
  lake: string
  catches: Array<{
    species: string
    bait: string
    weight?: string | null
    length?: string | null
    timeCaught?: string | null
    notes?: string | null
  }>
  notes?: string | null
}

export async function analyzePatterns(trips: TripSummary[]): Promise<PatternInsight[]> {
  // Format trip data compactly for the prompt
  const tripLines = trips.map(t => {
    const catchSummary = t.catches.map(c => {
      const parts = [c.species, c.bait]
      if (c.weight) parts.push(c.weight)
      if (c.length) parts.push(c.length)
      if (c.timeCaught) parts.push(`@${c.timeCaught}`)
      return parts.join(', ')
    }).join(' | ')
    return `${t.date} — ${t.lake} — ${t.catches.length} catch${t.catches.length !== 1 ? 'es' : ''}: ${catchSummary || 'none'}`
  }).join('\n')

  const userPrompt = `Fishing log (${trips.length} trips, ${trips.reduce((n, t) => n + t.catches.length, 0)} total catches):

${tripLines}

Analyze this personal fishing history and return 3–5 insight cards as a JSON array. Each card must be a JSON object with:
- "title": short title (4–7 words)
- "insight": one specific, data-backed sentence. Include actual numbers, species names, bait names, and dates where relevant. Example style: "You catch largemouth bass 3× more often on overcast mornings — based on 12 trips."
- "confidence": "high" (10+ supporting data points), "medium" (5–9), or "low" (2–4)
- "dataPoints": integer count of trips or catches that support this insight

Focus on: patterns between conditions and catches, most productive baits per species, time-of-day patterns, seasonal trends, and any other genuinely meaningful personal insight. Skip generic advice — only report what the data actually shows for THIS angler. If there is not enough variety in the data to identify a meaningful pattern, note that honestly.

Respond with ONLY the JSON array — no markdown, no explanation.`

  const res = await anthropicFetch({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: userPrompt }],
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? 'Pattern analysis failed')
  }

  const data = await res.json()
  const text: string = data.content[0].text.trim()

  try {
    return JSON.parse(text) as PatternInsight[]
  } catch {
    throw new Error('Claude returned invalid JSON — try again')
  }
}
