import { useEffect, useRef, useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface MistBlob {
  x: number
  y: number
  vx: number             // horizontal drift — very slow
  vy: number             // vertical drift — even slower
  radiusX: number        // ellipse half-width
  radiusY: number        // ellipse half-height
  rotation: number       // current rotation angle (radians)
  rotationSpeed: number  // radians per frame — near-zero
  alpha: number          // current opacity
  alphaTarget: number    // lerp target — shifts slowly for breathing effect
  alphaSpeed: number     // lerp rate
  phase: number          // sine-wave offset for gentle lateral wander
  phaseSpeed: number     // how fast the wander cycles
}

const FADE_DURATION_MS = 800

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

// Spawn a new blob at a random position on screen (randomPos=true) or
// drifting in from the left/right edge (randomPos=false).
function createBlob(w: number, h: number, randomPos = true): MistBlob {
  const vx  = randomBetween(0.06, 0.18) * (Math.random() < 0.5 ? 1 : -1)
  const fromLeft = vx > 0
  const x = randomPos
    ? randomBetween(-200, w + 200)
    : fromLeft ? randomBetween(-420, -160) : randomBetween(w + 160, w + 420)

  return {
    x,
    y:             randomBetween(h * 0.1, h * 0.9),
    vx,
    vy:            randomBetween(0.015, 0.06) * (Math.random() < 0.5 ? 1 : -1),
    radiusX:       randomBetween(200, 400),
    radiusY:       randomBetween(110, 230),
    rotation:      randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.00025, 0.00025),
    alpha:         0,
    alphaTarget:   randomBetween(0.04, 0.08),
    alphaSpeed:    randomBetween(0.0006, 0.002),
    phase:         randomBetween(0, Math.PI * 2),
    phaseSpeed:    randomBetween(0.0006, 0.002),
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean
}

export default function MorningMistCanvas({ visible }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const blobsRef    = useRef<MistBlob[]>([])
  const rafRef      = useRef<number>(0)
  const runningRef  = useRef(false)
  const [cssOpacity, setCssOpacity] = useState(0)

  // ── Resize handler ──────────────────────────────────────────────────────────
  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      if (blobsRef.current.length === 0) {
        const count = Math.floor(randomBetween(5, 9))
        blobsRef.current = Array.from({ length: count }, () =>
          createBlob(canvas.width, canvas.height, true)
        )
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── Animation loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function drawBlob(blob: MistBlob) {
      const { x, y, radiusX, radiusY, rotation, alpha } = blob
      if (alpha < 0.002) return

      ctx!.save()
      ctx!.translate(x, y)
      ctx!.rotate(rotation)
      ctx!.scale(radiusX, radiusY)

      // Radial gradient in unit-circle space; outer edge is fully transparent
      const grad = ctx!.createRadialGradient(0, 0, 0, 0, 0, 1)
      grad.addColorStop(0,    `rgba(240, 244, 248, ${alpha})`)
      grad.addColorStop(0.35, `rgba(240, 244, 248, ${alpha * 0.72})`)
      grad.addColorStop(0.7,  `rgba(240, 244, 248, ${alpha * 0.28})`)
      grad.addColorStop(1,    `rgba(240, 244, 248, 0)`)

      ctx!.fillStyle = grad
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
        // ── Drift ──
        b.phase += b.phaseSpeed
        b.x += b.vx + Math.sin(b.phase) * 0.12
        b.y += b.vy
        b.rotation += b.rotationSpeed

        // Gently push y back toward middle if it wanders to the extremes
        if (b.y < -b.radiusY * 1.5 || b.y > h + b.radiusY * 1.5) {
          b.vy *= -1
        }

        // Respawn on the opposite side when the blob has fully drifted off-screen
        const offLeft  = b.x < -b.radiusX * 2.5
        const offRight = b.x > w + b.radiusX * 2.5
        if (offLeft || offRight) {
          Object.assign(b, createBlob(w, h, false))
          if (offLeft)  b.vx = Math.abs(b.vx)   // enter from left
          if (offRight) b.vx = -Math.abs(b.vx)  // enter from right
        }

        // ── Alpha breathe ──
        b.alpha += (b.alphaTarget - b.alpha) * b.alphaSpeed
        // Occasionally shift the alpha target so mist patches feel alive
        if (Math.random() < 0.0015) {
          b.alphaTarget = randomBetween(0.03, 0.085)
        }

        drawBlob(b)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    runningRef.current = true
    rafRef.current = requestAnimationFrame(tick)

    // Pause when tab is hidden
    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
      } else if (runningRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      runningRef.current = false
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  // ── Show / hide with CSS fade ───────────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      setCssOpacity(1)
      if (!runningRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        runningRef.current = true

        function drawBlob(blob: MistBlob) {
          const { x, y, radiusX, radiusY, rotation, alpha } = blob
          if (alpha < 0.002) return
          ctx!.save()
          ctx!.translate(x, y)
          ctx!.rotate(rotation)
          ctx!.scale(radiusX, radiusY)
          const grad = ctx!.createRadialGradient(0, 0, 0, 0, 0, 1)
          grad.addColorStop(0,    `rgba(240, 244, 248, ${alpha})`)
          grad.addColorStop(0.35, `rgba(240, 244, 248, ${alpha * 0.72})`)
          grad.addColorStop(0.7,  `rgba(240, 244, 248, ${alpha * 0.28})`)
          grad.addColorStop(1,    `rgba(240, 244, 248, 0)`)
          ctx!.fillStyle = grad
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
            b.phase += b.phaseSpeed
            b.x += b.vx + Math.sin(b.phase) * 0.12
            b.y += b.vy
            b.rotation += b.rotationSpeed
            if (b.y < -b.radiusY * 1.5 || b.y > h + b.radiusY * 1.5) b.vy *= -1
            const offLeft  = b.x < -b.radiusX * 2.5
            const offRight = b.x > w + b.radiusX * 2.5
            if (offLeft || offRight) {
              Object.assign(b, createBlob(w, h, false))
              if (offLeft)  b.vx = Math.abs(b.vx)
              if (offRight) b.vx = -Math.abs(b.vx)
            }
            b.alpha += (b.alphaTarget - b.alpha) * b.alphaSpeed
            if (Math.random() < 0.0015) b.alphaTarget = randomBetween(0.03, 0.085)
            drawBlob(b)
          }
          rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
      }
    } else {
      setCssOpacity(0)
      const t = setTimeout(() => {
        runningRef.current = false
        cancelAnimationFrame(rafRef.current)
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      }, FADE_DURATION_MS)
      return () => clearTimeout(t)
    }
  }, [visible])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: cssOpacity,
        transition: `opacity ${FADE_DURATION_MS}ms ease`,
      }}
      aria-hidden="true"
    />
  )
}
