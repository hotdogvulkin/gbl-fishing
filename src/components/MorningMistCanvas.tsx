import { useEffect, useRef, useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface MistBlob {
  x: number; y: number
  vx: number; vy: number
  radiusX: number; radiusY: number
  rotation: number; rotationSpeed: number
  alpha: number; alphaTarget: number; alphaSpeed: number
  phase: number; phaseSpeed: number
}

// DIAGNOSTIC: bright blue at high opacity — if this is invisible, canvas is not rendering at all.
// Revert to '170, 195, 220' once confirmed visible.
const BLOB_COLOR = '0, 100, 255'
const FADE_MS    = 800

function rand(a: number, b: number) { return a + Math.random() * (b - a) }

function makeBlob(w: number, h: number, fromEdge = false): MistBlob {
  const vx = rand(0.06, 0.18) * (Math.random() < 0.5 ? 1 : -1)
  return {
    x:             fromEdge
                     ? (vx > 0 ? rand(-420, -160) : rand(w + 160, w + 420))
                     : rand(-100, w + 100),
    y:             rand(h * 0.05, h * 0.95),
    vx,
    vy:            rand(0.015, 0.06) * (Math.random() < 0.5 ? 1 : -1),
    radiusX:       rand(180, 380),
    radiusY:       rand(100, 220),
    rotation:      rand(0, Math.PI * 2),
    rotationSpeed: rand(-0.0003, 0.0003),
    alpha:         0,
    alphaTarget:   rand(0.45, 0.55),   // DIAGNOSTIC: high opacity — revert to rand(0.08, 0.18)
    alphaSpeed:    rand(0.004, 0.010), // reaches target in ~1–3 s at 60fps
    phase:         rand(0, Math.PI * 2),
    phaseSpeed:    rand(0.0006, 0.002),
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { visible: boolean }

export default function MorningMistCanvas({ visible }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const blobsRef   = useRef<MistBlob[]>([])
  const rafRef     = useRef(0)
  const runningRef = useRef(false)
  // Store tick so the show/hide effect can restart the loop without
  // duplicating the entire draw logic.
  const tickRef    = useRef<(() => void) | null>(null)

  // Initialize from the current visible prop so freshwater mode starts
  // at full opacity immediately — no flash-in on first render.
  const [opacity, setOpacity] = useState(visible ? 1 : 0)

  // ── Canvas setup: resize handler + initial blob seeding ──────────────────
  useEffect(() => {
    function resize() {
      const c = canvasRef.current
      if (!c) return
      c.width  = window.innerWidth
      c.height = window.innerHeight
      if (!blobsRef.current.length) {
        blobsRef.current = Array.from(
          { length: Math.floor(rand(5, 9)) },
          () => makeBlob(c.width, c.height)
        )
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── Single animation loop — started on mount, stopped on unmount ──────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function drawBlob(b: MistBlob) {
      if (b.alpha < 0.005) return
      ctx!.save()
      ctx!.translate(b.x, b.y)
      ctx!.rotate(b.rotation)
      ctx!.scale(b.radiusX, b.radiusY)
      // Gradient defined in scaled unit-circle space → renders as soft ellipse
      const g = ctx!.createRadialGradient(0, 0, 0, 0, 0, 1)
      g.addColorStop(0,    `rgba(${BLOB_COLOR}, ${b.alpha})`)
      g.addColorStop(0.35, `rgba(${BLOB_COLOR}, ${+(b.alpha * 0.6).toFixed(4)})`)
      g.addColorStop(0.7,  `rgba(${BLOB_COLOR}, ${+(b.alpha * 0.25).toFixed(4)})`)
      g.addColorStop(1,    `rgba(${BLOB_COLOR}, 0)`)
      ctx!.fillStyle = g
      ctx!.beginPath()
      ctx!.arc(0, 0, 1, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.restore()
    }

    function tick() {
      if (!runningRef.current) return
      const w = canvas!.width
      const h = canvas!.height
      ctx!.clearRect(0, 0, w, h)

      for (const b of blobsRef.current) {
        b.phase    += b.phaseSpeed
        b.x        += b.vx + Math.sin(b.phase) * 0.12
        b.y        += b.vy
        b.rotation += b.rotationSpeed

        // Gently bounce if blob wanders off the vertical edges
        if (b.y < -b.radiusY * 1.5 || b.y > h + b.radiusY * 1.5) b.vy *= -1

        // Respawn from the opposite edge when fully off-screen horizontally
        if (b.x < -b.radiusX * 2.5 || b.x > w + b.radiusX * 2.5) {
          const wasLeft = b.x < 0
          Object.assign(b, makeBlob(w, h, true))
          b.vx = wasLeft ? Math.abs(b.vx) : -Math.abs(b.vx)
        }

        // Alpha breathe
        b.alpha += (b.alphaTarget - b.alpha) * b.alphaSpeed
        if (Math.random() < 0.002) b.alphaTarget = rand(0.06, 0.18)

        drawBlob(b)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    // Expose tick for the show/hide effect's restart path
    tickRef.current = tick

    // Page visibility API — pause RAF when tab is hidden
    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
      } else if (runningRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    runningRef.current = true
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      runningRef.current = false
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  // ── Show / hide: CSS opacity fade + pause loop when invisible ─────────────
  useEffect(() => {
    setOpacity(visible ? 1 : 0)

    if (!visible) {
      // Stop drawing after the CSS fade completes — saves CPU
      const t = setTimeout(() => {
        runningRef.current = false
        cancelAnimationFrame(rafRef.current)
        const c = canvasRef.current
        c?.getContext('2d')?.clearRect(0, 0, c.width, c.height)
      }, FADE_MS)
      return () => clearTimeout(t)
    } else if (!runningRef.current && tickRef.current) {
      // Restart if the loop was previously stopped (e.g. switching from saltwater)
      runningRef.current = true
      rafRef.current = requestAnimationFrame(tickRef.current)
    }
  }, [visible])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100%',
        height:        '100%',
        zIndex:        0,        // above body background (z:auto), below Layout z-[1]
        pointerEvents: 'none',
        opacity,
        transition:    `opacity ${FADE_MS}ms ease`,
      }}
      aria-hidden="true"
    />
  )
}
