import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import BackgroundCanvas from './components/BackgroundCanvas'
import KonamiEasterEgg from './components/KonamiEasterEgg'
import BatSwarm from './components/BatSwarm'
import IntroSequence from './components/IntroSequence'
import { shouldPlayIntro } from './lib/intro'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Activity from './pages/Activity'
import Experience from './pages/Experience'

function App() {
  const location = useLocation()
  const [intro, setIntro] = useState(() => shouldPlayIntro(location.pathname))
  const finishIntro = useCallback(() => setIntro(false), [])

  // Magnetic pull on .magnetic elements + cursor spotlight (desktop only)
  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!hasHover) return
    const root = document.documentElement
    root.classList.add('has-spotlight')

    const onMouseMove = (e) => {
      const mx = e.clientX
      const my = e.clientY
      root.style.setProperty('--mx', `${mx}px`)
      root.style.setProperty('--my', `${my}px`)

      document.querySelectorAll('.magnetic').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dist = Math.hypot(mx - cx, my - cy)
        const threshold = 100

        if (dist < threshold) {
          const pull = (threshold - dist) / threshold
          el.style.transform = `translate(${(mx - cx) * pull * 0.3}px, ${(my - cy) * pull * 0.3}px)`
        } else if (el.style.transform) {
          el.style.transform = ''
        }
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      root.classList.remove('has-spotlight')
    }
  }, [])

  return (
    <>
      <BackgroundCanvas />
      <KonamiEasterEgg />
      <BatSwarm />
      {intro ? (
        <IntroSequence onDone={finishIntro} />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/experience" element={<Experience />} />
        </Routes>
      )}
      <Analytics />
    </>
  )
}

export default App
