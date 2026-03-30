import { useState } from 'react'

interface Props {
  knotSlug: string
}

// ─── Shared drawing primitives ───────────────────────────────────────────────

const LINE = { stroke: '#0d9488', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }
const HOOK = { stroke: '#1e293b', strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }
const ARROW = { stroke: '#94a3b8', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }
const LABEL: React.SVGProps<SVGTextElement> = { fontSize: 10, fill: '#64748b', fontFamily: 'system-ui, sans-serif' }
const CAPTION: React.SVGProps<SVGTextElement> = { fontSize: 11, fill: '#0f172a', fontFamily: 'system-ui, sans-serif', fontWeight: '600', textAnchor: 'middle' }
const SUBCAP: React.SVGProps<SVGTextElement> = { fontSize: 10, fill: '#94a3b8', fontFamily: 'system-ui, sans-serif', textAnchor: 'middle' }

function ArrowHead({ x, y, angle }: { x: number; y: number; angle: number }) {
  const r = (angle * Math.PI) / 180
  const len = 7, spread = 2.5
  const cos = Math.cos(r), sin = Math.sin(r)
  return (
    <polyline
      points={`${x - len * cos + spread * sin},${y - len * sin - spread * cos} ${x},${y} ${x - len * cos - spread * sin},${y - len * sin + spread * cos}`}
      {...ARROW}
    />
  )
}

function FishHook({ x, y }: { x: number; y: number }) {
  const shankBot = y + 44, bendR = 14
  const pointX = x - bendR + 3, pointY = shankBot - bendR + 2
  return (
    <g>
      <circle cx={x} cy={y} r={5} {...HOOK} />
      <line x1={x} y1={y + 5} x2={x} y2={shankBot} {...HOOK} />
      <path d={`M ${x} ${shankBot} A ${bendR} ${bendR} 0 0 1 ${pointX} ${pointY}`} {...HOOK} />
      <path d={`M ${pointX} ${pointY} l -5 4`} {...HOOK} />
    </g>
  )
}

function Checkmark({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={11} fill="#0d9488" opacity={0.15} />
      <polyline points={`${cx - 6},${cy} ${cx - 1},${cy + 5} ${cx + 7},${cy - 6}`} stroke="#0d9488" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  )
}

// ─── PALOMAR ─────────────────────────────────────────────────────────────────

function PalomarStep1() {
  const hx = 150, hy = 80
  const y1 = hy - 3, y2 = hy + 3
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <path d={`M 30 ${y1} L ${hx - 5} ${y1} M ${hx + 5} ${y1} L 270 ${y1}`} {...LINE} />
      <path d={`M 30 ${y2} L ${hx - 5} ${y2} M ${hx + 5} ${y2} L 190 ${y2}`} {...LINE} />
      <ArrowHead x={210} y={y1} angle={0} />
      <text x={32} y={y1 - 7} {...LABEL}>standing line</text>
      <text x={32} y={y2 + 15} {...LABEL}>tag end</text>
      <text x={150} y={200} {...CAPTION}>Thread doubled line through eye</text>
    </g>
  )
}

function PalomarStep2() {
  const hx = 150, hy = 155
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <path d={`M ${hx - 4} ${hy} L ${hx - 4} 115 Q ${hx - 4} 95 ${hx - 14} 85 Q ${hx - 30} 70 ${hx} 60 Q ${hx + 30} 70 ${hx + 14} 85 Q ${hx + 4} 95 ${hx + 4} 115 L ${hx + 4} ${hy}`} {...LINE} />
      <line x1={hx - 14} y1={85} x2={30} y2={50} {...LINE} />
      <line x1={hx + 14} y1={85} x2={260} y2={50} {...LINE} />
      <text x={28} y={44} {...LABEL}>standing line</text>
      <text x={185} y={44} {...LABEL}>tag end</text>
      <text x={150} y={225} {...CAPTION}>Tie loose overhand knot — hook hangs free</text>
    </g>
  )
}

function PalomarStep3() {
  const hx = 150, hy = 90
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <path d={`M ${hx - 4} ${hy} L ${hx - 4} 50 Q ${hx} 35 ${hx + 4} 50 L ${hx + 4} ${hy}`} {...LINE} />
      <line x1={hx - 14} y1={50} x2={40} y2={30} {...LINE} />
      <line x1={hx + 14} y1={50} x2={255} y2={30} {...LINE} />
      <ellipse cx={hx - 2} cy={hy + 55} rx={28} ry={20} {...LINE} strokeDasharray="5 3" opacity={0.5} />
      <ArrowHead x={hx - 25} y={hy + 62} angle={90} />
      <ArrowHead x={hx + 22} y={hy + 62} angle={90} />
      <text x={28} y={25} {...LABEL}>standing line</text>
      <text x={183} y={25} {...LABEL}>tag end</text>
      <text x={150} y={218} {...CAPTION}>Pass loop over entire hook</text>
    </g>
  )
}

