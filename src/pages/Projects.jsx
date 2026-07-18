import { useEffect, useRef, useCallback } from 'react'
import TransitionLink from '../components/TransitionLink'
import ThemeToggle from '../components/ThemeToggle'

const projects = [
  {
    title: 'RepWise',
    description: 'An AI-powered fitness and nutrition ecosystem featuring a natural language food scanner, custom workout generation, and an interactive hydration tracker.',
    tags: ['AI Integration', 'React', 'Next.js', 'TypeScript'],
    github: 'https://github.com/ujjwalv01/repwise',
    live: 'https://trainwithrepwise.vercel.app/',
  },
  {
    title: 'RivalScan AI',
    description: 'An AI-powered competitive intelligence tool that researches any company in seconds. Generates CI reports featuring SWOT analysis and charts.',
    tags: ['Next.js', 'Groq API', 'Firecrawl', 'Recharts'],
    github: 'https://github.com/ujjwalv01/rivalscanai',
    live: 'https://tryrivalscan.vercel.app/',
  },
  {
    title: 'KhareedoNow',
    description: 'A full-featured e-commerce platform with product management, cart functionality, payment integration, and admin analytics dashboard.',
    tags: ['MERN Stack', 'AWS', 'Razorpay', 'Cloudinary'],
    github: 'https://github.com/ujjwalv01/KhareedoNow',
    live: 'https://main.dqwyc2xomhsy2.amplifyapp.com/',
  },
  {
    title: 'LinkMedicalSpaces',
    description: 'A platform for finding and booking specialized medical office spaces, with search, filtering, and listing capabilities.',
    tags: ['React', 'Next.js', 'PostgreSQL', 'Claude API'],
    github: 'https://github.com/ujjwalv01/LinkMedicalSpaces',
    live: 'https://lmsdeply.vercel.app/',
  },
  {
    title: 'Promptify',
    description: 'An intelligent tool designed to transform raw, unstructured inputs into highly effective and well-written AI prompts for LLMs.',
    tags: ['React', 'Next.js', 'JavaScript'],
    github: 'https://github.com/ujjwalv01/Promptify',
    live: 'https://trypromptify.vercel.app/',
  },
]

function Projects() {
  const listRef = useRef(null)

  // Scroll-linked parallax: reveal cards via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    const cards = listRef.current?.querySelectorAll('.project')
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  // 3D tilt effect handlers
  const handleTiltMove = useCallback((e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const rotateX = (0.5 - y) * 16  // ±8 degrees
    const rotateY = (x - 0.5) * 16

    card.style.transition = 'box-shadow 0.2s ease'
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    card.style.boxShadow = `${-rotateY * 0.4}px ${rotateX * 0.4}px 24px rgba(245, 197, 24, 0.06)`

    // Shine gradient follows cursor
    const shine = card.querySelector('.card-shine')
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(245, 197, 24, 0.08) 0%, transparent 60%)`
    }
  }, [])

  const handleTiltLeave = useCallback((e) => {
    const card = e.currentTarget
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s ease, opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease'
    card.style.transform = ''
    card.style.boxShadow = ''

    const shine = card.querySelector('.card-shine')
    if (shine) shine.style.background = ''
  }, [])

  return (
    <>
      <header className="site-header">
        <TransitionLink to="/" className="header-logo magnetic">Ujjwal Verma</TransitionLink>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </header>

      <main className="inner-page">
        <TransitionLink to="/" className="back magnetic">← back</TransitionLink>

        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">
          Things I've built - from hackathon prototypes to fully shipped products.
          Most are open-source.
        </p>

        <div className="projects-list" ref={listRef}>
          {projects.map((project, index) => (
            <div
              className="project"
              key={index}
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
            >
              <div className="card-shine" />
              <div className="project-header">
                <span className="project-title">{project.title}</span>
                <div className="project-links">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer">code</a>
                  )}
                  {project.live && project.live !== '#' && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer">live</a>
                  )}
                </div>
              </div>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, i) => (
                  <span className="tag" key={i}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="inner-footer">
        <div className="footer-inner">
          <span className="footer-credit">
            <TransitionLink to="/">Ujjwal Verma</TransitionLink>
          </span>
        </div>
      </footer>
    </>
  )
}

export default Projects
