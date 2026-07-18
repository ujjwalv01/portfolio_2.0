import { useNavigate } from 'react-router-dom'

function TransitionLink({ to, children, className, ...props }) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault()

    if (document.startViewTransition) {
      const html = document.documentElement
      html.classList.add('page-transitioning')

      const transition = document.startViewTransition(() => {
        navigate(to)
      })

      transition.finished.then(() => {
        html.classList.remove('page-transitioning')
      }).catch(() => {
        html.classList.remove('page-transitioning')
      })
    } else {
      navigate(to)
    }
  }

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  )
}

export default TransitionLink
