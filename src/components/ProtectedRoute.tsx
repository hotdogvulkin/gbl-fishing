import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  message?: string
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) return null

  if (!user) {
    return (
      <div className="pt-6 pb-4">
        <div className="px-6 mt-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-gray-400">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
            Create a free account
          </h2>
          <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed mb-7">
            Log trips and track your catches to unlock stats, patterns, and your personal records.
          </p>
          <Link
            to="/signup"
            className="w-full max-w-[240px] py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors text-center"
          >
            Sign Up — it's free
          </Link>
          <Link
            to="/login"
            className="mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Already have an account? Sign in
          </Link>
          <button
            onClick={() => navigate('/home')}
            className="mt-5 text-sm text-gray-400 hover:text-gray-500 transition-colors"
          >
            Continue without an account
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
