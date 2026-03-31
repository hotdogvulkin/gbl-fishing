export type FishingRating = 'excellent' | 'good' | 'fair' | 'slow'

export interface Catch {
  id: string
  species: string
  bait: string
  weight?: string   // optional, stored as string so user can type "2.5 lbs" freely
  length?: string   // optional, e.g. "14 inches"
  timeCaught: string // HH:MM
  notes?: string
}

export interface Trip {
  id: string
  date: string      // YYYY-MM-DD
  lake: string
  notes?: string
  catches: Catch[]
  createdAt: string // ISO timestamp
}

export interface MoonPhase {
  name: string
  emoji: string
  illumination: number // 0–1
}

export interface WeatherConditions {
  tempF: number
  windSpeedMph: number
  cloudCoverPct: number
  pressureHpa: number
  description: string
  moonPhase: MoonPhase
}

export interface Recommendation {
  targetFish: string
  bestBait: string
  bestKnot: string
  timingWindow: string
  reasoning: string
  rating: FishingRating
}

export interface FishIdentification {
  species: string       // empty string if unidentifiable
  confidence: 'high' | 'medium' | 'low'
  description: string
}
