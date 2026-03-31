import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import BioluminescenceCanvas from './BioluminescenceCanvas'
import { useMode } from '../context/ModeContext'

export default function Layout() {
  const location = useLocation()
  const { mode } = useMode()
  return (
    <>
      {/* Canvas sits position:fixed at z-index:-1, behind all page content.
          The wrapper div has no background so the body gradient shows through. */}
      <BioluminescenceCanvas visible={mode === 'saltwater'} />
      <div className="min-h-screen pb-16">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    </>
  )
}
