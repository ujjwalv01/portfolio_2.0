import { useMemo } from 'react'
import useCachedFetch from '../hooks/useCachedFetch'
import useCountUp from '../hooks/useCountUp'

// Official Codeforces rank colours — meaningful to any CP person, so we keep them
const RANK_COLORS = {
  newbie: '#808080',
  pupil: '#008000',
  specialist: '#03a89e',
  expert: '#0000ff',
  'candidate master': '#aa00aa',
  master: '#ff8c00',
  'international master': '#ff8c00',
  grandmaster: '#ff0000',
  'international grandmaster': '#ff0000',
  'legendary grandmaster': '#ff0000',
}

const NEXT_RANK = [
  [1200, 'pupil'], [1400, 'specialist'], [1600, 'expert'], [1900, 'candidate master'],
  [2100, 'master'], [2300, 'international master'], [2400, 'grandmaster'],
]

function Sparkline({ points }) {
  if (points.length < 2) return null
  const W = 260
  const H = 64
  const PAD = 4
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const coords = points.map((p, i) => [
    PAD + (i / (points.length - 1)) * (W - PAD * 2),
    H - PAD - ((p - min) / range) * (H - PAD * 2),
  ])
  const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${coords[0][0]},${H} ${line} ${coords[coords.length - 1][0]},${H}`
  const [lx, ly] = coords[coords.length - 1]

  return (
    <svg className="cf-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="cf-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#cf-fill)" />
      <polyline points={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="cf-spark-line" />
      <circle cx={lx} cy={ly} r="3.5" fill="var(--accent)" className="cf-spark-dot" />
    </svg>
  )
}

function CodeforcesCard({ handle }) {
  const info = useCachedFetch(`https://codeforces.com/api/user.info?handles=${handle}`, {
    transform: (j) => j.result?.[0] ?? null,
  })
  const history = useCachedFetch(`https://codeforces.com/api/user.rating?handle=${handle}`, {
    transform: (j) => (j.result ?? []).map((r) => r.newRating),
  })

  const user = info.data
  const ratings = history.data ?? []
  const rating = user?.rating ?? 0
  const rank = user?.rank ?? 'unrated'
  const rankColor = RANK_COLORS[rank] ?? 'var(--text-tertiary)'

  const ratingAnim = useCountUp(rating)
  const maxAnim = useCountUp(user?.maxRating ?? 0)
  const contestsAnim = useCountUp(ratings.length, 900)

  const next = useMemo(() => NEXT_RANK.find(([r]) => r > rating), [rating])
  const lastDelta = ratings.length >= 2 ? ratings[ratings.length - 1] - ratings[ratings.length - 2] : null

  const loading = info.loading && !user

  return (
    <section className="stat-card cf-card reveal">
      <div className="stat-card-head">
        <span className="stat-card-title">
          <CFIcon /> codeforces
        </span>
        <a href={`https://codeforces.com/profile/${handle}`} target="_blank" rel="noopener noreferrer" className="stat-card-link">
          @{handle} ↗
        </a>
      </div>

      {info.error && !user ? (
        <p className="stat-error">Codeforces isn't answering. Probably a contest running.</p>
      ) : (
        <>
          <div className="cf-main">
            <div className="cf-rating-block">
              <span className="cf-rating">{loading ? '—' : ratingAnim}</span>
              <span className="cf-rank" style={{ '--rank-color': rankColor }}>
                <i />{loading ? 'loading' : rank}
              </span>
              {lastDelta != null && (
                <span className={`cf-delta ${lastDelta >= 0 ? 'up' : 'down'}`}>
                  {lastDelta >= 0 ? '▲' : '▼'} {Math.abs(lastDelta)} last contest
                </span>
              )}
            </div>
            <Sparkline points={ratings} />
          </div>

          <div className="cf-grid">
            <div className="cf-cell">
              <span className="cf-cell-value">{loading ? '—' : maxAnim}</span>
              <span className="cf-cell-label">max rating</span>
            </div>
            <div className="cf-cell">
              <span className="cf-cell-value">{history.loading && !ratings.length ? '—' : contestsAnim}</span>
              <span className="cf-cell-label">rated contests</span>
            </div>
            <div className="cf-cell">
              <span className="cf-cell-value">{next && !loading ? next[0] - rating : '—'}</span>
              <span className="cf-cell-label">to {next ? next[1] : 'the top'}</span>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

function CFIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="10" width="4.5" height="11" rx="1.2" />
      <rect x="9.75" y="3" width="4.5" height="18" rx="1.2" />
      <rect x="16.5" y="13" width="4.5" height="8" rx="1.2" />
    </svg>
  )
}

export default CodeforcesCard
