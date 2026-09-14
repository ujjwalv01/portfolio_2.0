export const GITHUB_USER = 'ujjwalv01'

// Shared by GitHubStats and Projects so both hit the same localStorage cache entry
export const REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`

export const transformRepos = (list) =>
  list.filter((r) => !r.fork).map((r) => ({
    name: r.name, stars: r.stargazers_count, lang: r.language, url: r.html_url, pushed: r.pushed_at,
  }))

/** "3d ago", "2w ago", "4mo ago" */
export function timeAgo(iso) {
  if (!iso) return ''
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  const d = Math.floor(s / 86400)
  if (d < 1) return 'today'
  if (d < 7) return `${d}d ago`
  if (d < 30) return `${Math.floor(d / 7)}w ago`
  if (d < 365) return `${Math.floor(d / 30)}mo ago`
  return `${Math.floor(d / 365)}y ago`
}
