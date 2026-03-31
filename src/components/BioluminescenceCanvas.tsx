import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vy: number          // upward speed (px/frame)
  vx: number          // horizontal drift (px/frame)
  phase: number       // offset for sine-wave side wobble
  phaseSpeed: number  // how fast the wobble cycles
  radius: number
  color: string
  alpha: number       // current opacity
  alphaTarget: number // lerp target — changes slowly for fade in/out
  alphaSpeed: number  // lerp rate
  pulseProgress: number // 1 → 0 during a pulse; 0 = inactive
  pulseChance: number   // per-frame probability of triggering a pulse
}

const COLORS = ['#00ffcc', '#00e5ff', '#7df9ff', '#00ff9f']
const FADE_DURATION_MS = 500

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function createParticle(w: number, h: number, randomY = true): Particle {
  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : h + randomBetween(5, 30),
    vy: randomBetween(0.18, 0.55),
    vx: randomBetween(-0.12, 0.12),
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: randomBetween(0.005, 0.018),
    radius: randomBetween(1, 2.8),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 0,
    alphaTarget: randomBetween(0.04, 0.28),
    alphaSpeed: randomBetween(0.004, 0.014),
    pulseProgress: 0,
    pulseChance: randomBetween(0.0003, 0.0012),
  }
}

interface Props {
  visible: boolean
}

export default function BioluminescenceCanvas({ visible }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const runningRef = useRef(false)
  const [cssOpacity, setCssOpacity] = useState(0)

  // ── Resize handler ──────────────────────────────────────────────────────────
  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      // Re-seed particles if they haven't been created yet
      if (particlesRef.current.length === 0) {
        const count = Math.floor(randomBetween(80, 121))
        particlesRef.current = Array.from({ length: count }, () =>
          createParticle(canvas.width, canvas.height, true)
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

    function tick() {
      if (!runningRef.current) return

      const w = canvas!.width
      const h = canvas!.height
      ctx!.clearRect(0, 0, w, h)

      for (const p of particlesRef.current) {
        // ── Update position ──
        p.phase += p.phaseSpeed
        p.y -= p.vy
        p.x += p.vx + Math.sin(p.phase) * 0.25

        // Respawn at bottom when off the top
        if (p.y < -p.radius - 4) {
          Object.assign(p, createParticle(w, h, false))
        }

        // ── Alpha fade in/out ──
        p.alpha += (p.alphaTarget - p.alpha) * p.alphaSpeed
        // Randomly shift the target so particles breathe independently
        if (Math.random() < 0.004) {
          p.alphaTarget = randomBetween(0.03, 0.28)
        }

        // ── Pulse ──
        if (p.pulseProgress > 0) {
          p.pulseProgress = Math.max(0, p.pulseProgress - 0.012)
        } else if (Math.random() < p.pulseChance) {
          p.pulseProgress = 1.0
        }

        // ── Draw ──
        const displayAlpha = Math.min(1, p.alpha + p.pulseProgress * 0.42)
        if (displayAlpha < 0.005) continue

        ctx!.save()
        ctx!.globalAlpha = displayAlpha
        ctx!.shadowBlur  = p.radius * 5 + p.pulseProgress * 8
        ctx!.shadowColor = p.color
        ctx!.fillStyle   = p.color
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.restore()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    runningRef.current = true
    rafRef.current = requestAnimationFrame(tick)

    // Page Visibility API — pause when tab is hidden
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
  }, []) // animation loop is set up once; visible changes handled separately below

  // ── Show / hide with CSS fade ───────────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      setCssOpacity(1)
      // Restart loop if it was stopped after a previous fade-out
      if (!runningRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        runningRef.current = true

        function tick() {
          if (!runningRef.current) return
          const w = canvas!.width
          const h = canvas!.height
          ctx!.clearRect(0, 0, w, h)
          for (const p of particlesRef.current) {
            p.phase += p.phaseSpeed
            p.y -= p.vy
            p.x += p.vx + Math.sin(p.phase) * 0.25
            if (p.y < -p.radius - 4) Object.assign(p, createParticle(w, h, false))
            p.alpha += (p.alphaTarget - p.alpha) * p.alphaSpeed
            if (Math.random() < 0.004) p.alphaTarget = randomBetween(0.03, 0.28)
            if (p.pulseProgress > 0) p.pulseProgress = Math.max(0, p.pulseProgress - 0.012)
            else if (Math.random() < p.pulseChance) p.pulseProgress = 1.0
            const displayAlpha = Math.min(1, p.alpha + p.pulseProgress * 0.42)
            if (displayAlpha < 0.005) continue
            ctx!.save()
            ctx!.globalAlpha = displayAlpha
            ctx!.shadowBlur  = p.radius * 5 + p.pulseProgress * 8
            ctx!.shadowColor = p.color
            ctx!.fillStyle   = p.color
            ctx!.beginPath()
            ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
            ctx!.fill()
            ctx!.restore()
          }
          rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
      }
    } else {
      setCssOpacity(0)
      // Stop the loop after CSS fade completes
      const t = setTimeout(() => {
        runningRef.current = false
        cancelAnimationFrame(rafRef.current)
        // Clear the canvas so no stale frame is visible if re-enabled
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
