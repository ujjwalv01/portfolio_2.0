import { useEffect, useRef } from 'react'

function MagneticCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // Only activate on devices with fine pointer (desktop)
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!hasHover) return

    let mouseX = -100, mouseY = -100
    let dotX = -100, dotY = -100
    let ringX = -100, ringY = -100
    let rafId
    let hovering = false

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      dotRef.current?.classList.add('visible')
      ringRef.current?.classList.add('visible')

      // Detect interactive elements for cursor scaling
      const target = e.target.closest('a, button, [role="button"], input, textarea, .magnetic')
      if (target && !hovering) {
        hovering = true
        dotRef.current?.classList.add('cursor-hover')
        ringRef.current?.classList.add('cursor-hover')
      } else if (!target && hovering) {
        hovering = false
        dotRef.current?.classList.remove('cursor-hover')
        ringRef.current?.classList.remove('cursor-hover')
      }

      // Magnetic pull on elements with .magnetic class
      document.querySelectorAll('.magnetic').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dist = Math.hypot(mouseX - cx, mouseY - cy)
        const threshold = 100

        if (dist < threshold) {
          const pull = (threshold - dist) / threshold
          el.style.transform = `translate(${(mouseX - cx) * pull * 0.3}px, ${(mouseY - cy) * pull * 0.3}px)`
        } else if (el.style.transform) {
          el.style.transform = ''
        }
      })
    }

    const onMouseLeave = () => {
      dotRef.current?.classList.remove('visible')
      ringRef.current?.classList.remove('visible')
    }

    const animate = () => {
      // Lerp for smooth spring-physics following
      dotX += (mouseX - dotX) * 0.2
      dotY += (mouseY - dotY) * 0.2
      ringX += (mouseX - ringX) * 0.08
      ringY += (mouseY - ringY) * 0.08

      if (dotRef.current) {
        dotRef.current.style.left = `${dotX}px`
        dotRef.current.style.top = `${dotY}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`
        ringRef.current.style.top = `${ringY}px`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

export default MagneticCursor
