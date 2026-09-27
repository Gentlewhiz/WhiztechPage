import { useRef } from 'react'
import { MOTION_OK, gsap, useGSAP } from '../lib/gsap'

/*
  Words brighten from the muted text colour to the full text colour as the paragraph
  scrolls through the viewport. It animates a --lit custom property per word, mixed
  with color-mix(), so the dimmest state still passes contrast (muted is 7:1) and both
  themes work without JavaScript knowing the colours. Words, not characters: a tenth
  of the elements for React to hydrate, and screen readers read it normally.
*/
export function AnimatedWords({ text, className = '' }) {
  const ref = useRef(null)
  const words = text.split(' ')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const spans = gsap.utils.toArray('.word')
        gsap.set(spans, { '--lit': 0 })
        gsap.to(spans, {
          '--lit': 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 20%', scrub: true },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="word">
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
