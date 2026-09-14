import { useMemo } from 'react'
import useCachedFetch from '../hooks/useCachedFetch'
import useCountUp from '../hooks/useCountUp'
import { REPOS_URL, transformRepos } from '../lib/github'

// GitHub's own linguist colours for the languages most likely to show up
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', 'C++': '#f34b7d', C: '#555555',
  Python: '#3572A5', HTML: '#e34c26', CSS: '#663399', Java: '#b07219',
  Go: '#00ADD8', Rust: '#dea584', Shell: '#89e051', Jupyter: '#DA5B0B',
}

function Tile({ value, label, loading }) {
  const anim = useCountUp(value ?? 0)
  return (
    <div className="gh-tile">
      <span className="gh-tile-value">{loading ? '—' : anim.toLocaleString()}</span>
      <span className="gh-tile-label">{label}</span>
    </div>
  )
}

function GitHubStats({ username }) {
  const user = useCachedFetch(`https://api.github.com/users/${username}`, {
    transform: (u) => ({ repos: u.public_repos, followers: u.followers, following: u.following, since: u.created_at }),
  })
  const repos = useCachedFetch(REPOS_URL, { transform: transformRepos })

  const list = useMemo(() => repos.data ?? [], [repos.data])
  const stars = useMemo(() => list.reduce((s, r) => s + r.stars, 0), [list])

  const langs = useMemo(() => {
    const counts = {}
    list.forEach((r) => { if (r.lang) counts[r.lang] = (counts[r.lang] || 0) + 1 })
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100), color: LANG_COLORS[name] || 'var(--text-quaternary)' }))
  }, [list])

  const latest = list[0]
  const loading = (user.loading && !user.data) || (repos.loading && !repos.data)
  const failed = user.error && !user.data

  return (
    <section className="stat-card gh-card reveal">
      <div className="stat-card-head">
        <span className="stat-card-title">
          <RepoIcon /> github
        </span>
        {latest && (
          <a href={latest.url} target="_blank" rel="noopener noreferrer" className="stat-card-link">
            last push · {latest.name} ↗
          </a>
        )}
      </div>

      {failed ? (
        <p className="stat-error">GitHub rate-limited us. Try again in a bit.</p>
      ) : (
        <>
          <div className="gh-tiles">
            <Tile value={user.data?.repos} label="public repos" loading={loading} />
            <Tile value={stars} label="stars earned" loading={loading} />
            <Tile value={user.data?.followers} label="followers" loading={loading} />
            <Tile value={user.data?.following} label="following" loading={loading} />
          </div>

          {langs.length > 0 && (
            <div className="gh-langs">
              <div className="gh-lang-bar">
                {langs.map((l) => (
                  <span key={l.name} style={{ width: `${l.pct}%`, background: l.color }} title={`${l.name} ${l.pct}%`} />
                ))}
              </div>
              <ul className="gh-lang-list">
                {langs.map((l) => (
                  <li key={l.name}>
                    <i style={{ background: l.color }} />
                    {l.name} <span>{l.pct}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function RepoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
    </svg>
  )
}

export default GitHubStats
