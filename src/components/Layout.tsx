import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  const location = useLocation()
  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      {/* key forces remount on route change, triggering the CSS entry animation */}
      <div key={location.pathname} className="page-enter">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
