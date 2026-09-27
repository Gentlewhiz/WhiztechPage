import { useRef } from 'react'
import iris from '../data/portrait.json'
import portrait from '../assets/portrait/portrait.webp'
import portraitSm from '../assets/portrait/portrait-sm.webp'
import irisLeft from '../assets/portrait/iris-left.webp'
import irisRight from '../assets/portrait/iris-right.webp'
import { FINE_POINTER, gsap, useGSAP } from '../lib/gsap'

const IRIS_IMAGES = { left: irisLeft, right: irisRight }
// The right eye moves a touch less than the left, so the pair never looks mechanical.
const EYE_BIAS = { left: { x: 1, y: 1 }, right: { x: 0.92, y: 0.96 } }
const PARALLAX = { x: 8, y: 5 } // CSS px, the portrait's own drift towards the cursor
const IDLE_MS = 2500

const clamp = (value) => Math.max(-1, Math.min(1, value))

/*
  The hero portrait, with eyes that follow the cursor.

  Layers, back to front: a soft glow, the portrait with its irises painted out, and
  each iris cut from the original image, clipped to the shape of its eye opening. The
  clip keeps every iris inside its eye and behind the lids and glasses. At rest the
  layers reproduce the original portrait exactly (see scripts/prepare-portrait.py).

  React renders the layers once. Pointer movement never touches React state: GSAP's
  quickTo keeps one tween per axis and retargets it, and the portrait's position is
  measured on scroll and resize rather than on every move. Only for a mouse or trackpad,
  never with reduced motion, and only while the hero is on screen.
*/
export function HeroPortrait({ alt }) {
  const scope = useRef(null)

  useGSAP(
    (context, contextSafe) => {
      const mm = gsap.matchMedia()
      mm.add(FINE_POINTER, () => {
        const root = scope.current
        const drift = root.querySelector('[data-parallax]')
        const eyes = gsap.utils.toArray('[data-iris]').map((element) => {
          const name = element.dataset.iris
          const tween = { duration: 0.55, ease: 'power3.out' }
          return {
            name,
            ...iris.eyes[name],
            bias: EYE_BIAS[name],
            x: gsap.quickTo(element, 'x', tween),
            y: gsap.quickTo(element, 'y', tween),
          }
        })
        const driftX = gsap.quickTo(drift, 'x', { duration: 1.1, ease: 'power3.out' })
        const driftY = gsap.quickTo(drift, 'y', { duration: 1.1, ease: 'power3.out' })

        let rect = root.getBoundingClientRect()
        let frame = 0
        let idle = 0
        let visible = true

        const measure = () => {
          frame = 0
          rect = root.getBoundingClientRect()
        }
        const scheduleMeasure = () => {
          if (!frame) frame = requestAnimationFrame(measure)
        }

        // Back to looking straight ahead, eased rather than snapped.
        const rest = contextSafe(() => {
          window.clearTimeout(idle)
          eyes.forEach((eye) => {
            eye.x(0)
            eye.y(0)
          })
          driftX(0)
          driftY(0)
        })

        const onMove = contextSafe((event) => {
          if (!visible) return
          const halfW = window.innerWidth / 2
          const halfH = window.innerHeight / 2
          const scale = rect.width / iris.width
          for (const eye of eyes) {
            // Direction from this eye to the cursor, as -1..1 of half the viewport.
            const eyeX = rect.left + eye.cx * scale
            const eyeY = rect.top + eye.cy * scale
            eye.x(clamp((event.clientX - eyeX) / halfW) * iris.maxX * eye.bias.x)
            eye.y(clamp((event.clientY - eyeY) / halfH) * iris.maxY * eye.bias.y)
          }
          const centreX = rect.left + rect.width / 2
          const centreY = rect.top + rect.height / 2
          driftX(clamp((event.clientX - centreX) / halfW) * PARALLAX.x)
          driftY(clamp((event.clientY - centreY) / halfH) * PARALLAX.y)
          window.clearTimeout(idle)
          idle = window.setTimeout(rest, IDLE_MS)
        })

        // Cursor left the window: look ahead again.
        const onOut = (event) => {
          if (!event.relatedTarget) rest()
        }

        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting
          if (visible) scheduleMeasure()
          else rest()
        })
        observer.observe(root)

        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('scroll', scheduleMeasure, { passive: true })
        window.addEventListener('resize', scheduleMeasure)
        document.addEventListener('mouseout', onOut)
        window.addEventListener('blur', rest)

        return () => {
          window.removeEventListener('pointermove', onMove)
          window.removeEventListener('scroll', scheduleMeasure)
          window.removeEventListener('resize', scheduleMeasure)
          document.removeEventListener('mouseout', onOut)
          window.removeEventListener('blur', rest)
          observer.disconnect()
          cancelAnimationFrame(frame)
          window.clearTimeout(idle)
        }
      })
      return () => mm.revert()
    },
    { scope },
  )

  return (
    <div ref={scope} className="relative">
      <div className="portrait-glow" aria-hidden="true" />
      <div data-parallax className="portrait-fade relative">
        <img
          src={portrait}
          srcSet={`${portraitSm} 600w, ${portrait} 900w`}
          sizes="(min-width: 1280px) 440px, (min-width: 1024px) 360px, (min-width: 768px) 340px, (min-width: 640px) 300px, min(62vw, 280px)"
          alt={alt}
          width={iris.width}
          height={iris.height}
          fetchPriority="high"
          draggable="false"
          className="block h-auto w-full select-none"
        />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${iris.width} ${iris.height}`}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {Object.entries(iris.eyes).map(([name, eye]) => (
              <clipPath key={name} id={`hero-eye-${name}`}>
                <polygon points={eye.opening.map((point) => point.join(',')).join(' ')} />
              </clipPath>
            ))}
          </defs>
          {Object.entries(iris.eyes).map(([name, eye]) => (
            <g key={name} clipPath={`url(#hero-eye-${name})`}>
              <image
                data-iris={name}
                href={IRIS_IMAGES[name]}
                x={eye.patch.x}
                y={eye.patch.y}
                width={eye.patch.size}
                height={eye.patch.size}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
