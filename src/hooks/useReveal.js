import { MOTION_OK, gsap, useGSAP } from '../lib/gsap'

/*
  Fades and slides [data-reveal] children of `scope` into place the first time they
  scroll into view. Optional attributes per element: data-x, data-y (distance) and
  data-delay (seconds).

  Opacity only, never visibility: hidden content drops out of the accessibility tree,
  so screen-reader users could not reach it until it had been scrolled past on screen.
  If keyboard focus lands inside an element that has not revealed yet, the reveal
  finishes at once so focus is never on something invisible. (Keyboard only: a mouse
  press also moves focus, and snapping the element mid-click would make it miss.) With reduced motion,
  nothing is hidden at all.
*/
export function useReveal(scope) {
  useGSAP(
    (context, contextSafe) => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tweens = new Map()
        gsap.utils.toArray('[data-reveal]').forEach((element) => {
          tweens.set(
            element,
            gsap.from(element, {
              opacity: 0,
              x: Number(element.dataset.x ?? 0),
              y: Number(element.dataset.y ?? 30),
              duration: Number(element.dataset.duration ?? 0.8),
              delay: Number(element.dataset.delay ?? 0),
              ease: 'power2.out',
              scrollTrigger: { trigger: element, start: 'top 92%', once: true },
            }),
          )
        })

        const root = scope.current
        const onFocus = contextSafe((event) => {
          // Keyboard focus only. A mouse press also focuses a link, and snapping the row
          // into place between press and release would make the click miss.
          if (!event.target.matches(':focus-visible')) return
          const element = event.target.closest('[data-reveal]')
          tweens.get(element)?.progress(1)
        })
        root.addEventListener('focusin', onFocus)
        return () => root.removeEventListener('focusin', onFocus)
      })
      return () => mm.revert()
    },
    { scope },
  )
}
