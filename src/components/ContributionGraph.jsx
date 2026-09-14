import { useEffect, useMemo, useRef, useState } from 'react'
import useCachedFetch from '../hooks/useCachedFetch'
import useCountUp from '../hooks/useCountUp'

const CELL = 10
const GAP = 3
const STEP = CELL + GAP
const LABEL_W = 28
const LABEL_H = 18
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function computeStreaks(days) {
  let longest = 0
  let run = 0
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0
    if (run > longest) longest = run
  }

  // Current streak: count backwards from today; a zero today doesn't break it yet
  let current = 0
  let i = days.length - 1
  if (days[i] && days[i].count === 0) i--
  for (; i >= 0 && days[i].count > 0; i--) current++

  return { current, longest }
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function ContributionGraph({ username }) {
  const { data, error, loading } = useCachedFetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
  )
  const scrollRef = useRef(null)
  const [tip, setTip] = useState(null)
  const [lit, setLit] = useState(false)

  const days = useMemo(() => data?.contributions ?? [], [data])
  const total = data?.total?.lastYear ?? 0
  const { current, longest } = useMemo(() => computeStreaks(days), [days])
  const busiest = useMemo(() => days.reduce((m, d) => (d.count > m ? d.count : m), 0), [days])

  const totalAnim = useCountUp(total)
  const currentAnim = useCountUp(current, 900)
  const longestAnim = useCountUp(longest, 900)

  // Arrange into week columns (Sun..Sat), padding the first partial week
  const { weeks, monthLabels } = useMemo(() => {
    if (!days.length) return { weeks: [], monthLabels: [] }
    const firstDow = new Date(days[0].date + 'T00:00:00').getDay()
    const cols = []
    let col = new Array(firstDow).fill(null)
    for (const d of days) {
      col.push(d)
      if (col.length === 7) { cols.push(col); col = [] }
    }
    if (col.length) cols.push(col)

    const labels = []
    let lastMonth = -1
    cols.forEach((week, wi) => {
      const first = week.find(Boolean)
      if (!first) return
      const m = new Date(first.date + 'T00:00:00').getMonth()
      if (m !== lastMonth) {
        // skip a label that would collide with the previous one
        if (!labels.length || wi - labels[labels.length - 1].wi >= 3) {
          labels.push({ wi, text: MONTHS[m] })
        }
        lastMonth = m
      }
    })
    return { weeks: cols, monthLabels: labels }
  }, [days])

  // Light up cells with a stagger once data is present, and scroll to the latest week on narrow screens
  useEffect(() => {
    if (!weeks.length) return
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
    const t = setTimeout(() => setLit(true), 50)
    return () => clearTimeout(t)
  }, [weeks.length])

  const width = LABEL_W + weeks.length * STEP
  const height = LABEL_H + 7 * STEP

  const showTip = (e, d) => {
    const box = scrollRef.current?.getBoundingClientRect()
    if (!box || !d) return
    setTip({
      x: e.clientX - box.left + (scrollRef.current?.scrollLeft ?? 0),
      y: e.clientY - box.top,
      date: d.date,
      count: d.count,
    })
  }

  return (
    <section className="stat-card contrib-card reveal">
      <div className="stat-card-head">
        <span className="stat-card-title">
          <GitHubIcon /> contributions
        </span>
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="stat-card-link">
          @{username} ↗
        </a>
      </div>

      <div className="contrib-summary">
        <div className="contrib-stat">
          <span className="contrib-stat-value">{loading ? '—' : totalAnim.toLocaleString()}</span>
          <span className="contrib-stat-label">in the last year</span>
        </div>
        <div className="contrib-stat">
          <span className="contrib-stat-value">{loading ? '—' : currentAnim}<small>d</small></span>
          <span className="contrib-stat-label">current streak</span>
        </div>
        <div className="contrib-stat">
          <span className="contrib-stat-value">{loading ? '—' : longestAnim}<small>d</small></span>
          <span className="contrib-stat-label">longest streak</span>
        </div>
        <div className="contrib-stat">
          <span className="contrib-stat-value">{loading ? '—' : busiest}</span>
          <span className="contrib-stat-label">best day</span>
        </div>
      </div>

      <div
        className={`contrib-scroll ${lit ? 'lit' : ''}`}
        ref={scrollRef}
        onMouseLeave={() => setTip(null)}
      >
        {error && !data && (
          <p className="stat-error">Couldn't reach GitHub right now. The Bat-Signal is down.</p>
        )}
        {loading && !data && <div className="contrib-skeleton" style={{ height }} />}

        {weeks.length > 0 && (
          <svg
            className="contrib-svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`${total} GitHub contributions in the last year`}
          >
            {monthLabels.map((m) => (
              <text
                key={m.wi}
                x={LABEL_W + m.wi * STEP}
                y={11}
                className="contrib-label"
              >
                {m.text}
              </text>
            ))}
            {['Mon', 'Wed', 'Fri'].map((d, i) => (
              <text
                key={d}
                x={0}
                y={LABEL_H + (1 + i * 2) * STEP + CELL - 2}
                className="contrib-label"
              >
                {d}
              </text>
            ))}
            {weeks.map((week, wi) =>
              week.map((d, di) =>
                d ? (
                  <rect
                    key={d.date}
                    x={LABEL_W + wi * STEP}
                    y={LABEL_H + di * STEP}
                    width={CELL}
                    height={CELL}
                    rx={2.5}
                    className={`contrib-cell level-${d.level}`}
                    style={{ transitionDelay: `${wi * 12 + di * 6}ms` }}
                    onMouseEnter={(e) => showTip(e, d)}
                    onMouseMove={(e) => showTip(e, d)}
                    onTouchStart={(e) => showTip(e.touches[0], d)}
                  />
                ) : null
              )
            )}
          </svg>
        )}

        {tip && (
          <div
            className="contrib-tip"
            style={{ left: tip.x, top: tip.y }}
          >
            <strong>{tip.count === 0 ? 'No' : tip.count} contribution{tip.count === 1 ? '' : 's'}</strong>
            <span>{formatDate(tip.date)}</span>
          </div>
        )}
      </div>

      <div className="contrib-legend">
        <span>less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <i key={l} className={`contrib-cell level-${l}`} />
        ))}
        <span>more</span>
      </div>
    </section>
  )
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

export default ContributionGraph