function PalomarStep4() {
  const hx = 150, hy = 130
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <path d={`M ${hx - 4} ${hy} Q ${hx - 12} ${hy - 15} ${hx - 5} ${hy - 20} Q ${hx} ${hy - 24} ${hx + 5} ${hy - 20} Q ${hx + 12} ${hy - 15} ${hx + 4} ${hy}`} {...LINE} />
      <line x1={hx - 5} y1={hy - 20} x2={50} y2={45} {...LINE} />
      <line x1={hx + 5} y1={hy - 20} x2={245} y2={45} {...LINE} />
      <ArrowHead x={75} y={55} angle={-35} />
      <ArrowHead x={218} y={55} angle={-145} />
      <text x={28} y={40} {...LABEL}>standing line</text>
      <text x={178} y={40} {...LABEL}>tag end</text>
      <text x={150} y={215} {...CAPTION}>Pull both ends firmly to tighten</text>
      <text x={150} y={228} {...SUBCAP}>(moisten first)</text>
    </g>
  )
}

function PalomarStep5() {
  const hx = 150, hy = 120
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <path d={`M ${hx - 4} ${hy} Q ${hx - 10} ${hy - 12} ${hx - 5} ${hy - 17} Q ${hx} ${hy - 21} ${hx + 5} ${hy - 17} Q ${hx + 10} ${hy - 12} ${hx + 4} ${hy}`} {...LINE} />
      <line x1={hx} y1={hy - 19} x2={hx} y2={45} {...LINE} />
      <line x1={hx + 5} y1={hy - 17} x2={hx + 22} y2={hy - 28} {...LINE} />
      <line x1={hx + 19} y1={hy - 31} x2={hx + 25} y2={hy - 24} stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round" />
      <text x={hx + 28} y={hy - 23} {...LABEL} fill="#94a3b8">trim</text>
      <text x={hx + 8} y={44} {...LABEL}>standing line</text>
      <Checkmark cx={150} cy={208} />
      <text x={150} y={230} {...CAPTION}>Finished — trim tag end to ¼ inch</text>
    </g>
  )
}

// ─── IMPROVED CLINCH ─────────────────────────────────────────────────────────

function ClinchStep1() {
  const hx = 200, hy = 110
  return (
    <g>
      <FishHook x={hx} y={hy} />
      {/* Line coming from left through eye */}
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      <line x1={hx + 5} y1={hy} x2={260} y2={hy} {...LINE} />
      {/* Arrow showing direction */}
      <ArrowHead x={240} y={hy} angle={0} />
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <text x={210} y={hy - 8} {...LABEL}>tag end</text>
      {/* "6 inches" brace for tag end */}
      <line x1={hx + 5} y1={hy + 18} x2={260} y2={hy + 18} stroke="#94a3b8" strokeWidth={1} />
      <line x1={hx + 5} y1={hy + 14} x2={hx + 5} y2={hy + 22} stroke="#94a3b8" strokeWidth={1} />
      <line x1={260} y1={hy + 14} x2={260} y2={hy + 22} stroke="#94a3b8" strokeWidth={1} />
      <text x={162} y={hy + 30} textAnchor="middle" {...LABEL}>~6 inches</text>
      <text x={150} y={210} {...CAPTION}>Thread line through eye, leave 6" tag</text>
    </g>
  )
}

function ClinchStep2() {
  const hx = 80, hy = 110
  // Five coils spiralling away from hook (rightward)
  const coilSpacing = 18
  const coilAmt = 5
  return (
    <g>
      <FishHook x={hx} y={hy} />
      {/* Standing line from left */}
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {/* Wraps: each coil is an oval */}
      {Array.from({ length: coilAmt }).map((_, i) => (
        <ellipse
          key={i}
          cx={hx + 20 + i * coilSpacing}
          cy={hy}
          rx={coilSpacing * 0.42}
          ry={14}
          {...LINE}
          strokeWidth={2.5}
        />
      ))}
      {/* Tag end after wraps going right */}
      <line x1={hx + 20 + (coilAmt - 1) * coilSpacing + 8} y1={hy} x2={270} y2={hy} {...LINE} />
      <ArrowHead x={258} y={hy} angle={0} />
      <text x={28} y={hy - 8} {...LABEL}>standing line</text>
      <text x={215} y={hy - 8} {...LABEL}>tag end</text>
      <text x={150} y={210} {...CAPTION}>Wrap tag end around standing line 5×</text>
    </g>
  )
}

