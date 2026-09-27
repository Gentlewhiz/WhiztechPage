import { useRef } from 'react'
import { navItems, site } from '../data/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { LogoMark } from './Logo'
import { ThemeToggle } from './ThemeToggle'

/*
  A floating pill that appears once the hero (which has its own large navigation) has
  scrolled away. Hidden with visibility, so it cannot be tabbed to while out of view.
  On pages without a hero it is always shown (`alwaysVisible`).
*/
export function Header({ home = '', alwaysVisible = false }) {
  const ref = useRef(null)
  const active = useActiveSection(home ? [] : navItems.map((item) => item.id))

  useGSAP(
    () => {
      if (alwaysVisible) return undefined
      const hero = document.getElementById('top')
      if (!hero) return undefined
      // Only the start point matters: show once the hero's bottom passes 96px from the
      // top, hide when scrolling back above it. No end point, so nothing can go stale
      // if the page height changes after ScrollTrigger measured it.
      // A data attribute, not a class: React owns className and would wipe a class
      // added here the next time the header re-renders (e.g. the active link changes).
      const show = (visible) => ref.current?.toggleAttribute('data-visible', visible)
      const trigger = ScrollTrigger.create({
        trigger: hero,
        start: 'bottom 96px',
        onEnter: () => show(true),
        onLeaveBack: () => show(false),
      })
      show(window.scrollY > trigger.start)
      return () => trigger.kill()
    },
    { scope: ref, dependencies: [alwaysVisible] },
  )

  return (
    <header ref={ref} className="pill-nav" data-visible={alwaysVisible ? '' : undefined}>
      <a href={home || '#top'} className="flex items-center gap-2 rounded-sm font-medium tracking-tight">
        <LogoMark className="size-7" />
        <span className="sr-only sm:not-sr-only">{site.brand}</span>
      </a>
      <nav aria-label="Sections">
        <ul className="flex items-center gap-0.5 sm:gap-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`${home}#${item.id}`}
                aria-current={active === item.id ? 'location' : undefined}
                className={`rounded-full px-2.5 py-2 text-[0.8125rem] transition-colors sm:px-3 sm:text-sm ${
                  active === item.id ? 'bg-sunken text-accent' : 'text-muted hover:text-text'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ThemeToggle />
    </header>
  )
}
