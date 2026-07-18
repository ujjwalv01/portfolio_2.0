import { useEffect, useRef, useState } from 'react'

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

function KonamiEasterEgg() {
  const [retro, setRetro] = useState(false)
  const [toast, setToast] = useState('')
  const bufferRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      bufferRef.current.push(key)
      bufferRef.current = bufferRef.current.slice(-KONAMI_CODE.length)

      if (
        bufferRef.current.length === KONAMI_CODE.length &&
        bufferRef.current.every((k, i) => k === KONAMI_CODE[i])
      ) {
        const html = document.documentElement
        const isRetro = html.hasAttribute('data-retro')

        if (isRetro) {
          html.removeAttribute('data-retro')
          setRetro(false)
          showToast('RETRO MODE DEACTIVATED')
        } else {
          html.setAttribute('data-retro', 'true')
          setRetro(true)
          showToast('▶ RETRO MODE ACTIVATED ◀')
        }

        bufferRef.current = []
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(''), 3000)
  }

  const exitRetro = () => {
    document.documentElement.removeAttribute('data-retro')
    setRetro(false)
    showToast('RETRO MODE DEACTIVATED')
  }

  return (
    <>
      {toast && <div className="retro-toast">{toast}</div>}
      {retro && (
        <button className="retro-exit" onClick={exitRetro} aria-label="Exit retro mode">
          × EXIT RETRO
        </button>
      )}
    </>
  )
}

export default KonamiEasterEgg
