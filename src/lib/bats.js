export const BAT_SWARM_EVENT = 'bat-swarm'

/**
 * Ask the BatSwarm canvas to play.
 * mode 'out' = bats burst from (x, y) and scatter off-screen
 * mode 'in'  = bats fly in from the edges and converge on (x, y)
 */
export function triggerBatSwarm({ x, y, mode = 'out', theme = 'light' }) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.dispatchEvent(new CustomEvent(BAT_SWARM_EVENT, { detail: { x, y, mode, theme } }))
}
