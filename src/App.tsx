import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TripLog from './pages/TripLog'
import NewTrip from './pages/NewTrip'
import KnotDetail from './pages/KnotDetail'
import Regulations from './pages/Regulations'
import SpeciesPage from './pages/Species'
import Stats from './pages/Stats'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — intentionally outside Layout so they have no BottomNav */}
        <Route path="/login"  element={<Login />}  />
        <Route path="/signup" element={<Signup />} />

        {/* Main app — all routes share the Layout (BottomNav + page transitions) */}
        <Route element={<Layout />}>
          <Route path="/"            element={<Home />} />
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
