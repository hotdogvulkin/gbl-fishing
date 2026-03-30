import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import TripLog from './pages/TripLog'
import NewTrip from './pages/NewTrip'
import KnotDetail from './pages/KnotDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/log" element={<TripLog />} />
          <Route path="/log/new" element={<NewTrip />} />
          <Route path="/knots/:knotName" element={<KnotDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
