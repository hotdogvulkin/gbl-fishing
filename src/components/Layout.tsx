import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import BioluminescenceCanvas from './BioluminescenceCanvas'
import { useMode } from '../context/ModeContext'

export default function Layout() {
  const location = useLocation()
  const { mode } = useMode()
  return (
    <>
      {/* Both canvases sit position:fixed at z-index:-1, behind all page content.
          Only one is visible at a time — they fade in/out on mode switch. */}
      <BioluminescenceCanvas visible={mode === 'saltwater'} />
{/* relative z-[1] creates a stacking context above the MorningMistCanvas
          (z-index: 0), so all page content renders on top of the mist layer. */}
      <div className="min-h-screen pb-16 relative z-[1]">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    </>
  )
}