function ClinchStep3() {
  const hx = 80, hy = 110
  const coilSpacing = 18, coilAmt = 5
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {Array.from({ length: coilAmt }).map((_, i) => (
        <ellipse key={i} cx={hx + 20 + i * coilSpacing} cy={hy} rx={coilSpacing * 0.42} ry={14} {...LINE} strokeWidth={2.5} />
      ))}
      {/* Small loop above eye */}
      <ellipse cx={hx + 8} cy={hy - 18} rx={8} ry={6} {...LINE} strokeDasharray="4 2" />
      {/* Tag end going through small loop upward */}
      <path d={`M ${hx + 20 + (coilAmt - 1) * coilSpacing + 8} ${hy} Q 260 ${hy} 260 ${hy - 30} Q 260 ${hy - 50} ${hx + 14} ${hy - 22}`} {...LINE} />
      <ArrowHead x={hx + 12} y={hy - 22} angle={200} />
      <text x={28} y={hy - 8} {...LABEL}>standing line</text>
      <text x={150} y={210} {...CAPTION}>Pass tag end through small loop above eye</text>
    </g>
  )
}

function ClinchStep4() {
  const hx = 80, hy = 110
  const coilSpacing = 18, coilAmt = 5
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {Array.from({ length: coilAmt }).map((_, i) => (
        <ellipse key={i} cx={hx + 20 + i * coilSpacing} cy={hy} rx={coilSpacing * 0.42} ry={14} {...LINE} strokeWidth={2.5} />
      ))}
      {/* Large loop formed between wraps and eye */}
      <path d={`M ${hx + 8} ${hy - 24} Q ${hx - 10} ${hy - 55} 150 ${hy - 65} Q 240 ${hy - 55} 260 ${hy - 20} L 260 ${hy}`} {...LINE} strokeDasharray="5 3" opacity={0.55} />
      {/* Tag end going through large loop */}
      <path d={`M ${hx + 20 + (coilAmt - 1) * coilSpacing + 6} ${hy - 14} Q 240 ${hy - 80} 150 ${hy - 90} Q 60 ${hy - 80} ${hx + 6} ${hy - 30}`} {...LINE} />
      <ArrowHead x={hx + 5} y={hy - 28} angle={130} />
      <text x={28} y={hy - 8} {...LABEL}>standing line</text>
      <text x={150} y={210} {...CAPTION}>Pass tag end through large loop</text>
      <text x={150} y={223} {...SUBCAP}>(the "improved" tuck)</text>
    </g>
  )
}

function ClinchStep5() {
  const hx = 80, hy = 120
  const coilAmt = 5, coilSpacing = 14
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {/* Tighter wraps cinching toward eye */}
      {Array.from({ length: coilAmt }).map((_, i) => (
        <ellipse key={i} cx={hx + 14 + i * coilSpacing} cy={hy} rx={coilSpacing * 0.38} ry={11} {...LINE} strokeWidth={2.5} />
      ))}
      {/* Tag end exiting top */}
      <path d={`M ${hx + 14 + (coilAmt - 1) * coilSpacing + 5} ${hy - 10} L 250 ${hy - 55}`} {...LINE} />
      {/* Standing line pulling left */}
      <ArrowHead x={42} y={hy} angle={180} />
      {/* Tag end pulling right-up */}
      <ArrowHead x={242} y={hy - 50} angle={-30} />
      <text x={28} y={hy - 8} {...LABEL}>standing line</text>
      <text x={210} y={hy - 58} {...LABEL}>tag end</text>
      <text x={150} y={215} {...CAPTION}>Pull both ends — wraps cinch toward eye</text>
      <text x={150} y={228} {...SUBCAP}>(moisten first)</text>
    </g>
  )
}

function ClinchStep6() {
  const hx = 100, hy = 120
  const coilAmt = 5, coilSpacing = 12
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {/* Tight compact wraps at eye */}
      {Array.from({ length: coilAmt }).map((_, i) => (
        <ellipse key={i} cx={hx + 10 + i * coilSpacing} cy={hy} rx={coilSpacing * 0.4} ry={9} {...LINE} strokeWidth={2.5} />
      ))}
      {/* Short trimmed tag */}
      <line x1={hx + 10 + (coilAmt - 1) * coilSpacing + 4} y1={hy - 8} x2={hx + 85} y2={hy - 30} {...LINE} />
      <line x1={hx + 82} y1={hy - 33} x2={hx + 88} y2={hy - 26} stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round" />
      <text x={hx + 90} y={hy - 24} {...LABEL} fill="#94a3b8">trim</text>
      <text x={28} y={hy - 8} {...LABEL}>standing line</text>
      <Checkmark cx={150} cy={208} />
      <text x={150} y={230} {...CAPTION}>Finished — wraps tight against eye</text>
    </g>
  )
}

