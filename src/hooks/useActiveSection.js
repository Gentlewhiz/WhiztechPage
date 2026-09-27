import { useEffect, useState } from 'react'

// Returns the id of the section currently in the middle band of the viewport.
export function useActiveSection(ids) {
  const [active, setActive] = useState(null)
  const key = ids.join(',')

  useEffect(() => {
    const sections = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!sections.length || !('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { id } = entry.target
          if (entry.isIntersecting) setActive(id)
          else setActive((current) => (current === id ? null : current))
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [key])

  return active
}
