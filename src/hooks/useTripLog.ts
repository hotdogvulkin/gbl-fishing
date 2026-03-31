import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Trip, Catch } from '../types'

// Map a Supabase row (snake_case) → our Trip interface (camelCase)
function mapTrip(row: Record<string, unknown>): Trip {
  const catchRows = Array.isArray(row.catches) ? row.catches as Record<string, unknown>[] : []
  return {
    id: row.id as string,
    date: row.date as string,
    lake: row.lake as string,
    notes: (row.notes as string | null) ?? undefined,
    createdAt: row.created_at as string,
    catches: catchRows.map(mapCatch),
  }
}

function mapCatch(row: Record<string, unknown>): Catch {
  return {
    id: row.id as string,
    species: row.species as string,
    bait: row.bait as string,
    weight: (row.weight as string | null) ?? undefined,
    length: (row.length as string | null) ?? undefined,
    timeCaught: (row.time_caught as string) ?? '',
    notes: (row.notes as string | null) ?? undefined,
  }
}

export function useTripLog() {
  const { user } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Re-fetch whenever the logged-in user changes (login, logout, account switch)
  useEffect(() => {
    let cancelled = false

    if (!user) {
      // Not logged in — nothing to load; keep loading false so the UI renders
      setTrips([])
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)

      // RLS on the trips table ensures each user only sees their own rows,
      // but we also filter explicitly to be defensive and avoid confusion.
      const { data, error: dbError } = await supabase
        .from('trips')
        .select('*, catches(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (cancelled) return

      if (dbError) {
        setError('Failed to load trips — ' + dbError.message)
        setLoading(false)
        return
      }

      setTrips((data ?? []).map(mapTrip))
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [user?.id])  // eslint-disable-line react-hooks/exhaustive-deps

  async function saveTrip(trip: Trip): Promise<void> {
    if (!user) throw new Error('Must be signed in to save a trip')

    // 1. Insert the trip row with the authenticated user's ID
    const { data: tripRow, error: tripError } = await supabase
      .from('trips')
      .insert({
        user_id: user.id,
        date: trip.date,
        lake: trip.lake,
        notes: trip.notes ?? null,
      })
      .select()
      .single()

    if (tripError) throw new Error('Failed to save trip — ' + tripError.message)

    // 2. Insert all catches linked to the new trip_id
    if (trip.catches.length > 0) {
      const catchRows = trip.catches.map(c => ({
        trip_id: tripRow.id,
        species: c.species,
        bait: c.bait,
        weight: c.weight ?? null,
        length: c.length ?? null,
        time_caught: c.timeCaught,
        notes: c.notes ?? null,
      }))

      const { error: catchError } = await supabase.from('catches').insert(catchRows)
      if (catchError) throw new Error('Trip saved but catches failed — ' + catchError.message)
    }
  }

  return { trips, loading, error, saveTrip }
}
