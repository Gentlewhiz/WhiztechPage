import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'theme'

// The theme is applied by an inline script in <head> before first paint, and
// lives on <html class="dark">. This hook subscribes to that class instead of
// copying it into React state, so the server render (null) and the browser
// never disagree during hydration.
function subscribe(callback) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}
const getSnapshot = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
const getServerSnapshot = () => null

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggleTheme = useCallback(() => {
    const root = document.documentElement
    const next = getSnapshot() === 'dark' ? 'light' : 'dark'

    root.classList.add('theme-transition')
    root.classList.toggle('dark', next === 'dark')
    window.setTimeout(() => root.classList.remove('theme-transition'), 300)

    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be blocked (private mode). The theme still switches for this visit.
    }
  }, [])

  return { theme, toggleTheme }
}
