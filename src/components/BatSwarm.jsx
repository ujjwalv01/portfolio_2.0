import { useEffect, useRef } from 'react'
import { BAT_SWARM_EVENT } from '../lib/bats'

const rand = (a, b) => a + Math.random() * (b - a)

/**
 * Draw one bat at the origin, heading along +x.
 * `flap` is the wing angle in radians (-1 … +1 ≈ wings up … wings down).
 * The wings foreshorten with cos(flap) and their tips dip with sin(flap), which is
 * what a flapping bat looks like from slightly above/behind.
 */
function drawBat(ctx, size, flap) {
  const s = size
  const span = s * 2.2
  const fore = Math.cos(flap * 1.25) * 0.85 + 0.15 // wing projected length
  const dip = Math.sin(flap) * s * 0.9              // wingtip up/down

  ctx.beginPath()
  // body (elongated along heading)
  ctx.ellipse(0, 0, s * 0.55, s * 0.28, 0, 0, Math.PI * 2)
  ctx.fill()

  // head + ears
  ctx.beginPath()
  ctx.arc(s * 0.55, 0, s * 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(s * 0.6, -s * 0.14)
  ctx.lineTo(s * 0.82, -s * 0.36)
  ctx.lineTo(s * 0.7, -s * 0.02)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(s * 0.6, s * 0.14)
  ctx.lineTo(s * 0.82, s * 0.36)
  ctx.lineTo(s * 0.7, s * 0.02)
  ctx.closePath()
  ctx.fill()

  // wings: drawn in wing-local space, y is "outward" from the body
  for (const side of [-1, 1]) {
    ctx.save()
    ctx.scale(1, side)
    ctx.beginPath()
    ctx.moveTo(s * 0.2, s * 0.15)
    // leading edge sweeps back to a sharp tip
    ctx.quadraticCurveTo(s * 0.05, span * 0.5 * fore, -s * 0.45 + dip * 0.3, span * fore)
    // trailing edge: three scalloped fingers back to the tail
    ctx.quadraticCurveTo(-s * 0.55, span * 0.78 * fore, -s * 0.9, span * 0.7 * fore)
    ctx.quadraticCurveTo(-s * 0.7, span * 0.5 * fore, -s * 1.05, span * 0.4 * fore)
    ctx.quadraticCurveTo(-s * 0.85, span * 0.22 * fore, -s * 0.7, s * 0.1)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}

function BatSwarm() {
  const canvasRef = useRef(null)
  const batsRef = useRef([])
  const frameRef = useRef(0)
  const lastRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = ({ x, y, mode, theme }) => {
      const count = w < 640 ? 26 : 42
      const color = theme === 'light' ? '#0b0b12' : '#0d0d16'
      const glow = theme === 'light' ? 'rgba(0,0,0,0)' : 'rgba(245,197,24,0.55)'
      const now = performance.now()

      for (let i = 0; i < count; i++) {
        const size = rand(6, 15) * (Math.random() < 0.15 ? 1.6 : 1) // a few big ones
        const speed = rand(420, 900) * (14 / size) ** 0.35           // small bats are quicker
        const delay = rand(0, mode === 'out' ? 380 : 700)

        let sx, sy, tx, ty
        if (mode === 'out') {
          // burst from the toggle; bias the heading toward the screen's open side
          sx = x + rand(-6, 6)
          sy = y + rand(-6, 6)
          const toCenter = Math.atan2(h / 2 - y, w / 2 - x)
          const ang = toCenter + rand(-1.35, 1.35)
          const dist = Math.hypot(w, h) * 1.2
          tx = sx + Math.cos(ang) * dist
          ty = sy + Math.sin(ang) * dist
        } else {
          // start just outside a random edge, fly to the toggle
          const edge = Math.floor(rand(0, 4))
          const m = 80
          if (edge === 0)      { sx = rand(-m, w + m); sy = -m }
          else if (edge === 1) { sx = w + m;           sy = rand(-m, h + m) }
          else if (edge === 2) { sx = rand(-m, w + m); sy = h + m }
          else                 { sx = -m;              sy = rand(-m, h + m) }
          tx = x
          ty = y
        }

        batsRef.current.push({
          x: sx, y: sy, px: sx, py: sy, tx, ty,
          size, speed, color, glow, mode,
          born: now + delay,
          phase: rand(0, Math.PI * 2),
          flapHz: rand(7, 13),
          wobbleAmp: rand(6, 26),
          wobbleHz: rand(0.8, 2.2),
          wobblePhase: rand(0, Math.PI * 2),
          drift: rand(-0.35, 0.35), // gradual curve in the flight path (radians/s)
          heading: Math.atan2(ty - sy, tx - sx),
          alive: true,
        })
      }

      if (!frameRef.current) {
        lastRef.current = now
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    const tick = (now) => {
      const dt = Math.min(0.05, (now - lastRef.current) / 1000)
      lastRef.current = now
      ctx.clearRect(0, 0, w, h)

      const bats = batsRef.current
      for (const b of bats) {
        if (now < b.born) continue
        const age = (now - b.born) / 1000

        // ease in from a standstill so the burst looks like a launch, not a teleport
        const launch = b.mode === 'out' ? Math.min(1, age / 0.25) : 1
        const v = b.speed * (0.25 + 0.75 * launch)

        if (b.mode === 'in') {
          // steer toward the target, keeping some of the curve
          const want = Math.atan2(b.ty - b.y, b.tx - b.x)
          let diff = want - b.heading
          diff = Math.atan2(Math.sin(diff), Math.cos(diff))
          b.heading += diff * Math.min(1, dt * 4)
        } else {
          b.heading += b.drift * dt
        }

        // perpendicular wobble = the jittery, unsteady flight of a real bat
        const wob = Math.sin(age * b.wobbleHz * Math.PI * 2 + b.wobblePhase) * b.wobbleAmp
        const nx = -Math.sin(b.heading)
        const ny = Math.cos(b.heading)

        b.px = b.x
        b.py = b.y
        b.x += Math.cos(b.heading) * v * dt + nx * wob * dt
        b.y += Math.sin(b.heading) * v * dt + ny * wob * dt
        b.phase += dt * b.flapHz * Math.PI * 2

        const margin = 120
        if (b.mode === 'out') {
          if (b.x < -margin || b.x > w + margin || b.y < -margin || b.y > h + margin) b.alive = false
        } else {
          const d = Math.hypot(b.tx - b.x, b.ty - b.y)
          if (d < 18) b.alive = false
          b.fade = Math.min(1, d / 90)
        }
        if (!b.alive) continue

        const flap = Math.sin(b.phase)
        const alpha = b.mode === 'in' ? b.fade ?? 1 : 1

        // motion-blur ghost
        ctx.save()
        ctx.globalAlpha = 0.16 * alpha
        ctx.translate(b.px, b.py)
        ctx.rotate(b.heading)
        ctx.fillStyle = b.color
        drawBat(ctx, b.size, flap)
        ctx.restore()

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(b.x, b.y)
        ctx.rotate(b.heading)
        ctx.fillStyle = b.color
        ctx.shadowColor = b.glow
        ctx.shadowBlur = 8
        drawBat(ctx, b.size, flap)
        ctx.restore()
      }

      batsRef.current = bats.filter((b) => b.alive)
      if (batsRef.current.length) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        frameRef.current = 0
        ctx.clearRect(0, 0, w, h)
      }
    }

    const onSwarm = (e) => spawn(e.detail)
    window.addEventListener(BAT_SWARM_EVENT, onSwarm)

    return () => {
      window.removeEventListener(BAT_SWARM_EVENT, onSwarm)
      window.removeEventListener('resize', resize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="bat-swarm" aria-hidden="true" />
}

export default BatSwarm
