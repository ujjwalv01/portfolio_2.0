import { useEffect, useMemo, useRef, useCallback, useState } from 'react'
import TransitionLink from '../components/TransitionLink'
import ThemeToggle from '../components/ThemeToggle'
import useCachedFetch from '../hooks/useCachedFetch'
import usePageMeta from '../hooks/usePageMeta'
import { REPOS_URL, transformRepos, timeAgo } from '../lib/github'

const projects = [
  {
    title: 'IntervYou',
    tagline: 'Voice-first AI mock interviews',
    description: 'An adaptive AI interviewer (Aria) that actually listens - follows up on vague answers, pushes back on weak ones, then delivers a structured feedback report with scores and improvements. Behavioral, technical, system design, and HR rounds.',
    tags: ['Next.js 15', 'Express', 'PostgreSQL', 'Vapi', 'Groq'],
    categories: ['ai', 'full-stack'],
    repo: 'IntervYou',
    github: 'https://github.com/ujjwalv01/IntervYou',
    live: 'https://intervyou-ai.vercel.app/',
    featured: true,
  },
  {
    title: 'LinkMedicalSpaces',
    tagline: 'Airbnb for medical office space',
    description: 'Discover, list, and book healthcare venues. Multi-step listing flow with Google Maps auto-fill, Stripe subscriptions, Cloudinary media pipeline, and an AI description generator on the Claude API.',
    tags: ['Next.js 14', 'PostgreSQL', 'Prisma', 'Stripe', 'Claude API'],
    categories: ['full-stack', 'ai'],
    repo: 'LinkMedicalSpaces',
    github: 'https://github.com/ujjwalv01/LinkMedicalSpaces',
    live: 'https://lmsdeply.vercel.app/',
    featured: true,
  },
  {
    title: 'RivalScan AI',
    tagline: 'Competitive intelligence in seconds',
    description: 'Researches any company in under 10 seconds via live web scraping and multi-model AI reasoning. Generates full CI reports with SWOT analysis and interactive charts - cut manual research time by ~80%.',
    tags: ['Next.js', 'TypeScript', 'Groq', 'Firecrawl', 'Recharts'],
    categories: ['ai', 'tools'],
    repo: 'rivalscanai',
    github: 'https://github.com/ujjwalv01/rivalscanai',
    live: 'https://tryrivalscan.vercel.app/',
  },
  {
    title: 'RepWise',
    tagline: 'AI fitness & nutrition ecosystem',
    description: 'NLP food scanner, photo meal recognition, and an AI workout generator for gym, home, and hybrid routines. Macro tracking via Mifflin-St Jeor, Google OAuth, and an immersive 3D glassmorphism UI.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Three.js', 'Groq'],
    categories: ['ai', 'full-stack'],
    repo: 'repwise',
    github: 'https://github.com/ujjwalv01/repwise',
    live: 'https://trainwithrepwise.vercel.app/',
  },
  {
    title: 'KhareedoNow',
    tagline: 'Full-featured MERN e-commerce',
    description: 'JWT auth with role-based access, Razorpay payments, Cloudinary media, and an admin analytics dashboard across 60+ REST endpoints. Deployed on AWS Elastic Beanstalk + Amplify with MongoDB Atlas.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Razorpay', 'AWS'],
    categories: ['full-stack'],
    repo: 'KhareedoNow',
    github: 'https://github.com/ujjwalv01/KhareedoNow',
    live: null, // Amplify deployment is currently offline
  },
  {
    title: 'Promptify',
    tagline: 'Raw ideas to effective prompts',
    description: 'Transforms rough, unstructured input into well-written, structured prompts for LLMs. Google sign-in or continue as guest.',
    tags: ['React', 'Next.js', 'JavaScript'],
    categories: ['ai', 'tools'],
    repo: 'promptify',
    github: 'https://github.com/ujjwalv01/Promptify',
    live: 'https://trypromptify.vercel.app/',
  },
]

const FILTERS = [
  { id: 'all', label: 'all' },
  { id: 'ai', label: 'ai' },
  { id: 'full-stack', label: 'full-stack' },
  { id: 'tools', label: 'tools' },
]

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', 'C++': '#f34b7d', Python: '#3572A5', CSS: '#663399', HTML: '#e34c26',
}

const openNew = (url) => window.open(url, '_blank', 'noopener')

// A link nested inside the card link — stops the outer card from also navigating
function InnerLink({ href, children }) {
  const go = (e) => { e.preventDefault(); e.stopPropagation(); openNew(href) }
  return (
    <span
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') go(e) }}
    >
      {children}
    </span>
  )
}

