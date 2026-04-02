import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import BioluminescenceCanvas from './BioluminescenceCanvas'
import MorningMistCanvas from './MorningMistCanvas'
import { useMode } from '../context/ModeContext'

export default function Layout() {
  const location = useLocation()
  const { mode } = useMode()
  return (
    <>
      {/* Both canvases sit position:fixed at z-index:-1, behind all page content.
          Only one is visible at a time — they fade in/out on mode switch. */}
      <BioluminescenceCanvas visible={mode === 'saltwater'} />
      <MorningMistCanvas     visible={mode === 'freshwater'} />
      <div className="min-h-screen pb-16">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    </>
  )
}