// ─── UNI KNOT ────────────────────────────────────────────────────────────────

function UniStep1() {
  const hx = 190, hy = 115
  return (
    <g>
      <FishHook x={hx} y={hy} />
      {/* Line through eye from left */}
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      <line x1={hx + 5} y1={hy} x2={260} y2={hy} {...LINE} />
      {/* Doubled back portion — tag turns back parallel */}
      <path d={`M 260 ${hy} Q 270 ${hy} 270 ${hy + 12} Q 270 ${hy + 22} 260 ${hy + 22} L 120 ${hy + 22}`} {...LINE} />
      <ArrowHead x={122} y={hy + 22} angle={180} />
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <text x={200} y={hy + 35} {...LABEL}>tag end (doubled back)</text>
      <text x={150} y={210} {...CAPTION}>Thread eye, double tag back parallel</text>
    </g>
  )
}

function UniStep2() {
  const hx = 190, hy = 110
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {/* The two parallel strands from eye going left */}
      <line x1={hx + 5} y1={hy} x2={80} y2={hy} {...LINE} />
      <line x1={hx + 5} y1={hy + 18} x2={80} y2={hy + 18} {...LINE} />
      {/* Loop folded back over the doubled section */}
      <path d={`M 80 ${hy} Q 55 ${hy} 55 ${hy + 9} Q 55 ${hy + 30} 70 ${hy + 38} L 165 ${hy + 38} Q 180 ${hy + 38} 180 ${hy + 22} L 180 ${hy + 18}`} {...LINE} strokeDasharray="5 3" opacity={0.65} />
      <ArrowHead x={178} y={hy + 20} angle={90} />
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <text x={150} y={210} {...CAPTION}>Form loop over both parallel lines</text>
    </g>
  )
}

function UniStep3() {
  const hx = 190, hy = 110
  const coilAmt = 5, spacing = 14
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      <line x1={hx + 5} y1={hy} x2={80} y2={hy} {...LINE} />
      <line x1={hx + 5} y1={hy + 18} x2={80} y2={hy + 18} {...LINE} />
      {/* Coils wrapping through loop around the doubled section */}
      {Array.from({ length: coilAmt }).map((_, i) => (
        <ellipse key={i} cx={84 + i * spacing} cy={hy + 9} rx={spacing * 0.4} ry={12} {...LINE} strokeWidth={2.5} />
      ))}
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <text x={150} y={210} {...CAPTION}>Wrap tag through loop 4–6 times</text>
    </g>
  )
}

function UniStep4() {
  const hx = 190, hy = 115
  const coilAmt = 5, spacing = 14
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {/* Tightened coil cluster before eye */}
      {Array.from({ length: coilAmt }).map((_, i) => (
        <ellipse key={i} cx={hx - 60 + i * spacing} cy={hy} rx={spacing * 0.4} ry={10} {...LINE} strokeWidth={2.5} />
      ))}
      {/* Tag end */}
      <line x1={hx - 60 + (coilAmt - 1) * spacing + 6} y1={hy - 9} x2={50} y2={hy - 45} {...LINE} />
      {/* Arrow: standing line pulls right toward eye */}
      <ArrowHead x={hx - 10} y={hy} angle={0} />
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <text x={52} y={hy - 48} {...LABEL}>tag end</text>
      <text x={150} y={210} {...CAPTION}>Pull standing line — knot slides toward eye</text>
    </g>
  )
}

function UniStep5() {
  const hx = 190, hy = 115
  const coilAmt = 5, spacing = 11
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {/* Compact wraps seated against eye */}
      {Array.from({ length: coilAmt }).map((_, i) => (
        <ellipse key={i} cx={hx + 8 + i * spacing} cy={hy} rx={spacing * 0.42} ry={8} {...LINE} strokeWidth={2.5} />
      ))}
      {/* Tag end exiting right */}
      <line x1={hx + 8 + (coilAmt - 1) * spacing + 4} y1={hy - 7} x2={265} y2={hy - 30} {...LINE} />
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <text x={230} y={hy - 34} {...LABEL}>tag end</text>
      <text x={150} y={210} {...CAPTION}>Knot seated tight against eye</text>
    </g>
  )
}

