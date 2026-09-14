import { useEffect, useRef } from 'react'
import TransitionLink from '../components/TransitionLink'
import ThemeToggle from '../components/ThemeToggle'

// ⚠️ Confirm these two handles — guessed from your other usernames
const PROFILES = {
  codeforces: 'https://codeforces.com/profile/ujjwxl.exe',
  codechef: 'https://www.codechef.com/users/ujjwxl_exe',
  gfg: 'https://www.geeksforgeeks.org/user/ujjwalverma010305/',
}

const timeline = [
  {
    type: 'work',
    role: 'Full Stack Developer Intern',
    org: 'MediaTree Excellence Group',
    period: 'May 2026 — Jul 2026',
    meta: 'Remote · Internship',
    points: [
      'Built a production Next.js 14 + TypeScript marketplace for medical spaces from scratch, replacing a legacy WordPress setup, on PostgreSQL + Prisma.',
      'Engineered a multi-step listing form with Google Maps auto-fill, auto-saving drafts, and role-based onboarding across two user journeys.',
      'Cut Stripe checkout redirect latency from 5s to under 1s with pre-fetched sessions; built a Cloudinary media pipeline with instant blob previews.',
      'Shipped an AI property-description generator on the Claude API, triggered post-upload with region-based subscription and waitlist logic.',
    ],
    tags: ['Next.js 14', 'TypeScript', 'PostgreSQL', 'Prisma', 'Stripe', 'Claude API'],
  },
  {
    type: 'oss',
    role: 'Open Source Contributor',
    org: 'stdlib-js',
    orgUrl: 'https://github.com/stdlib-js/stdlib/pulls?q=is%3Apr+author%3Aujjwalv01',
    period: 'Jun 2026 — Present',
    meta: 'Numerical & scientific JavaScript · Organization member',
    points: [
      '80+ merged pull requests across numerical computing, statistics, string utilities, testing, and developer tooling.',
      'Migrated test suites for 25+ math/base/special modules to ULP-based floating-point assertions for cross-platform reliability.',
      'Implemented native C routines across stats/base/ndarray and statistical distributions.',
      'Contributed to BLAS, LAPACK, ESLint tooling, and benchmarks - all reviewed and merged by core maintainers.',
    ],
    tags: ['JavaScript', 'C', 'BLAS / LAPACK', 'Numerical Computing'],
    highlight: '80+ merged PRs',
  },
  {
    type: 'work',
    role: 'Campus Ambassador',
    org: 'Internshala',
    orgUrl: 'https://internshala.com/',
    period: 'Apr 2026 — May 2026',
    meta: 'Selected from 25,000+ applicants · 500 chosen nationwide',
    points: [],
    tags: [],
  },
  {
    type: 'edu',
    role: 'B.Tech in Computer Science & Engineering',
    org: 'Pranveer Singh Institute of Technology',
    orgUrl: 'https://www.psit.ac.in/',
    period: 'Aug 2024 — May 2028',
    meta: 'Kanpur, Uttar Pradesh',
    points: [],
    tags: [],
  },
]

const achievements = [
  {
    platform: 'Codeforces',
    url: PROFILES.codeforces,
    stat: 'Specialist',
    detail: 'peak 1450 · 300+ problems across Div. 2 & Div. 3',
  },
  {
    platform: 'CodeChef',
    url: PROFILES.codechef,
    stat: '2★',
    detail: 'peak 1505 · Global Rank 591 in Starters 247',
  },
  {
    platform: 'GeeksforGeeks',
    url: PROFILES.gfg,
    stat: '300+',
    detail: 'DSA problems - hashing, trees, graphs, DP',
  },
]

