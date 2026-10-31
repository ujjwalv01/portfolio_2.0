import { useEffect } from 'react'

const SITE = 'https://devujjwal.tech'
const DEFAULT_TITLE = 'Ujjwal Verma | Full Stack Developer & Competitive Programmer'
const DEFAULT_DESC =
  'Portfolio of Ujjwal Verma, full-stack developer, Codeforces Specialist and CSE undergrad from Kanpur, India. Projects, experience, and links to GitHub, LinkedIn, Codeforces and X.'

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

/**
 * Gives each route its own <title>, description, canonical and og:url
 * so Google indexes /projects, /experience and /activity as distinct pages.
 */
export default function usePageMeta({ title, description, path = '/' } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Ujjwal Verma` : DEFAULT_TITLE
    const desc = description || DEFAULT_DESC
    const url = `${SITE}${path}`

    document.title = fullTitle
    setMeta('meta[name="description"]', 'content', desc)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', desc)
  }, [title, description, path])
}
