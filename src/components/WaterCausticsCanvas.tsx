import { useEffect, useRef, useState } from 'react'

// ── Constants ─────────────────────────────────────────────────────────────────

// Render 1 sample per TILE×TILE block; drawImage scales it up with smoothing.
// Caustics don't need pixel precision — soft upscaling looks natural.
const TILE    = 4
const FADE_MS = 800

// Five sinusoidal wave components.
// Each frame: value[px,py] += sin(px*xf + t*xs + ph) * sin(py*yf + t*ys + ph)
// xs/ys are in radians/second at 60 fps — slow values give 8-15 second cycles.
const WAVES = [
  { xf: 0.030, yf: 0.038, xs:  0.18, ys:  0.12, ph: 0.0 },
  { xf: 0.025, yf: 0.032, xs: -0.09, ys:  0.22, ph: 1.7 },
  { xf: 0.055, yf: 0.048, xs:  0.28, ys: -0.19, ph: 3.2 },
  { xf: 0.048, yf: 0.062, xs: -0.21, ys: -0.15, ph: 4.8 },
  { xf: 0.072, yf: 0.065, xs:  0.38, ys:  0.31, ph: 0.9 },
] as const

// Color range centered near #FAFAFA (250,250,250):
//   trough (v=-1)  → rgb(238, 241, 245) — cool barely-darker
//   mid    (v= 0)  → rgb(247, 248, 250) — close to background
//   peak   (v=+1)  → rgb(255, 255, 255) — bright white shimmer with faint blue tint
const R_BASE = 238, R_RANGE = 17
const G_BASE = 241, G_RANGE = 14
const B_BASE = 245, B_RANGE = 10

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { visible: boolean }

export default function WaterCausticsCanvas({ visible }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef(0)
  const runningRef = useRef(false)
  const tickRef    = useRef<((now: number) => void) | null>(null)

  const [opacity, setOpacity] = useState(visible ? 1 : 0)

  // ── Canvas resize ─────────────────────────────────────────────────────────
  useEffect(() => {
    function resize() {
      const c = canvasRef.current
      if (!c) return
      c.width  = window.innerWidth
      c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── Single animation loop ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Small off-screen buffer rendered at 1/TILE resolution, then scaled up
    const buf  = document.createElement('canvas')
    const bctx = buf.getContext('2d')
    if (!bctx) return

    let lastTime = performance.now()
    let t = 0

    function tick(now: number) {
      if (!runningRef.current) return

      const dt = Math.min((now - lastTime) / 1000, 0.05) // cap for tab-hidden resume
      lastTime = now
      t += dt

      const w    = canvas!.width
      const h    = canvas!.height
      const cols = Math.ceil(w / TILE)
      const rows = Math.ceil(h / TILE)

      // Resize buf only when canvas dimensions change
      if (buf.width !== cols || buf.height !== rows) {
        buf.width  = cols
        buf.height = rows
      }

      const img  = bctx.createImageData(cols, rows)
      const data = img.data

      for (let row = 0; row < rows; row++) {
        const py = row * TILE
        for (let col = 0; col < cols; col++) {
          const px = col * TILE

          // Interference of 5 sine waves → organic caustic pattern
          let v = 0
          for (const wave of WAVES) {
            v += Math.sin(px * wave.xf + t * wave.xs + wave.ph) *
                 Math.sin(py * wave.yf + t * wave.ys + wave.ph)
          }
          v /= WAVES.length // ≈ [-1, 1]

          const bright = (v + 1) * 0.5 // [0, 1]
          const i = (row * cols + col) * 4
          data[i]     = R_BASE + Math.round(bright * R_RANGE)
          data[i + 1] = G_BASE + Math.round(bright * G_RANGE)
          data[i + 2] = B_BASE + Math.round(bright * B_RANGE)
          data[i + 3] = 255
        }
      }

      bctx.putImageData(img, 0, 0)
      // drawImage with smoothing on (default) softens the 4× upscale naturally
      ctx!.drawImage(buf, 0, 0, w, h)

      rafRef.current = requestAnimationFrame(tick)
    }

    tickRef.current = tick

    // Pause RAF when tab is hidden — resume on return
    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
      } else if (runningRef.current) {
        lastTime = performance.now() // reset to avoid large dt spike on resume
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
      const timer = setTimeout(() => {
        runningRef.current = false
        cancelAnimationFrame(rafRef.current)
        const c = canvasRef.current
        c?.getContext('2d')?.clearRect(0, 0, c.width, c.height)
      }, FADE_MS)
      return () => clearTimeout(timer)
    } else if (!runningRef.current && tickRef.current) {
      // Restart loop if it was previously paused (e.g. switching from saltwater)
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
        zIndex:        0,        // above body background, below Layout z-[1]
        pointerEvents: 'none',
        opacity,
        transition:    `opacity ${FADE_MS}ms ease`,
      }}
      aria-hidden="true"
    />
  )
}
