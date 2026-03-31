import type { Trip } from '../types'

// Trips created before a user signs up are stored here, flagged for migration.
// Key is intentionally app-specific to avoid collisions with other localStorage users.
const UNCLAIMED_KEY = 'gbl_unclaimed_trips'

export function getUnclaimedTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(UNCLAIMED_KEY)
    return raw ? (JSON.parse(raw) as Trip[]) : []
  } catch {
    return []
  }
}

export function clearUnclaimedTrips(): void {
  localStorage.removeItem(UNCLAIMED_KEY)
}

export function saveUnclaimedTrip(trip: Trip): void {
  const existing = getUnclaimedTrips()
  localStorage.setItem(UNCLAIMED_KEY, JSON.stringify([...existing, trip]))
}
