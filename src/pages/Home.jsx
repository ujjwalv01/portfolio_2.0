import { useEffect, useState } from 'react'
import TransitionLink from '../components/TransitionLink'
import ThemeToggle from '../components/ThemeToggle'
import RoleRotator from '../components/RoleRotator'
import useCachedFetch from '../hooks/useCachedFetch'
import useCountUp from '../hooks/useCountUp'
import usePageMeta from '../hooks/usePageMeta'
import { GITHUB_USER } from '../lib/github'

const CF_HANDLE = 'ujjwxl.exe'
const ROLES = ['full stack developer', 'competitive programmer', 'open-source contributor', 'cse undergrad']

const BAT_FALLBACK = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="#0a0a14"/><g transform="translate(10 25) scale(0.4)"><path d="M100 30 L104 15 L108 32 C126 24 164 22 198 30 Q180 40 166 66 Q148 56 132 76 Q114 68 100 92 Q86 68 68 76 Q52 56 34 66 Q20 40 2 30 C36 22 74 24 92 32 L96 15 Z" fill="#F5C518"/></g></svg>'
)

function Stat({ value, label, to, href }) {
  const n = useCountUp(value ?? 0, 1400)
  const inner = (
    <>
      <span className="hero-stat-value">{value == null ? '—' : n.toLocaleString()}</span>
      <span className="hero-stat-label">{label}</span>
    </>
  )
  if (to) return <TransitionLink to={to} className="hero-stat">{inner}</TransitionLink>
  return <a href={href} target="_blank" rel="noopener noreferrer" className="hero-stat">{inner}</a>
}

function Home() {
  usePageMeta({ path: '/' })
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      setTime(now + ' IST')
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  // Live numbers for the stats strip (all cached for an hour, shared with the Activity page)
  const contrib = useCachedFetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`)
  const cf = useCachedFetch(`https://codeforces.com/api/user.info?handles=${CF_HANDLE}`, {
    transform: (j) => j.result?.[0] ?? null,
  })
  const gh = useCachedFetch(`https://api.github.com/users/${GITHUB_USER}`, {
    transform: (u) => ({ repos: u.public_repos, followers: u.followers, following: u.following, since: u.created_at }),
  })

  return (
    <div className="home-page">
      <ThemeToggle />

      <main className="hero">
        <div className="hero-content">
          <div className="avatar-wrap">
            <span className="avatar-beam" aria-hidden="true" />
            <span className="avatar-ring" aria-hidden="true" />
            <img
              src="/d612ee610793a42b00b3bbfd2ccaf068.gif"
              alt="Ujjwal Verma"
              className="avatar magnetic"
              onError={(e) => { e.target.src = BAT_FALLBACK }}
            />
          </div>

          <h1 className="hero-name" data-text="Ujjwal Verma">Ujjwal Verma</h1>
          <p className="hero-aka">
            <RoleRotator roles={ROLES} />
          </p>

          <span className="hero-status">
            <i />open to internships &amp; collaborations
          </span>

          <p className="hero-bio">
            Hey, I'm a CSE undergrad and full-stack developer who enjoys building
            things that solve real problems - from AI-powered fitness ecosystems to
            competitive intelligence tools. Most of my work lives on{' '}
            <a href="https://github.com/ujjwalv01" target="_blank" rel="noopener noreferrer">GitHub</a>,
            including 80+ merged pull requests to{' '}
            <a href="https://github.com/stdlib-js/stdlib/pulls?q=is%3Apr+author%3Aujjwalv01" target="_blank" rel="noopener noreferrer">stdlib-js</a>.
            When I'm not shipping code, I'm grinding competitive programming as a
            Codeforces Specialist with 300+ DSA problems under my belt.
          </p>

          <p className="hero-bio">
            I'm comfortable across the MERN and Next.js stacks, and I genuinely enjoy
            going from a rough idea to a polished product. I care about clean
            architecture, smooth user experiences, and code that doesn't make
            future-me angry. Grab my{' '}
            <a href="https://drive.google.com/file/d/1AIgD792xOUPS1h2ZN0PhSXrijEvsQIHv/view?usp=drive_link" target="_blank" rel="noopener noreferrer">resume</a>{' '}
            or reach out at{' '}
            <a href="mailto:ujjwalverma010305@gmail.com">ujjwalverma010305@gmail.com</a>.
          </p>

          <p className="hero-bio">
            If you made it here, I'd probably enjoy talking to you - shoot me a
            message about something that recently fascinated you.
          </p>

          <div className="hero-links">
            <TransitionLink to="/projects" className="magnetic">projects</TransitionLink>
            <TransitionLink to="/experience" className="magnetic">experience</TransitionLink>
            <TransitionLink to="/activity" className="magnetic">activity</TransitionLink>
            <a href="https://github.com/ujjwalv01" target="_blank" rel="noopener noreferrer" className="magnetic">github</a>
            <a href="https://x.com/Ujjwal_v01" target="_blank" rel="noopener noreferrer" className="magnetic">twitter</a>
            <a href="https://www.linkedin.com/in/ujjwal-verma-cse/" target="_blank" rel="noopener noreferrer" className="magnetic">linkedin</a>
          </div>

          <div className="hero-stats">
            <Stat value={contrib.data?.total?.lastYear} label="contributions / yr" to="/activity" />
            <Stat value={cf.data?.rating} label={`codeforces · ${cf.data?.rank ?? 'rating'}`} href={`https://codeforces.com/profile/${CF_HANDLE}`} />
            <Stat value={gh.data?.repos} label="public repos" href={`https://github.com/${GITHUB_USER}?tab=repositories`} />
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <span className="footer-location">📍 Kanpur, India</span>
        <span className="footer-dot"></span>
        <span className="footer-time">{time}</span>
      </footer>
    </div>
  )
}

export default Home