function UniStep6() {
  const hx = 190, hy = 115
  const coilAmt = 5, spacing = 10
  return (
    <g>
      <FishHook x={hx} y={hy} />
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {Array.from({ length: coilAmt }).map((_, i) => (
        <ellipse key={i} cx={hx + 7 + i * spacing} cy={hy} rx={spacing * 0.42} ry={8} {...LINE} strokeWidth={2.5} />
      ))}
      {/* Short trimmed tag */}
      <line x1={hx + 7 + (coilAmt - 1) * spacing + 4} y1={hy - 7} x2={hx + 70} y2={hy - 28} {...LINE} />
      <line x1={hx + 67} y1={hy - 31} x2={hx + 73} y2={hy - 24} stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round" />
      <text x={hx + 76} y={hy - 22} {...LABEL} fill="#94a3b8">trim</text>
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <Checkmark cx={150} cy={208} />
      <text x={150} y={230} {...CAPTION}>Finished — wraps seated against eye</text>
    </g>
  )
}

// ─── FLORIDA LOOP KNOT ────────────────────────────────────────────────────────

function FloridaStep1() {
  // Overhand knot ~10 inches from tag end — shown in mid-frame, not tightened
  return (
    <g>
      {/* Standing line entering from right */}
      <line x1={270} y1={110} x2={175} y2={110} {...LINE} />
      {/* Loose overhand knot shape */}
      <path d={`M 175 110 Q 155 110 150 98 Q 145 82 160 78 Q 180 73 188 90 Q 196 108 180 118 L 160 118`} {...LINE} />
      {/* Tag end continuing left */}
      <line x1={160} y1={118} x2={30} y2={118} {...LINE} />
      {/* "open loop" annotation */}
      <text x={148} y={68} {...LABEL} textAnchor="middle">loose loop</text>
      <line x1={148} y1={71} x2={155} y2={80} stroke="#94a3b8" strokeWidth={1} />
      <text x={272} y={104} {...LABEL} textAnchor="end">standing line</text>
      <text x={28} y={132} {...LABEL}>tag end</text>
      {/* Brace for 10 inches */}
      <line x1={30} y1={135} x2={160} y2={135} stroke="#94a3b8" strokeWidth={1} />
      <line x1={30} y1={131} x2={30} y2={139} stroke="#94a3b8" strokeWidth={1} />
      <line x1={160} y1={131} x2={160} y2={139} stroke="#94a3b8" strokeWidth={1} />
      <text x={95} y={147} textAnchor="middle" {...LABEL}>~10 inches</text>
      <text x={150} y={210} {...CAPTION}>Tie loose overhand knot, leave open</text>
    </g>
  )
}

function FloridaStep2() {
  const hx = 150, hy = 75
  return (
    <g>
      <FishHook x={hx} y={hy} />
      {/* Overhand knot above/left */}
      <path d={`M 95 130 Q 75 130 70 118 Q 65 102 80 98 Q 100 93 108 110 Q 116 128 100 138 L 80 138`} {...LINE} />
      {/* Tag end: from knot going right and down through hook eye */}
      <path d={`M 100 138 Q 130 140 ${hx - 5} ${hy}`} {...LINE} />
      <line x1={hx + 5} y1={hy} x2={255} y2={hy} {...LINE} />
      <ArrowHead x={240} y={hy} angle={0} />
      {/* Standing line exiting top-left of knot */}
      <line x1={95} y1={130} x2={30} y2={105} {...LINE} />
      <text x={28} y={99} {...LABEL}>standing line</text>
      <text x={215} y={hy - 8} {...LABEL}>tag end</text>
      <text x={150} y={210} {...CAPTION}>Pass tag end through hook eye</text>
    </g>
  )
}

function FloridaStep3() {
  const hx = 150, hy = 75
  return (
    <g>
      <FishHook x={hx} y={hy} />
      {/* Overhand knot */}
      <path d={`M 95 130 Q 75 130 70 118 Q 65 102 80 98 Q 100 93 108 110 Q 116 128 100 138 L 80 138`} {...LINE} />
      {/* Standing line */}
      <line x1={95} y1={130} x2={30} y2={105} {...LINE} />
      {/* Tag from eye curving back to pass through overhand knot */}
      <path d={`M ${hx} ${hy} Q 140 100 120 120 Q 112 132 104 130`} {...LINE} />
      <ArrowHead x={103} y={130} angle={190} />
      <text x={28} y={99} {...LABEL}>standing line</text>
      <text x={150} y={210} {...CAPTION}>Run tag back through overhand knot</text>
      <text x={150} y={223} {...SUBCAP}>(enter from hook side)</text>
    </g>
  )
}

