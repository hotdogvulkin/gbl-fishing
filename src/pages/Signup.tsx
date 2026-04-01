import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getUnclaimedTrips, clearUnclaimedTrips } from '../lib/localStorage'
import type { Trip } from '../types'

// Migrate unclaimed localStorage trips into Supabase under the given user ID
async function migrateTrips(userId: string, trips: Trip[]): Promise<void> {
  for (const trip of trips) {
    const { data: tripRow, error: tripError } = await supabase
      .from('trips')
      .insert({
        user_id: userId,
        date: trip.date,
        lake: trip.lake,
        notes: trip.notes ?? null,
      })
      .select()
      .single()

    if (tripError) continue // best-effort — don't throw if one trip fails

    if (trip.catches.length > 0) {
      await supabase.from('catches').insert(
        trip.catches.map(c => ({
          trip_id: tripRow.id,
          species: c.species,
          bait: c.bait,
          weight: c.weight ?? null,
          length: c.length ?? null,
          time_caught: c.timeCaught,
          notes: c.notes ?? null,
        }))
      )
    }
  }
}

type Stage =
  | { name: 'form' }
  | { name: 'confirm-email' }
  | { name: 'migration-prompt'; userId: string; tripCount: number }
  | { name: 'migrating' }

export default function Signup() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [stage, setStage] = useState<Stage>({ name: 'form' })

  const inputClass =
    'w-full bg-white border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setSubmitting(true)
    try {
      const { session } = await signUp(email, password)

      if (!session) {
        // Email confirmation required — user needs to verify before they can use the app
        setStage({ name: 'confirm-email' })
        return
      }

      // User is immediately active — check for unclaimed localStorage trips
      const unclaimedTrips = getUnclaimedTrips()
      if (unclaimedTrips.length > 0) {
        setStage({ name: 'migration-prompt', userId: session.user.id, tripCount: unclaimedTrips.length })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleMigrateYes(userId: string) {
    setStage({ name: 'migrating' })
    const trips = getUnclaimedTrips()
    await migrateTrips(userId, trips)
    clearUnclaimedTrips()
    navigate('/', { replace: true })
  }

  function handleMigrateNo() {
    clearUnclaimedTrips()
    navigate('/', { replace: true })
  }

  // ── Email confirmation pending ─────────────────────────────────────────────
  if (stage.name === 'confirm-email') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-teal-600">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Verify your email</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-1">We sent a confirmation link to</p>
            <p className="text-sm font-semibold text-gray-800 mb-5">{email}</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tap the link in the email to activate your account, then come back and sign in.
            </p>
          </div>
          <Link
            to="/login"
            className="mt-4 block w-full text-center text-sm font-semibold text-teal-600 py-3"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  // ── Migration prompt ───────────────────────────────────────────────────────
  if (stage.name === 'migration-prompt') {
    const { userId, tripCount } = stage
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-white rounded-md border border-gray-100 p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-300">
                <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              You have {tripCount} {tripCount === 1 ? 'trip' : 'trips'} saved locally
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Would you like to save {tripCount === 1 ? 'it' : 'them'} to your new account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleMigrateNo}
                className="flex-1 py-3 rounded-md border border-gray-200 text-sm font-medium text-gray-600"
              >
                No thanks
              </button>
              <button
                onClick={() => handleMigrateYes(userId)}
                className="flex-1 py-3 rounded-md bg-teal-600 text-sm font-semibold text-white"
              >
                Yes, save them
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Migrating spinner ──────────────────────────────────────────────────────
  if (stage.name === 'migrating') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <svg className="w-8 h-8 text-teal-600 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm text-gray-500">Saving your trips…</p>
      </div>
    )
  }

  // ── Signup form ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-12">
      <div className="w-full max-w-sm mx-auto">
        {/* App identity */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-teal-600 mb-3">
            <span className="text-white text-xs font-bold tracking-tight">GBL</span>
          </div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-gray-900">GBL Fishing</h1>
          <p className="text-sm text-gray-500 mt-1">Create your account</p>
        </div>

        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6 space-y-4">
          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={inputClass}
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                required
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-md transition-colors mt-1"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

        </div>

        {/* Link to login */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
