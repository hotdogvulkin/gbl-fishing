import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TripLog from './pages/TripLog'
import NewTrip from './pages/NewTrip'
import KnotDetail from './pages/KnotDetail'
import Regulations from './pages/Regulations'
import SpeciesPage from './pages/Species'
import Stats from './pages/Stats'

// Unauthenticated → landing page; authenticated → /home
function LandingRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/home" replace />
  return <Landing />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — shown to unauthenticated users; authenticated users redirect to /home */}
        <Route path="/" element={<LandingRoute />} />

        {/* Auth pages — intentionally outside Layout so they have no BottomNav */}
        <Route path="/login"  element={<Login />}  />
        <Route path="/signup" element={<Signup />} />

        {/* Main app — all routes share the Layout (BottomNav + page transitions) */}
        <Route element={<Layout />}>
          <Route path="/home"        element={<Home />} />
          <Route path="/species"     element={<SpeciesPage />} />
          <Route path="/regulations" element={<Regulations />} />

          {/* Trip log requires auth — unauthenticated users are redirected to /login */}
          <Route path="/log" element={
            <ProtectedRoute>
              <TripLog />
            </ProtectedRoute>
          } />
          <Route path="/log/new" element={
            <ProtectedRoute message="Sign in to save your trips">
              <NewTrip />
            </ProtectedRoute>
          } />

          <Route path="/stats" element={<Stats />} />
          <Route path="/knots/:knotName" element={<KnotDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
