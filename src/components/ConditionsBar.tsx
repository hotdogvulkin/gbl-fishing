import type { WeatherConditions, MarineConditions } from '../types'

interface Props {
  conditions: WeatherConditions
  marine?: MarineConditions | null
}

interface Chip {
  icon: string
  label: string
  value: string
}

export default function ConditionsBar({ conditions, marine }: Props) {
  const chips: Chip[] = [
    { icon: '🌡️', label: 'Temp',     value: `${conditions.tempF}°F` },
    { icon: '💨', label: 'Wind',     value: `${conditions.windSpeedMph} mph` },
    { icon: '☁️', label: 'Clouds',   value: `${conditions.cloudCoverPct}%` },
    { icon: '📊', label: 'Pressure', value: `${conditions.pressureHpa} hPa` },
    { icon: conditions.moonPhase.emoji, label: 'Moon', value: conditions.moonPhase.name },
  ]

  if (marine) {
    chips.push({ icon: '🌊', label: 'Waves', value: `${marine.waveHeightFt} ft` })
    if (marine.seaTempF !== null) {
      chips.push({ icon: '🌡️', label: 'Sea Temp', value: `${marine.seaTempF}°F` })
    }
    chips.push({ icon: '🌊', label: 'Tide', value: marine.tideStatus })
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide px-4 mb-2">
        Current Conditions
      </p>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
        {chips.map(chip => (
          <div
            key={chip.label}
            className="flex-shrink-0 flex flex-col items-center gap-1 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 min-w-[72px]"
          >
            <span className="text-xl">{chip.icon}</span>
            <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{chip.value}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">{chip.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
