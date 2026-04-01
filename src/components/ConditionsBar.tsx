import type { WeatherConditions, MarineConditions } from '../types'

// ── SVG icons ─────────────────────────────────────────────────────────────────

function TempIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="w-4 h-4">
      <path d="M14 9.25V5a2 2 0 00-4 0v4.25A5 5 0 1014 9.25z" />
    </svg>
  )
}

function WindIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M3 8h12.5a2.5 2.5 0 100-5 2.5 2.5 0 00-2.5 2.5" />
      <path d="M3 12h16.5a2.5 2.5 0 110 5 2.5 2.5 0 01-2.5-2.5" />
      <path d="M3 16h8" />
    </svg>
  )
}

function CloudIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  )
}

function GaugeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="w-4 h-4">
      <path d="M4.93 4.93A10 10 0 1019.07 4.93" />
      <path d="M12 12l-3-5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

function WaveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="w-4 h-4">
      <path d="M2 8c2.5 3 5 3 7.5 0s5-3 7.5 0M2 14c2.5 3 5 3 7.5 0s5-3 7.5 0" />
    </svg>
  )
}

function TideIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 5v14M7 10l5-5 5 5M7 19l5-5 5 5" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  conditions: WeatherConditions
  marine?: MarineConditions | null
}

interface Item {
  Icon: () => JSX.Element
  label: string
  value: string
}

export default function ConditionsBar({ conditions, marine }: Props) {
  const items: Item[] = [
    { Icon: TempIcon,  label: 'Temp',     value: `${conditions.tempF}°F` },
    { Icon: WindIcon,  label: 'Wind',     value: `${conditions.windSpeedMph} mph` },
    { Icon: CloudIcon, label: 'Clouds',   value: `${conditions.cloudCoverPct}%` },
    { Icon: GaugeIcon, label: 'Pressure', value: `${conditions.pressureHpa} hPa` },
    { Icon: MoonIcon,  label: 'Moon',     value: conditions.moonPhase.name },
  ]

  if (marine) {
    items.push({ Icon: WaveIcon, label: 'Waves', value: `${marine.waveHeightFt} ft` })
    if (marine.seaTempF !== null) {
      items.push({ Icon: TempIcon, label: 'Sea Temp', value: `${marine.seaTempF}°F` })
    }
    items.push({ Icon: TideIcon, label: 'Tide', value: marine.tideStatus })
  }

  return (
    <div className="mt-4 border-t border-b border-gray-100">
      <div className="flex gap-6 overflow-x-auto px-4 py-3 no-scrollbar">
        {items.map(({ Icon, label, value }) => (
          <div key={label} className="flex-shrink-0 flex flex-col items-center gap-1.5 min-w-[52px]">
            <span className="text-gray-400"><Icon /></span>
            <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{value}</span>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.06em] whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
