import { NavLink } from 'react-router-dom'

// ─── Custom Icons ─────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
    </svg>
  )
}

function FishIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      {/* Body */}
      <path d="M6.5 12C6.5 8.5 9.3 6 13.2 6C17.1 6 21 8.7 21 12C21 15.3 17.1 18 13.2 18C9.3 18 6.5 15.5 6.5 12Z" />
      {/* Tail fins */}
      <path d="M6.5 12L3.5 8.5" />
      <path d="M6.5 12L3.5 15.5" />
      {/* Eye */}
      <circle cx="17" cy="10.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function LogIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 14.25a.75.75 0 000 1.5H15a.75.75 0 000-1.5H9.75zm0-3.75a.75.75 0 000 1.5H15a.75.75 0 000-1.5H9.75z" clipRule="evenodd" />
      <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

function BarChartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3"  y="12" width="4" height="9" rx="0.5" />
      <rect x="10" y="7"  width="4" height="14" rx="0.5" />
      <rect x="17" y="3"  width="4" height="18" rx="0.5" />
    </svg>
  )
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const tabs = [
  { to: '/',            label: 'Home',     Icon: HomeIcon,      end: true  },
  { to: '/species',     label: 'Species',  Icon: FishIcon,      end: false },
  { to: '/regulations', label: 'Regs',     Icon: BookIcon,      end: false },
  { to: '/log',         label: 'Log',      Icon: LogIcon,       end: false },
  { to: '/stats',       label: 'Stats',    Icon: BarChartIcon,  end: false },
  { to: '/log/new',     label: 'New Trip', Icon: PlusIcon,      end: false },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 pt-2 pb-3 gap-0.5 text-[10px] font-medium transition-colors min-h-[56px] ${
              isActive ? 'text-teal-600' : 'text-gray-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon />
              <span className={isActive ? 'text-teal-600' : 'text-gray-400'}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
