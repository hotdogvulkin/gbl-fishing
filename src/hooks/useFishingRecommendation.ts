import { useState } from 'react'
import type { WeatherConditions, Recommendation } from '../types'
import { fetchWeather, fetchWeatherByCoords } from '../lib/weather'
import { getRecommendation } from '../lib/claude'

interface RecommendationState {
  weather: WeatherConditions | null
  recommendation: Recommendation | null
  loading: boolean
  error: string | null
}

const INITIAL: RecommendationState = {
  weather: null,
  recommendation: null,
  loading: false,
  error: null,
}

export function useFishingRecommendation() {
  const [state, setState] = useState<RecommendationState>(INITIAL)

  // Text-based flow (freshwater search bar) — geocodes the string internally
  async function fetchRecommendation(location: string) {
    if (!location.trim()) return
    setState({ ...INITIAL, loading: true })
    try {
      const weather = await fetchWeather(location)
      const recommendation = await getRecommendation(location, weather)
      setState({ weather, recommendation, loading: false, error: null })
    } catch (err) {
      setState({ ...INITIAL, error: err instanceof Error ? err.message : 'Something went wrong' })
    }
  }

  // Coordinate-based flow (map pin) — skips geocoding, accepts optional target species
  async function fetchRecommendationByCoords(
    lat: number,
    lon: number,
    locationName: string,
    targetSpecies?: string,
  ) {
    setState({ ...INITIAL, loading: true })
    try {
      const weather = await fetchWeatherByCoords(lat, lon)
      const recommendation = await getRecommendation(locationName, weather, targetSpecies)
      setState({ weather, recommendation, loading: false, error: null })
    } catch (err) {
      setState({ ...INITIAL, error: err instanceof Error ? err.message : 'Something went wrong' })
    }
  }

  function reset() {
    setState(INITIAL)
  }

  return { ...state, fetchRecommendation, fetchRecommendationByCoords, reset }
}
