/** Play on every load of the home route, but never for reduced-motion users. */
export function shouldPlayIntro(pathname) {
  if (pathname !== '/') return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
