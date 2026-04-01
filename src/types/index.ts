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
  goalInterpretation?: string  // set when an angler goal or species was provided
}

// ── Saltwater-specific types ──────────────────────────────────────────────────

export interface TideEvent {
  time: string    // formatted for display, e.g. "6:23 AM"
  height: number  // feet
  type: 'H' | 'L'
}

export interface MarineConditions {
  waveHeightFt: number
  wavePeriodSec: number
  seaTempF: number | null  // null when outside marine API coverage
  tides: TideEvent[]
  tideStatus: 'Rising' | 'Falling' | 'High' | 'Low' | 'Unknown'
  nextTideLabel: string    // e.g. "High at 2:30 PM"
  nearestStation: string   // e.g. "Tampa Bay"
}

// Same JSON shape as Recommendation but with offshore-specific fields.
// Use isSaltwaterRec() type guard to narrow at runtime.
export interface SaltwaterRecommendation {
  targetFish: string
  recommendedArea: string  // e.g. "Head 15–20 mi SE toward the shelf edge"
  bait: string
  knot: string
  timing: string           // tide-specific timing window
  depth: string            // e.g. "40–80 ft"
  reasoning: string
  rating: FishingRating
}

export function isSaltwaterRec(
  r: Recommendation | SaltwaterRecommendation
): r is SaltwaterRecommendation {
  return 'recommendedArea' in r
}

export interface FishIdentification {
  species: string       // empty string if unidentifiable
  confidence: 'high' | 'medium' | 'low'
  description: string
}
