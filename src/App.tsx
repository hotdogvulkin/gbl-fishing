import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import TripLog from './pages/TripLog'
import NewTrip from './pages/NewTrip'
import KnotDetail from './pages/KnotDetail'
import Regulations from './pages/Regulations'
import SpeciesPage from './pages/Species'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/species" element={<SpeciesPage />} />
          <Route path="/regulations" element={<Regulations />} />
          <Route path="/log" element={<TripLog />} />
          <Route path="/log/new" element={<NewTrip />} />
          <Route path="/knots/:knotName" element={<KnotDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
