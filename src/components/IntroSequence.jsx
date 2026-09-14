import { useCallback, useEffect, useRef, useState } from 'react'

const TOTAL_MS = 3900
const WIPE_AT_MS = 3200

// Gotham skyline: deterministic building heights so it never changes between renders
const SKYLINE = Array.from({ length: 34 }, (_, i) => {
  const seed = Math.sin(i * 12.9898) * 43758.5453
  const h = 18 + Math.abs(seed - Math.floor(seed)) * 70
  const w = 14 + (i % 4) * 6
  return { x: i * 30, w, h }
})

function Batmobile() {
  return (
    <svg className="bm" viewBox="0 0 640 130" aria-hidden="true">
      <defs>
        <linearGradient id="bm-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2c48" />
          <stop offset="1" stopColor="#07070c" />
        </linearGradient>
        <linearGradient id="bm-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F5C518" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F5C518" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bm-flame">
          <stop offset="0" stopColor="#fff2b0" />
          <stop offset="0.45" stopColor="#F5C518" />
          <stop offset="1" stopColor="#F5C518" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* headlight beam */}
      <polygon className="bm-beam" points="398,62 640,4 640,130 398,90" fill="url(#bm-beam)" />

      {/* jet exhaust */}
      <ellipse className="bm-flame" cx="16" cy="72" rx="30" ry="9" fill="url(#bm-flame)" />

      {/* rear fins */}
      <path d="M44 68 L56 12 L82 64 Z" fill="url(#bm-body)" />
      <path d="M66 66 L88 24 L108 62 Z" fill="#12121c" />

      {/* body */}
      <path
        d="M24 80 L36 64 L112 58 L152 46 Q192 26 242 30 L292 34 Q334 38 374 60 L402 68 Q412 74 404 84 L394 92 L42 92 Q24 92 24 80 Z"
        fill="url(#bm-body)"
        stroke="#3a3a56"
        strokeWidth="1.2"
      />
      {/* canopy */}
      <path d="M154 48 Q188 24 250 30 L272 36 Q232 30 192 42 Q172 48 164 52 Z" fill="#0b0b14" />
      <path d="M178 41 Q208 31 248 34" stroke="#F5C518" strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      {/* accent line */}
      <path d="M60 84 L392 84" stroke="#F5C518" strokeWidth="1.2" strokeOpacity="0.35" />

      {/* wheels */}
      {[98, 338].map((cx) => (
        <g key={cx} className="bm-wheel" style={{ transformOrigin: `${cx}px 92px` }}>
          <circle cx={cx} cy="92" r="22" fill="#0a0a12" />
          <path
            d={`M${cx} 72 V112 M${cx - 20} 92 H${cx + 20} M${cx - 14} 78 L${cx + 14} 106 M${cx + 14} 78 L${cx - 14} 106`}
            stroke="#2e2e42"
            strokeWidth="2"
          />
          <circle cx={cx} cy="92" r="8" fill="none" stroke="#F5C518" strokeWidth="2" strokeOpacity="0.75" />
          <circle cx={cx} cy="92" r="22" fill="none" stroke="#050509" strokeWidth="7" />
        </g>
      ))}
    </svg>
  )
}

function IntroSequence({ onDone }) {
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)
  const timersRef = useRef([])

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    onDone()
  }, [onDone])

  // Skip: start the wipe immediately, then finish
  const skip = useCallback(() => {
    if (doneRef.current) return
    timersRef.current.forEach(clearTimeout)
    setLeaving(true)
    timersRef.current = [setTimeout(finish, 450)]
  }, [finish])

  useEffect(() => {
    timersRef.current = [
      setTimeout(() => setLeaving(true), WIPE_AT_MS),
      setTimeout(finish, TOTAL_MS),
    ]
    const onKey = (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip() }
    window.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      timersRef.current.forEach(clearTimeout)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [finish, skip])

  return (
    <div className={`intro ${leaving ? 'leaving' : ''}`} onClick={skip} role="presentation">
      <div className="intro-wordmark">Ujjwal Verma</div>

      {/* Bat-Signal in the sky */}
      <div className="intro-signal" aria-hidden="true">
        <svg viewBox="0 0 200 100">
          <path d="M100 30 L104 15 L108 32 C126 24 164 22 198 30 Q180 40 166 66 Q148 56 132 76 Q114 68 100 92 Q86 68 68 76 Q52 56 34 66 Q20 40 2 30 C36 22 74 24 92 32 L96 15 Z" />
        </svg>
      </div>

      {/* skyline */}
      <svg className="intro-skyline" viewBox="0 0 1020 100" preserveAspectRatio="none" aria-hidden="true">
        {SKYLINE.map((b, i) => (
          <rect key={i} x={b.x} y={100 - b.h} width={b.w} height={b.h} />
        ))}
      </svg>

      {/* speed lines during the approach */}
      <div className="intro-speed" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ top: `${38 + i * 6}%`, animationDelay: `${i * 0.07}s` }} />
        ))}
      </div>

      {/* stage: skid marks + smoke + car share one coordinate system */}
      <div className="intro-stage" aria-hidden="true">
        <div className="intro-skid intro-skid-a" />
        <div className="intro-skid intro-skid-b" />
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="intro-smoke" style={{ animationDelay: `${1.5 + i * 0.09}s` }} />
        ))}
        <div className="intro-car">
          <Batmobile />
        </div>
      </div>

      <div className="intro-ground" aria-hidden="true" />

      <button className="intro-skip" type="button" onClick={(e) => { e.stopPropagation(); skip() }}>
        skip intro →
      </button>
    </div>
  )
}

export default IntroSequence
