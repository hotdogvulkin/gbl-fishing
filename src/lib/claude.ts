import type { WeatherConditions, Recommendation } from '../types'

export async function getRecommendation(
  location: string,
  weather: WeatherConditions
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
- Moon: ${weather.moonPhase.name} (${Math.round(weather.moonPhase.illumination * 100)}% illuminated)

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
