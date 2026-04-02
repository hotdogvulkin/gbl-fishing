import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import BioluminescenceCanvas from '../components/BioluminescenceCanvas'

// ── Feature section icons ─────────────────────────────────────────────────────

function TargetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2" x2="12" y2="7.5" />
      <line x1="12" y1="16.5" x2="12" y2="22" />
      <line x1="2" y1="12" x2="7.5" y2="12" />
      <line x1="16.5" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function WavesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M2 9c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
      <path d="M2 15c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    </svg>
  )
}

function TrendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polyline points="3,17 8,12 13,14 21,6" />
      <polyline points="17,6 21,6 21,10" />
    </svg>
  )
}

// ── Feature list icons ────────────────────────────────────────────────────────

function StarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'w-4 h-4'}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}

function LoopIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'w-4 h-4'}>
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  )
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'w-4 h-4'}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'w-4 h-4'}>
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  )
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'w-4 h-4'}>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  )
}

function ScalesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'w-4 h-4'}>
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M5 21h14" />
      <path d="M5 7L2 13c0 1.66 1.34 3 3 3s3-1.34 3-3L5 7z" />
      <path d="M19 7l-3 6c0 1.66 1.34 3 3 3s3-1.34 3-3l-3-6z" />
    </svg>
  )
}

function ChartTrendIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'w-4 h-4'}>
      <polyline points="3,17 8,12 13,14 21,6" />
      <polyline points="17,6 21,6 21,10" />
    </svg>
  )
}

function WifiOffIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'w-4 h-4'}>
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
      <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0122.56 9" />
      <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
      <path d="M8.53 16.11a6 6 0 016.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="2" />
    </svg>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    Icon: TargetIcon,
    title: 'One Clear Recommendation',
    copy: "Tell us where you're fishing. We analyze real-time weather, barometric pressure, moon phase, and tidal data to tell you exactly what to target, what bait to use, and when to go.",
  },
  {
    Icon: WavesIcon,
    title: 'Freshwater and Offshore',
    copy: 'Switch between freshwater lake fishing and offshore saltwater mode. Drop a pin on your launch point and get species-specific offshore recommendations with tide windows and depth targets.',
  },
  {
    Icon: TrendIcon,
    title: 'Learn From Every Trip',
    copy: 'Log your catches and GBL Fishing analyzes your history to surface personal patterns. Discover which conditions produce your best days on the water.',
  },
]

