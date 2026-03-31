import { useState } from 'react'
import type { WeatherConditions, Recommendation, SaltwaterRecommendation, MarineConditions } from '../types'
import type { FishingMode } from '../context/ModeContext'
import { fetchWeather, fetchWeatherByCoords } from '../lib/weather'
import { fetchMarineConditions } from '../lib/marine'
import { getRecommendation, getSaltwaterRecommendation } from '../lib/claude'

interface RecommendationState {
  weather: WeatherConditions | null
  marine: MarineConditions | null
  recommendation: Recommendation | SaltwaterRecommendation | null
  resultMode: FishingMode | null   // which mode produced this result — drives card rendering
  loading: boolean
  error: string | null
}

const INITIAL: RecommendationState = {
  weather: null,
  marine: null,
  recommendation: null,
  resultMode: null,
  loading: false,
  error: null,
}

export function useFishingRecommendation() {
  const [state, setState] = useState<RecommendationState>(INITIAL)

  // ── Freshwater text-search flow ──────────────────────────────────────────────
  async function fetchRecommendation(location: string) {
    if (!location.trim()) return
    setState({ ...INITIAL, loading: true })
    try {
      const weather = await fetchWeather(location)
      const recommendation = await getRecommendation(location, weather)
      setState({ ...INITIAL, weather, recommendation, resultMode: 'freshwater', loading: false })
    } catch (err) {
      setState({ ...INITIAL, error: err instanceof Error ? err.message : 'Something went wrong' })
    }
  }

  // ── Freshwater map-pin flow ───────────────────────────────────────────────────
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
      setState({ ...INITIAL, weather, recommendation, resultMode: 'freshwater', loading: false })
    } catch (err) {
      setState({ ...INITIAL, error: err instanceof Error ? err.message : 'Something went wrong' })
    }
  }

  // ── Saltwater map-pin flow ────────────────────────────────────────────────────
  // Fetches weather + marine conditions in parallel before calling Claude.
  // Uses a completely separate prompt optimised for offshore fishing.
  async function fetchSaltwaterRecommendation(
    lat: number,
    lon: number,
    locationName: string,
    targetSpecies?: string,
  ) {
    setState({ ...INITIAL, loading: true })
    try {
      const [weather, marine] = await Promise.all([
        fetchWeatherByCoords(lat, lon),
        fetchMarineConditions(lat, lon),
      ])
      const recommendation = await getSaltwaterRecommendation(
        lat, lon, locationName, weather, marine, targetSpecies,
      )
      setState({ ...INITIAL, weather, marine, recommendation, resultMode: 'saltwater', loading: false })
    } catch (err) {
      setState({ ...INITIAL, error: err instanceof Error ? err.message : 'Something went wrong' })
    }
  }

  function reset() {
    setState(INITIAL)
  }

  return { ...state, fetchRecommendation, fetchRecommendationByCoords, fetchSaltwaterRecommendation, reset }
}
