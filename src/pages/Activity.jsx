import { useEffect, useRef } from 'react'
import TransitionLink from '../components/TransitionLink'
import ThemeToggle from '../components/ThemeToggle'
import ContributionGraph from '../components/ContributionGraph'
import CodeforcesCard from '../components/CodeforcesCard'
import GitHubStats from '../components/GitHubStats'
import usePageMeta from '../hooks/usePageMeta'

const GITHUB_USER = 'ujjwalv01'
const CF_HANDLE = 'ujjwxl.exe'

function Activity() {
  usePageMeta({
    title: 'Activity',
    description: 'Live GitHub contributions and Codeforces rating of Ujjwal Verma, competitive programmer and full-stack developer.',
    path: '/activity',
  })
  const pageRef = useRef(null)

  // Reveal cards as they scroll into view (same pattern as Projects)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    const cards = pageRef.current?.querySelectorAll('.reveal')
    cards?.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <header className="site-header">
        <TransitionLink to="/" className="header-logo magnetic">Ujjwal Verma</TransitionLink>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </header>

      <main className="inner-page activity-page" ref={pageRef}>
        <TransitionLink to="/" className="back magnetic">← back</TransitionLink>

        <h1 className="page-title">Activity</h1>
        <p className="page-subtitle">
          Live from the Batcomputer - what I've been shipping and solving,
          pulled straight from GitHub and{' '}
          <span style={{ whiteSpace: 'nowrap' }}>
            Codeforces.<span className="live-dot" aria-label="live" />
          </span>
        </p>

        <div className="activity-grid">
          <ContributionGraph username={GITHUB_USER} />
          <CodeforcesCard handle={CF_HANDLE} />
          <GitHubStats username={GITHUB_USER} />
        </div>
      </main>

      <footer className="inner-footer">
        <div className="footer-inner">
          <span className="footer-credit">
            <TransitionLink to="/">Ujjwal Verma</TransitionLink>
          </span>
          <span className="footer-note">refreshes hourly</span>
        </div>
      </footer>
    </>
  )
}

export default Activity