const FEATURE_LIST = [
  { Icon: StarIcon,        title: 'AI Recommendations',  desc: 'Powered by Claude, updated with live conditions' },
  { Icon: LoopIcon,        title: 'Knot Guide',           desc: 'Step-by-step SVG illustrations for 5 essential knots' },
  { Icon: CameraIcon,      title: 'Fish Identifier',      desc: 'Upload a photo and identify your catch instantly' },
  { Icon: ClipboardIcon,   title: 'Trip Logging',         desc: 'Track every catch with conditions and notes' },
  { Icon: BookOpenIcon,    title: 'Species Library',      desc: 'Freshwater and offshore species with photos and tips' },
  { Icon: ScalesIcon,      title: 'Regulations',          desc: 'FWC freshwater and NOAA offshore rules in one place' },
  { Icon: ChartTrendIcon,  title: 'Pattern Recognition',  desc: 'Discover what conditions produce your best fishing' },
  { Icon: WifiOffIcon,     title: 'Offline Ready',        desc: 'Core features work without signal — built for offshore use' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Landing() {
  useEffect(() => {
    const prev = document.documentElement.style.background
    document.documentElement.style.background = '#080F1A'
    return () => { document.documentElement.style.background = prev }
  }, [])

  return (
    <div className="antialiased">
      <BioluminescenceCanvas visible />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-teal-400 mb-6">
          GBL Fishing
        </p>
        <h1
          className="font-bold text-white leading-none tracking-tight mb-6"
          style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}
        >
          Know Before You Go.
        </h1>
        <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-10" style={{ maxWidth: '500px' }}>
          Real-time weather, tides, moon phase, and AI-powered recommendations — freshwater and offshore.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            to="/signup"
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-7 py-3 rounded-md transition-colors"
          >
            Get Started
          </Link>
          <a
            href="#features"
            onClick={e => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white text-sm font-medium px-7 py-3 rounded-md transition-colors"
          >
            See How It Works
          </a>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-teal-600 mb-14 text-center">
            What GBL Fishing Does
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            {FEATURES.map(({ Icon, title, copy }) => (
              <div key={title}>
                <div className="text-teal-600 mb-4">
                  <Icon />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2 tracking-tight">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modes Showcase ────────────────────────────────────────────────── */}
      <section className="bg-[#F9FAFB] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-teal-600 mb-14 text-center">
            Two Modes. One App.
          </p>
          <div className="grid md:grid-cols-2 gap-6">

            {/* Freshwater mockup */}
            <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
              <div className="px-5 pt-5 pb-2 border-b border-gray-50">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-teal-600">Freshwater</p>
              </div>
              <div className="p-5 space-y-3">
                {/* Location field */}
                <div className="border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-500 flex items-center justify-between">
                  <span>Lake Tohopekaliga, FL</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-300">
                    <path fillRule="evenodd" d="M8.157 2.176a1.5 1.5 0 00-1.147 0l-4.084 1.69A1.5 1.5 0 002 5.25v10.877a.75.75 0 001.067.672l3.766-1.561 4.175 1.809a1.5 1.5 0 001.147 0l4.084-1.69A1.5 1.5 0 0018 13.75V2.873a.75.75 0 00-1.067-.672l-3.766 1.561-4.175-1.809a1.5 1.5 0 00-.835-.107zM7.25 4.905v9.674l-3.5 1.45V6.355l3.5-1.45zM8.75 14.58V4.905l4.5 1.95v9.674l-4.5-1.95zM14.75 15.645V5.97l3.5-1.45v9.674l-3.5 1.45z" clipRule="evenodd" />
                  </svg>
                </div>
                {/* Toggle */}
                <div className="flex border border-gray-200 rounded-md overflow-hidden text-xs font-medium">
                  <div className="flex-1 py-2 text-center bg-teal-600 text-white">Pick a species</div>
                  <div className="flex-1 py-2 text-center text-gray-400 border-l border-gray-200">Describe your goal</div>
                </div>
                {/* Recommendation */}
                <div className="pt-2 border-l-[3px] border-teal-600 pl-3">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-gray-600">Excellent conditions</span>
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.06em] mb-0.5">Target Fish</p>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Largemouth Bass</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.06em] mb-0.5">Best Bait</p>
                  <p className="text-sm font-medium text-gray-700">Texas-rigged creature, green pumpkin</p>
                </div>
              </div>
              <div className="px-5 pb-5">
                <p className="text-xs text-gray-400 leading-relaxed">Search any Florida lake or city. Weather, pressure, and moon phase guide every recommendation.</p>
              </div>
            </div>

            {/* Saltwater mockup */}
            <div className="bg-[#080F1A] border border-[#1a2840] rounded-md overflow-hidden">
              <div className="px-5 pt-5 pb-2 border-b border-[#1a2840]">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cyan-400">Offshore / Saltwater</p>
              </div>
              <div className="p-5 space-y-3">
                {/* Map placeholder */}
                <div className="bg-[#0d1d35] rounded-md h-28 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute w-full h-px bg-cyan-400" style={{ top: '33%' }} />
                    <div className="absolute w-full h-px bg-cyan-400" style={{ top: '66%' }} />
                    <div className="absolute h-full w-px bg-cyan-400" style={{ left: '33%' }} />
                    <div className="absolute h-full w-px bg-cyan-400" style={{ left: '66%' }} />
                  </div>
                  <div className="relative flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-cyan-400">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.43-4.793 3.43-8.327a8.25 8.25 0 00-16.5 0c0 3.534 1.487 6.248 3.43 8.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.144.742z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] text-cyan-300 mt-1">Launch point set</span>
                  </div>
                </div>
                {/* Conditions */}
                <div className="flex gap-5 text-[11px] text-gray-500">
                  <span><span className="text-white font-medium">1.5 ft</span> waves</span>
                  <span><span className="text-white font-medium">79°F</span> SST</span>
                  <span><span className="text-white font-medium">Incoming</span> tide</span>
                </div>
                {/* Recommendation */}
                <div className="pt-1 border-l-[3px] border-cyan-500 pl-3">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-xs font-medium text-gray-400">Good conditions</span>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.06em] mb-0.5">Target</p>
                  <p className="text-sm font-semibold text-white mb-2">Mahi-Mahi</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.06em] mb-0.5">Where to Go</p>
                  <p className="text-sm font-medium text-gray-300">Head 18–22 mi SW to shelf break</p>
                </div>
              </div>
              <div className="px-5 pb-5">
                <p className="text-xs text-gray-500 leading-relaxed">Drop a pin at your launch point for offshore conditions — wave height, SST, and full tide schedules.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Feature List ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
            {FEATURE_LIST.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="text-teal-600 mt-0.5 flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ────────────────────────────────────────────────────── */}
      <section className="bg-[#080F1A] py-24 px-6 text-center">
        <h2
          className="font-bold text-white tracking-tight mb-3"
          style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}
        >
          Ready to fish smarter?
        </h2>
        <p className="text-gray-400 text-sm mb-8">Free to use. No credit card required.</p>
        <Link
          to="/signup"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-8 py-3 rounded-md transition-colors"
        >
          Get Started
        </Link>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-200 px-6 py-5 flex items-center justify-between">
        <span className="text-sm font-bold tracking-tight text-gray-900">GBL Fishing</span>
        <span className="text-sm text-gray-400">Built by Grant Garcia</span>
      </footer>
    </div>
  )
}
