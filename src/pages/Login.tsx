import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type Mode = 'password' | 'magic'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInWithMagicLink } = useAuth()

  const state = location.state as { from?: { pathname?: string }; message?: string } | null
  const redirectMessage = state?.message
  const from = state?.from?.pathname ?? '/'

  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [magicSent, setMagicSent] = useState(false)

  const inputClass =
    'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent'

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setPassword('')
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleMagicSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signInWithMagicLink(email)
      setMagicSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send magic link')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Magic link sent ────────────────────────────────────────────────────────
  if (magicSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-teal-600">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-1">We sent a sign-in link to</p>
            <p className="text-sm font-semibold text-gray-800 mb-5">{email}</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tap the link in the email to sign in instantly. You can close this page.
            </p>
          </div>
          <button
            onClick={() => { setMagicSent(false); setError(null) }}
            className="mt-4 w-full text-center text-sm text-gray-500 py-2"
          >
            Use a different method
          </button>
        </div>
      </div>
    )
  }

  // ── Main login form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-12">
      <div className="w-full max-w-sm mx-auto">

        {/* App identity */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎣</div>
          <h1 className="text-2xl font-bold text-gray-900">GBL Fishing</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Redirect message */}
        {redirectMessage && (
          <div className="mb-4 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 flex gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-teal-700">{redirectMessage}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Mode tabs */}
          <div className="flex border-b border-gray-100">
            <button
              type="button"
              onClick={() => switchMode('password')}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                mode === 'password'
                  ? 'text-teal-600 border-b-2 border-teal-600 -mb-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => switchMode('magic')}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                mode === 'magic'
                  ? 'text-teal-600 border-b-2 border-teal-600 -mb-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Magic link
            </button>
          </div>

          <div className="p-6">
            {/* Error */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Password form */}
            {mode === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                    placeholder="••••••••"
                    className={inputClass}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                >
                  {submitting ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            )}

            {/* Magic link form */}
            {mode === 'magic' && (
              <form onSubmit={handleMagicSubmit} className="space-y-4">
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
                <p className="text-xs text-gray-400 leading-relaxed -mt-1">
                  We'll email you a one-tap sign-in link — no password needed.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                >
                  {submitting ? 'Sending…' : 'Send magic link'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Link to signup */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-teal-600 hover:text-teal-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
