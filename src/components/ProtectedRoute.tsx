import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Optional message shown on the login page explaining why the user was redirected */
  message?: string
}

export default function ProtectedRoute({ children, message }: Props) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Hold render until the initial Supabase session check completes.
  // Without this, every page load would flash a redirect for ~100ms.
  if (loading) return null

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message }}
        replace
      />
    )
  }

  return <>{children}</>
}