const skills = [
  { group: 'languages', items: ['C++', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'] },
  { group: 'frameworks', items: ['React', 'Next.js', 'Node.js', 'Express', 'Django', 'Tailwind', 'Redux', 'Vite'] },
  { group: 'data', items: ['PostgreSQL', 'MongoDB', 'Supabase', 'MySQL', 'Prisma'] },
  { group: 'tooling', items: ['Git', 'Docker', 'CI/CD', 'Linux', 'Jest', 'Vitest', 'AWS', 'Vercel'] },
]

const ICONS = {
  work: (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h3.25A1.75 1.75 0 0116 4.75v8.5A1.75 1.75 0 0114.25 15H1.75A1.75 1.75 0 010 13.25v-8.5C0 3.784.784 3 1.75 3H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM1.5 4.75v3.5h13v-3.5a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25zm13 5H1.5v3.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-3.5z" />
    </svg>
  ),
  oss: (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    </svg>
  ),
  edu: (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M7.693 1.066a.75.75 0 01.614 0l7.25 3.25a.75.75 0 010 1.368L13 6.831v2.919c0 1.24-.607 2.26-1.464 3.014-.856.752-2.03 1.24-3.536 1.24s-2.68-.488-3.536-1.24C3.607 12.01 3 10.99 3 9.75V6.831L1.75 6.27v3.98a.75.75 0 01-1.5 0V5.5a.75.75 0 01.443-.684l7-3.75zM4.5 7.503V9.75c0 .75.36 1.41.958 1.936.596.524 1.45.814 2.542.814s1.946-.29 2.542-.814c.598-.526.958-1.186.958-1.936V7.503L8.307 8.934a.75.75 0 01-.614 0L4.5 7.503zM8 2.575L2.98 5 8 7.425 13.02 5 8 2.575z" />
    </svg>
  ),
}

function Experience() {
  const pageRef = useRef(null)
  const timelineRef = useRef(null)
  const progressRef = useRef(null)

  // Reveal nodes as they scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Scroll-linked: the timeline's spine fills in as you read down it
  useEffect(() => {
    const line = timelineRef.current
    const fill = progressRef.current
    if (!line || !fill) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = line.getBoundingClientRect()
      const focus = window.innerHeight * 0.55
      const pct = Math.min(1, Math.max(0, (focus - rect.top) / rect.height))
      fill.style.transform = `scaleY(${pct})`
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <header className="site-header">
        <TransitionLink to="/" className="header-logo magnetic">Ujjwal Verma</TransitionLink>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </header>

      <main className="inner-page experience-page" ref={pageRef}>
        <TransitionLink to="/" className="back magnetic">← back</TransitionLink>

        <h1 className="page-title">Experience</h1>
        <p className="page-subtitle">
          Where I've been and what I've been building - internships, open source,
          and the road so far. Full details on my{' '}
          <a href="https://www.linkedin.com/in/ujjwal-verma-cse/" target="_blank" rel="noopener noreferrer">LinkedIn</a>{' '}
          or{' '}
          <a href="https://drive.google.com/file/d/1AIgD792xOUPS1h2ZN0PhSXrijEvsQIHv/view?usp=drive_link" target="_blank" rel="noopener noreferrer">resume</a>.
        </p>

        <div className="timeline" ref={timelineRef}>
          <div className="timeline-progress" ref={progressRef} />

          {timeline.map((item, i) => (
            <article className={`tl-item reveal tl-${item.type}`} key={i}>
              <div className="tl-node" aria-hidden="true">{ICONS[item.type]}</div>

              <div className="tl-body">
                <span className="tl-period">{item.period}</span>
                <h2 className="tl-role">{item.role}</h2>
                <p className="tl-org">
                  <a href={item.orgUrl} target="_blank" rel="noopener noreferrer">{item.org}</a>
                  {item.highlight && <span className="tl-highlight">{item.highlight}</span>}
                </p>
                <p className="tl-meta">{item.meta}</p>

                {item.points.length > 0 && (
                  <ul className="tl-points">
                    {item.points.map((p, j) => <li key={j}>{p}</li>)}
                  </ul>
                )}

                {item.tags.length > 0 && (
                  <div className="project-tags">
                    {item.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <h2 className="section-title reveal">Competitive programming</h2>
        <div className="achievements reveal">
          {achievements.map((a) => (
            <a className="achievement" href={a.url} target="_blank" rel="noopener noreferrer" key={a.platform}>
              <span className="achievement-stat">{a.stat}</span>
              <span className="achievement-platform">{a.platform} ↗</span>
              <span className="achievement-detail">{a.detail}</span>
            </a>
          ))}
        </div>

        <h2 className="section-title reveal">Toolkit</h2>
        <div className="skills reveal">
          {skills.map((s) => (
            <div className="skill-row" key={s.group}>
              <span className="skill-group">{s.group}</span>
              <div className="skill-chips">
                {s.items.map((it) => <span className="skill-chip magnetic" key={it}>{it}</span>)}
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
          <TransitionLink to="/activity" className="footer-note">see live activity →</TransitionLink>
        </div>
      </footer>
    </>
  )
}

export default Experience