function Projects() {
  usePageMeta({
    title: 'Projects',
    description: 'Open-source and full-stack projects by Ujjwal Verma: React, Node.js, MERN stack apps and GitHub repositories.',
    path: '/projects',
  })
  const listRef = useRef(null)
  const [filter, setFilter] = useState('all')
  const hasHover = useMemo(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches, [])

  // Live repo metadata (stars, language, last push) — shares the cache with the Activity page
  const { data: repos } = useCachedFetch(REPOS_URL, { transform: transformRepos })
  const repoMap = useMemo(() => {
    const m = {}
    repos?.forEach((r) => { m[r.name.toLowerCase()] = r })
    return m
  }, [repos])

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter]
  )

  // Reveal cards via IntersectionObserver (re-run when the filter changes the list)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    listRef.current?.querySelectorAll('.proj-card').forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [visible])

  // 3D tilt + cursor shine (desktop only)
  const handleTiltMove = useCallback((e) => {
    if (!hasHover) return
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (0.5 - y) * 8
    const rotateY = (x - 0.5) * 8

    card.style.transition = 'box-shadow 0.2s ease, border-color 0.2s ease'
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`
    const shine = card.querySelector('.card-shine')
    if (shine) {
      shine.style.background = `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(245, 197, 24, 0.10), transparent 60%)`
    }
  }, [hasHover])

  const handleTiltLeave = useCallback((e) => {
    const card = e.currentTarget
    card.style.transition = ''
    card.style.transform = ''
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

      <main className="inner-page projects-page">
        <TransitionLink to="/" className="back magnetic">← back</TransitionLink>

        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">
          Things I've built - from hackathon prototypes to fully shipped products.
          Most are open-source; stars and activity are live from GitHub.
        </p>

        <div className="proj-filters" role="tablist" aria-label="Filter projects">
          {FILTERS.map((f) => {
            const count = f.id === 'all' ? projects.length : projects.filter((p) => p.categories.includes(f.id)).length
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                className={`proj-filter ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}<span>{count}</span>
              </button>
            )
          })}
        </div>

        <div className="proj-grid" ref={listRef} key={filter}>
          {visible.map((project, index) => {
            const meta = repoMap[project.repo.toLowerCase()]
            return (
              <a
                className={`proj-card ${project.featured ? 'featured' : ''}`}
                href={project.live || project.github}
                target="_blank"
                rel="noopener noreferrer"
                key={project.title}
                style={{ transitionDelay: `${index * 0.07}s` }}
                onMouseMove={handleTiltMove}
                onMouseLeave={handleTiltLeave}
              >
                <div className="card-shine" />

                <div className="proj-top">
                  <span className="proj-index">
                    {String(index + 1).padStart(2, '0')}
                    {project.featured && <span className="proj-featured">featured</span>}
                  </span>
                  <span className={`proj-status ${project.live ? 'live' : ''}`}>
                    <i />{project.live ? 'live' : 'code'}
                  </span>
                </div>

                <h2 className="proj-title">
                  {project.title}
                  <span className="proj-arrow" aria-hidden="true">↗</span>
                </h2>
                <p className="proj-tagline">{project.tagline}</p>
                <p className="proj-desc">{project.description}</p>

                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="proj-foot">
                  <div className="proj-meta">
                    {meta?.lang && (
                      <span className="proj-lang">
                        <i style={{ background: LANG_COLORS[meta.lang] || 'var(--text-quaternary)' }} />
                        {meta.lang}
                      </span>
                    )}
                    {meta && <span title="GitHub stars">★ {meta.stars}</span>}
                    {meta?.pushed && <span>updated {timeAgo(meta.pushed)}</span>}
                  </div>
                  <div className="proj-links">
                    <InnerLink href={project.github}>code</InnerLink>
                    {project.live && <InnerLink href={project.live}>live</InnerLink>}
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        <p className="proj-more">
          More experiments on{' '}
          <a href="https://github.com/ujjwalv01?tab=repositories" target="_blank" rel="noopener noreferrer">GitHub</a>,
          plus open-source work in{' '}
          <a href="https://github.com/stdlib-js/stdlib/pulls?q=is%3Apr+author%3Aujjwalv01" target="_blank" rel="noopener noreferrer">stdlib-js</a>.
        </p>
      </main>

      <footer className="inner-footer">
        <div className="footer-inner">
          <span className="footer-credit">
            <TransitionLink to="/">Ujjwal Verma</TransitionLink>
          </span>
          <TransitionLink to="/experience" className="footer-note">experience →</TransitionLink>
        </div>
      </footer>
    </>
  )
}

export default Projects
