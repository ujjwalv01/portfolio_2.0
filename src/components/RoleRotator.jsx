import { useEffect, useState } from 'react'

/** Typewriter that cycles through roles: type → hold → delete → next. */
function RoleRotator({ roles, typeMs = 55, deleteMs = 30, holdMs = 1800 }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setText(roles[0]); return }

    const full = roles[index]
    let delay = deleting ? deleteMs : typeMs

    if (!deleting && text === full) delay = holdMs
    else if (deleting && text === '') delay = 300

    const t = setTimeout(() => {
      if (!deleting) {
        if (text === full) setDeleting(true)
        else setText(full.slice(0, text.length + 1))
      } else if (text === '') {
        setDeleting(false)
        setIndex((i) => (i + 1) % roles.length)
      } else {
        setText(full.slice(0, text.length - 1))
      }
    }, delay)
    return () => clearTimeout(t)
  }, [text, deleting, index, roles, typeMs, deleteMs, holdMs])

  return (
    <span className="role-rotator" aria-live="polite" aria-label={roles[index]}>
      {text}
      <span className="role-caret" aria-hidden="true" />
    </span>
  )
}

export default RoleRotator
