import { useRef, useState, useCallback, useEffect } from 'react'

function AmbientSound() {
  const ctxRef = useRef(null)
  const masterRef = useRef(null)
  const nodesRef = useRef([])
  const [playing, setPlaying] = useState(false)

  const createAudio = useCallback(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx

    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.connect(ctx.destination)
    masterRef.current = master

    // Harmonic pad voices — C major chord spread across octaves
    const voices = [
      { freq: 65.41, type: 'sine', vol: 0.04 },      // C2
      { freq: 98.00, type: 'sine', vol: 0.025 },     // G2
      { freq: 130.81, type: 'sine', vol: 0.03 },     // C3
      { freq: 164.81, type: 'triangle', vol: 0.015 }, // E3
      { freq: 196.00, type: 'sine', vol: 0.02 },     // G3
      { freq: 261.63, type: 'sine', vol: 0.01 },     // C4
    ]

    voices.forEach(({ freq, type, vol }, i) => {
      const osc = ctx.createOscillator()
      osc.type = type
      osc.frequency.value = freq
      osc.detune.value = (i % 2 === 0 ? 1 : -1) * (2 + i * 1.5)

      const gain = ctx.createGain()
      gain.gain.value = vol

      // Slow LFO for gentle volume drift
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.03 + i * 0.015
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = vol * 0.4
      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)
      lfo.start()

      // Warmth filter
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 600 + i * 50
      filter.Q.value = 0.3

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(master)
      osc.start()

      nodesRef.current.push(osc, lfo)
    })

    // Brown noise layer for rain / wind texture
    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = data[i]
      data[i] *= 3.5
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true

    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'lowpass'
    noiseFilter.frequency.value = 300
    noiseFilter.Q.value = 0.1

    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.012

    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(master)
    noise.start()
    nodesRef.current.push(noise)
  }, [])

  const toggle = useCallback(() => {
    if (!ctxRef.current) createAudio()

    const ctx = ctxRef.current
    const master = masterRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)

    if (playing) {
      master.gain.linearRampToValueAtTime(0, now + 1.5)
    } else {
      master.gain.linearRampToValueAtTime(1, now + 2)
    }

    setPlaying((p) => !p)
  }, [playing, createAudio])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      nodesRef.current.forEach((node) => {
        try { node.stop() } catch { /* already stopped */ }
      })
      ctxRef.current?.close()
    }
  }, [])

  return (
    <button
      className={`ambient-toggle ${playing ? 'active' : ''}`}
      onClick={toggle}
      aria-label={playing ? 'Mute ambient sound' : 'Play ambient sound'}
      title={playing ? 'Mute ambient sound' : 'Play ambient sound'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {playing ? (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" className="sound-wave-2" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" className="sound-wave-1" />
          </>
        ) : (
          <>
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        )}
      </svg>
    </button>
  )
}

export default AmbientSound