function FloridaStep4() {
  const hx = 150, hy = 75
  return (
    <g>
      <FishHook x={hx} y={hy} />
      {/* Overhand knot */}
      <path d={`M 95 130 Q 75 130 70 118 Q 65 102 80 98 Q 100 93 108 110 Q 116 128 100 138 L 80 138`} {...LINE} />
      <line x1={95} y1={130} x2={30} y2={105} {...LINE} />
      {/* Tag exiting knot, wrapping around standing line */}
      <path d={`M 100 96 Q 90 75 60 70 Q 42 68 42 82 Q 42 97 60 100 L 80 100`} {...LINE} />
      <ArrowHead x={78} y={100} angle={0} />
      <text x={28} y={99} {...LABEL}>standing line</text>
      <text x={150} y={210} {...CAPTION}>Wrap tag around standing line above knot</text>
      <text x={150} y={223} {...SUBCAP}>(3–6 times depending on line weight)</text>
    </g>
  )
}

function FloridaStep5() {
  const hx = 150, hy = 75
  return (
    <g>
      <FishHook x={hx} y={hy} />
      {/* Overhand knot with wraps */}
      <path d={`M 95 130 Q 75 130 70 118 Q 65 102 80 98 Q 100 93 108 110 Q 116 128 100 138 L 80 138`} {...LINE} />
      <line x1={95} y1={130} x2={30} y2={105} {...LINE} />
      {/* Wraps depicted */}
      {[0, 1, 2].map(i => (
        <ellipse key={i} cx={58 + i * 12} cy={100} rx={5} ry={9} {...LINE} strokeWidth={2} />
      ))}
      {/* Tag going back through overhand knot */}
      <path d={`M 90 92 Q 96 88 103 94`} {...LINE} />
      <ArrowHead x={103} y={95} angle={30} />
      <text x={28} y={99} {...LABEL}>standing line</text>
      <text x={150} y={210} {...CAPTION}>Pass tag back through overhand knot again</text>
      <text x={150} y={223} {...SUBCAP}>(same direction as before)</text>
    </g>
  )
}

function FloridaStep6() {
  const hx = 150, hy = 100
  return (
    <g>
      <FishHook x={hx} y={hy} />
      {/* Loop at hook eye — free-hanging loop */}
      <path d={`M ${hx} ${hy} Q ${hx - 22} ${hy - 10} ${hx - 18} ${hy - 30} Q ${hx - 12} ${hy - 48} ${hx} ${hy - 45} Q ${hx + 12} ${hy - 48} ${hx + 18} ${hy - 30} Q ${hx + 22} ${hy - 10} ${hx} ${hy}`} {...LINE} />
      {/* Standing line going up */}
      <line x1={hx} y1={hy - 45} x2={hx} y2={40} {...LINE} />
      {/* Short tag */}
      <line x1={hx + 18} y1={hy - 28} x2={hx + 38} y2={hy - 40} {...LINE} />
      <line x1={hx + 35} y1={hy - 43} x2={hx + 41} y2={hy - 36} stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round" />
      <text x={hx + 43} y={hy - 34} {...LABEL} fill="#94a3b8">trim</text>
      {/* Loop size annotation */}
      <line x1={hx - 22} y1={hy - 10} x2={hx + 22} y2={hy - 10} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2" />
      <text x={hx + 26} y={hy - 6} {...LABEL} fill="#94a3b8">¼–½"</text>
      <text x={hx + 8} y={36} {...LABEL}>standing line</text>
      <Checkmark cx={150} cy={208} />
      <text x={150} y={230} {...CAPTION}>Fixed loop — lure swings freely</text>
    </g>
  )
}

// ─── SNELL KNOT ──────────────────────────────────────────────────────────────

// Wider hook for snell (prominent shank for wraps)
function SnellHook({ x, y }: { x: number; y: number }) {
  const shankLen = 70, bendR = 16
  const shankBot = y + shankLen
  const pointX = x - bendR + 3, pointY = shankBot - bendR + 2
  return (
    <g>
      <circle cx={x} cy={y} r={5} {...HOOK} />
      <line x1={x} y1={y + 5} x2={x} y2={shankBot} {...HOOK} />
      <path d={`M ${x} ${shankBot} A ${bendR} ${bendR} 0 0 1 ${pointX} ${pointY}`} {...HOOK} />
      <path d={`M ${pointX} ${pointY} l -5 5`} {...HOOK} />
    </g>
  )
}

