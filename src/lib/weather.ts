import type { WeatherConditions, MoonPhase } from '../types'

// Known new moon: Jan 6 2000 18:14 UTC. Synodic period = 29.53058867 days.
function calculateMoonPhase(): MoonPhase {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime()
  const synodicPeriod = 29.53058867
  const daysSince = (Date.now() - knownNewMoon) / 86_400_000
  const phase = ((daysSince % synodicPeriod) / synodicPeriod + 1) % 1
  const illumination = phase <= 0.5 ? phase * 2 : (1 - phase) * 2

  let name: string
  let emoji: string
  if (phase < 0.0625)      { name = 'New Moon';        emoji = '🌑' }
  else if (phase < 0.1875) { name = 'Waxing Crescent'; emoji = '🌒' }
  else if (phase < 0.3125) { name = 'First Quarter';   emoji = '🌓' }
  else if (phase < 0.4375) { name = 'Waxing Gibbous';  emoji = '🌔' }
  else if (phase < 0.5625) { name = 'Full Moon';       emoji = '🌕' }
  else if (phase < 0.6875) { name = 'Waning Gibbous';  emoji = '🌖' }
  else if (phase < 0.8125) { name = 'Last Quarter';    emoji = '🌗' }
  else                     { name = 'Waning Crescent'; emoji = '🌘' }

  return { name, emoji, illumination }
}

// WMO Weather Interpretation Codes → human-readable description for Claude's prompt
function describeWeatherCode(code: number): string {
  if (code === 0)              return 'clear sky'
  if (code === 1)              return 'mainly clear'
  if (code === 2)              return 'partly cloudy'
  if (code === 3)              return 'overcast'
  if (code <= 48)              return 'foggy'
  if (code <= 55)              return 'drizzle'
  if (code <= 65)              return 'rain'
  if (code <= 77)              return 'snow'
  if (code <= 82)              return 'rain showers'
  if (code <= 86)              return 'snow showers'
  return 'thunderstorm'
}

// Step 1 — geocode location string to lat/lng via OpenStreetMap Nominatim
async function geocode(location: string): Promise<{ lat: number; lon: number }> {
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(location)}&format=json&limit=1`

  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
  })
  if (!res.ok) throw new Error('Geocoding service unavailable')

  const data = await res.json()
  if (!data.length) throw new Error('Location not found — try "City, State" or "Lake Name, State"')

  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
}

// Shared Open-Meteo fetch — used by both text and coordinate flows
async function fetchWeatherAtCoords(lat: number, lon: number): Promise<WeatherConditions> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,surface_pressure,windspeed_10m,cloudcover,weathercode` +
    `&temperature_unit=fahrenheit&windspeed_unit=mph`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')

  const data = await res.json()
  const c = data.current

  return {
    tempF: Math.round(c.temperature_2m),
    windSpeedMph: Math.round(c.windspeed_10m),
    cloudCoverPct: c.cloudcover,
    pressureHpa: Math.round(c.surface_pressure),
    description: describeWeatherCode(c.weathercode),
    moonPhase: calculateMoonPhase(),
  }
}

// Text-based flow — geocodes location string first, then fetches weather
export async function fetchWeather(location: string): Promise<WeatherConditions> {
  const { lat, lon } = await geocode(location)
  return fetchWeatherAtCoords(lat, lon)
}

// Map-based flow — coordinates already known, skips geocoding entirely
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherConditions> {
  return fetchWeatherAtCoords(lat, lon)
}
