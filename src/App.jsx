import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import BackgroundCanvas from './components/BackgroundCanvas'
import KonamiEasterEgg from './components/KonamiEasterEgg'
import Home from './pages/Home'
import Projects from './pages/Projects'

function App() {
  // Magnetic pull effect on .magnetic elements (desktop only)
  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!hasHover) return

    const onMouseMove = (e) => {
      const mx = e.clientX
      const my = e.clientY

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
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <>
      <BackgroundCanvas />
      <KonamiEasterEgg />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </>
  )
}

export default App