function SnellStep1() {
  const hx = 150, hy = 45
  return (
    <g>
      <SnellHook x={hx} y={hy} />
      {/* Line from left, through eye from front (point side) */}
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      <line x1={hx + 5} y1={hy} x2={230} y2={hy} {...LINE} />
      {/* Tag end goes down alongside shank */}
      <path d={`M 230 ${hy} Q 240 ${hy} 240 ${hy + 12} Q 240 ${hy + 24} 230 ${hy + 24} L ${hx + 6} ${hy + 24}`} {...LINE} />
      <ArrowHead x={hx + 6} y={hy + 24} angle={180} />
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <text x={165} y={hy + 38} {...LABEL}>tag end</text>
      <text x={150} y={200} {...CAPTION}>Thread eye from point side, leave tag</text>
    </g>
  )
}

function SnellStep2() {
  const hx = 150, hy = 45
  return (
    <g>
      <SnellHook x={hx} y={hy} />
      {/* Standing line left */}
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {/* Tag end folded back alongside shank, forming a loop */}
      <path d={`M ${hx + 5} ${hy} Q ${hx + 30} ${hy} ${hx + 30} ${hy + 18} L ${hx + 30} ${hy + 60} Q ${hx + 30} ${hy + 70} ${hx + 20} ${hy + 70} Q ${hx + 10} ${hy + 70} ${hx + 8} ${hy + 60} L ${hx + 8} ${hy + 10}`} {...LINE} strokeDasharray="5 3" opacity={0.65} />
      {/* Loop indicator */}
      <ArrowHead x={hx + 9} y={hy + 14} angle={-80} />
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <text x={hx + 33} y={hy + 40} {...LABEL}>tag forms loop</text>
      <text x={hx + 33} y={hy + 52} {...LABEL}>alongside shank</text>
      <text x={150} y={200} {...CAPTION}>Bring tag back alongside shank, form loop</text>
    </g>
  )
}

function SnellStep3() {
  const hx = 150, hy = 45
  const wrapCount = 7, wrapSpacing = 8
  return (
    <g>
      <SnellHook x={hx} y={hy} />
      {/* Standing line */}
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {/* Wraps spiraling down the shank toward the eye (top) */}
      {Array.from({ length: wrapCount }).map((_, i) => (
        <ellipse
          key={i}
          cx={hx}
          cy={hy + 12 + i * wrapSpacing}
          rx={8}
          ry={wrapSpacing * 0.4}
          {...LINE}
          strokeWidth={2.5}
        />
      ))}
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <text x={hx + 18} y={hy + 12 + 3 * wrapSpacing} {...LABEL}>7 tight wraps</text>
      <text x={150} y={200} {...CAPTION}>Wrap tightly around shank + loop 7×</text>
      <text x={150} y={213} {...SUBCAP}>(work toward the eye)</text>
    </g>
  )
}

function SnellStep4() {
  const hx = 150, hy = 45
  const wrapCount = 7, wrapSpacing = 8
  return (
    <g>
      <SnellHook x={hx} y={hy} />
      {/* Standing line */}
      <line x1={30} y1={hy} x2={hx - 5} y2={hy} {...LINE} />
      {/* Wraps */}
      {Array.from({ length: wrapCount }).map((_, i) => (
        <ellipse key={i} cx={hx} cy={hy + 12 + i * wrapSpacing} rx={8} ry={wrapSpacing * 0.4} {...LINE} strokeWidth={2.5} />
      ))}
      {/* Tag end pulling through the loop at the eye end */}
      <path d={`M ${hx + 8} ${hy + 12 + (wrapCount - 1) * wrapSpacing} Q ${hx + 30} ${hy + 68} ${hx + 10} ${hy - 2}`} {...LINE} />
      <ArrowHead x={hx + 10} y={hy + 1} angle={-70} />
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <text x={hx + 33} y={hy + 60} {...LABEL}>pull tag through</text>
      <text x={hx + 33} y={hy + 72} {...LABEL}>loop at eye</text>
      <text x={150} y={200} {...CAPTION}>Pull tag end through loop at eye</text>
    </g>
  )
}

