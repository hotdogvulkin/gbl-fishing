import { useState } from 'react'
import type { WeatherConditions, Recommendation } from '../types'
import { fetchWeather } from '../lib/weather'
import { getRecommendation } from '../lib/claude'

interface RecommendationState {
  weather: WeatherConditions | null
  recommendation: Recommendation | null
  loading: boolean
  error: string | null
}

export function useFishingRecommendation() {
  const [state, setState] = useState<RecommendationState>({
    weather: null,
    recommendation: null,
    loading: false,
    error: null,
  })

  async function fetchRecommendation(location: string) {
    if (!location.trim()) return

    setState({ weather: null, recommendation: null, loading: true, error: null })

    try {
      const weather = await fetchWeather(location)
      const recommendation = await getRecommendation(location, weather)
      setState({ weather, recommendation, loading: false, error: null })
    } catch (err) {
      setState({
        weather: null,
        recommendation: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Something went wrong',
      })
    }
  }

  return { ...state, fetchRecommendation }
}
