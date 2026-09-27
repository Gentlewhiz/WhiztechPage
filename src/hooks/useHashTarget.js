import { useEffect } from 'react'
import { ScrollTrigger } from '../lib/gsap'

/*
  When the page is opened at a section link (e.g. /#contact), the browser jumps there
  before ScrollTrigger has measured the page. Measuring resets the scroll position, so
  the visitor lands at the top. Once ScrollTrigger has refreshed, jump to the target
  again, unless the visitor has already started scrolling. #project-… links are handled
  by the project sphere, which opens that project instead.
*/
export function useHashTarget() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id || id.startsWith('project-')) return undefined
    let userScrolled = false
    const markScrolled = () => {
      userScrolled = true
    }
    const jump = () => {
      const target = document.getElementById(id)
      if (!target || userScrolled) return
      target.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
    window.addEventListener('wheel', markScrolled, { passive: true, once: true })
    window.addEventListener('touchmove', markScrolled, { passive: true, once: true })
    ScrollTrigger.addEventListener('refresh', jump)
    const frame = requestAnimationFrame(jump)
    return () => {
      cancelAnimationFrame(frame)
      ScrollTrigger.removeEventListener('refresh', jump)
      window.removeEventListener('wheel', markScrolled)
      window.removeEventListener('touchmove', markScrolled)
    }
  }, [])
}

/*
  ScrollTrigger measures positions when it starts and on window resize. Content can
  change height later (fonts, images, the sphere laying itself out), which would leave
  every trigger slightly off. Re-measure whenever the page's height really changes.
*/
export function useScrollTriggerRefresh() {
  useEffect(() => {
    let last = document.body.offsetHeight
    let timer = 0
    const observer = new ResizeObserver(() => {
      const height = document.body.offsetHeight
      if (Math.abs(height - last) < 2) return
      last = height
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    observer.observe(document.body)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [])
}