function SnellStep5() {
  const hx = 150, hy = 45
  const wrapCount = 7, wrapSpacing = 8
  return (
    <g>
      <SnellHook x={hx} y={hy} />
      {/* Neat tight wraps along shank */}
      {Array.from({ length: wrapCount }).map((_, i) => (
        <ellipse key={i} cx={hx} cy={hy + 10 + i * wrapSpacing} rx={7} ry={wrapSpacing * 0.38} {...LINE} strokeWidth={2.5} />
      ))}
      {/* Standing line exiting from eye toward left */}
      <line x1={hx - 5} y1={hy} x2={30} y2={hy} {...LINE} />
      {/* Short trimmed tag above eye */}
      <line x1={hx + 5} y1={hy - 2} x2={hx + 24} y2={hy - 14} {...LINE} />
      <line x1={hx + 21} y1={hy - 17} x2={hx + 27} y2={hy - 10} stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round" />
      <text x={hx + 30} y={hy - 8} {...LABEL} fill="#94a3b8">trim</text>
      <text x={32} y={hy - 8} {...LABEL}>standing line</text>
      <Checkmark cx={150} cy={198} />
      <text x={150} y={220} {...CAPTION}>Finished — wraps along shank,</text>
      <text x={150} y={233} {...CAPTION}>line exits from eye</text>
    </g>
  )
}

// ─── Step map ─────────────────────────────────────────────────────────────────

const KNOT_STEPS: Record<string, { label: string; Illustration: () => React.ReactElement }[]> = {
  'palomar-knot': [
    { label: 'Thread doubled line through eye',  Illustration: PalomarStep1 },
    { label: 'Tie loose overhand knot',          Illustration: PalomarStep2 },
    { label: 'Pass loop over entire hook',       Illustration: PalomarStep3 },
    { label: 'Tighten — moisten first',          Illustration: PalomarStep4 },
    { label: 'Finished knot',                    Illustration: PalomarStep5 },
  ],
  'improved-clinch-knot': [
    { label: 'Thread line through eye',          Illustration: ClinchStep1 },
    { label: 'Wrap tag end 5 times',             Illustration: ClinchStep2 },
    { label: 'Through small loop above eye',     Illustration: ClinchStep3 },
    { label: 'Through large loop (improved tuck)', Illustration: ClinchStep4 },
    { label: 'Tighten — moisten first',          Illustration: ClinchStep5 },
    { label: 'Finished knot',                    Illustration: ClinchStep6 },
  ],
  'uni-knot': [
    { label: 'Thread eye, double tag back',      Illustration: UniStep1 },
    { label: 'Form loop over both lines',        Illustration: UniStep2 },
    { label: 'Wrap tag through loop 4–6×',       Illustration: UniStep3 },
    { label: 'Pull standing line to slide knot', Illustration: UniStep4 },
    { label: 'Seat knot against eye',            Illustration: UniStep5 },
    { label: 'Finished knot',                    Illustration: UniStep6 },
  ],
  'florida-loop-knot': [
    { label: 'Tie loose overhand knot',          Illustration: FloridaStep1 },
    { label: 'Tag end through hook eye',         Illustration: FloridaStep2 },
    { label: 'Tag back through overhand knot',   Illustration: FloridaStep3 },
    { label: 'Wrap around standing line',        Illustration: FloridaStep4 },
    { label: 'Tag through overhand knot again',  Illustration: FloridaStep5 },
    { label: 'Finished loop knot',               Illustration: FloridaStep6 },
  ],
  'snell-knot': [
    { label: 'Thread eye from point side',       Illustration: SnellStep1 },
    { label: 'Bring tag back alongside shank',   Illustration: SnellStep2 },
    { label: 'Wrap 7× around shank and loop',    Illustration: SnellStep3 },
    { label: 'Pull tag through loop at eye',     Illustration: SnellStep4 },
    { label: 'Finished snell',                   Illustration: SnellStep5 },
  ],
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KnotAnimation({ knotSlug }: Props) {
  const [step, setStep] = useState(0)

  const steps = KNOT_STEPS[knotSlug]
  if (!steps) return null

  const total = steps.length
  const { Illustration } = steps[step]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 pt-4 pb-1 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Step-by-step</p>
        <span className="text-xs text-gray-400 tabular-nums">{step + 1} / {total}</span>
      </div>

      <div className="px-4 pb-3">
        <p className="text-sm font-medium text-gray-700">{steps[step].label}</p>
      </div>

      <div className="px-4">
        <svg
          viewBox="0 0 300 250"
          width="100%"
          className="rounded-xl border border-gray-50"
          style={{ display: 'block', background: '#fff' }}
        >
          <Illustration />
        </svg>
      </div>

      <div className="flex justify-center gap-1.5 py-3">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-teal-600' : 'bg-gray-200'}`}
            aria-label={`Step ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex gap-3 px-4 pb-4">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-30 transition-opacity"
        >
          ← Previous
        </button>
        <button
          onClick={() => setStep(s => Math.min(total - 1, s + 1))}
          disabled={step === total - 1}
          className="flex-1 py-2.5 rounded-xl bg-teal-600 text-sm font-medium text-white disabled:opacity-30 active:bg-teal-700 transition-opacity"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
