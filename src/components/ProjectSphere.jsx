import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { sphereItems } from '../data/projects'
import { cardTransform, facingAngles, fibonacciSphere, rotate } from '../lib/sphere'
import { ShotDialog } from './ShotDialog'

// useLayoutEffect warns during server rendering (the page is prerendered).
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const DEGREES_PER_PIXEL = 0.13
const FRICTION = 0.94
const PITCH_LIMIT = 32
const REST_TILT = -6

// Starting rotation that leaves the middle clear, so no card sits over the heading at rest.
function clearestYaw(points) {
  let best = { yaw: 0, gap: -1 }
  for (let yaw = 0; yaw < 360; yaw += 3) {
    let gap = Infinity
    for (const point of points) {
      const p = rotate(point, yaw, REST_TILT)
      if (p.z > 0.3) gap = Math.min(gap, Math.hypot(p.x, p.y * 1.6))
    }
    if (gap > best.gap) best = { yaw, gap }
  }
  return best.yaw
}

function sizing(width, height, count) {
  const radius = Math.max(120, Math.min(420, height * 0.4, width * 0.44))
  // Card size follows the number of cards, so a small set still covers the sphere.
  // 0.47 of the radius suits about 21 cards; fewer cards get proportionally larger ones.
  const scale = Math.min(0.74, 0.47 * Math.sqrt(21 / Math.max(count, 1)))
  const cardWidth = Math.round(Math.max(84, radius * scale))
  const perspective = width <= 380 ? 620 : width <= 640 ? 760 : width <= 900 ? 920 : 1150
  return { radius, cardWidth, perspective }
}

/*
  The projects as a sphere of real screenshots. Each card opens a dialog with the full
  write-up. Every card is a button, so the sphere works from the keyboard, and without
  JavaScript a plain list of projects is shown instead (see Work.jsx).

  React state holds only which screenshot is open and whether layout has run.
  Rotation, velocity and drag live in a ref, and a requestAnimationFrame loop
  writes transforms straight to the DOM. The loop only runs while something moves.
*/
export function ProjectSphere({ headingId, children }) {
  const items = useMemo(() => sphereItems(), [])
  const points = useMemo(() => fibonacciSphere(items.length), [items.length])

  const stageRef = useRef(null)
  const worldRef = useRef(null)
  const cardRefs = useRef([])
  const motion = useRef({
    yaw: 0,
    pitch: 0,
    velYaw: 0,
    velPitch: 0,
    target: null,
    dragging: false,
    radius: 300,
    perspective: 1150,
    size: { width: 0, height: 0 },
    depth: [],
    frame: 0,
    reduced: false,
  })

  const [ready, setReady] = useState(false)
  const [openIndex, setOpenIndex] = useState(-1)
  // Read by pointer handlers, which are attached once and would otherwise see a stale value.
  const openIndexRef = useRef(-1)
  useEffect(() => {
    openIndexRef.current = openIndex
  }, [openIndex])

  // Writes the current rotation to the DOM. Never touches React state.
  const render = useCallback(() => {
    const m = motion.current
    const sx = REST_TILT + m.pitch
    const sy = m.yaw
    if (worldRef.current) worldRef.current.style.transform = `rotateY(${sy}deg) rotateX(${sx}deg)`
    points.forEach((point, i) => {
      const card = cardRefs.current[i]
      if (!card) return
      const z = rotate(point, sy, sx).z
      const base = 0.16 + 0.84 * ((z + 1) / 2) ** 0.85
      const shade = Math.round((1 - base) * 100) / 100
      if (m.depth[i] !== shade) {
        m.depth[i] = shade
        card.style.setProperty('--d', String(shade))
        // Cards facing away are not useful targets.
        card.classList.toggle('is-back', z < -0.35)
      }
    })
  }, [points])

  // The loop reschedules itself through a ref, so `tick` never refers to itself.
  const tickRef = useRef(null)
  const tick = useCallback(() => {
    const m = motion.current
    m.frame = 0
    if (!m.dragging) {
      if (m.target) {
        const ease = m.reduced ? 1 : 0.14
        m.yaw += (m.target.yaw - m.yaw) * ease
        m.pitch += (m.target.pitch - m.pitch) * ease
        if (Math.abs(m.target.yaw - m.yaw) < 0.05 && Math.abs(m.target.pitch - m.pitch) < 0.05) {
          m.yaw = m.target.yaw
          m.pitch = m.target.pitch
          m.target = null
        }
      } else {
        m.yaw += m.velYaw
        m.pitch += m.velPitch
        m.velYaw *= FRICTION
        m.velPitch *= FRICTION
        if (Math.abs(m.velYaw) < 0.002) m.velYaw = 0
        if (Math.abs(m.velPitch) < 0.002) m.velPitch = 0
      }
    }
    m.pitch = Math.max(-PITCH_LIMIT - REST_TILT, Math.min(PITCH_LIMIT - REST_TILT, m.pitch))
    render()
    const moving = m.dragging || m.target || m.velYaw !== 0 || m.velPitch !== 0
    if (moving) m.frame = requestAnimationFrame(() => tickRef.current())
  }, [render])
  useEffect(() => {
    tickRef.current = tick
  }, [tick])

  const kick = useCallback(() => {
    const m = motion.current
    if (!m.frame) m.frame = requestAnimationFrame(() => tickRef.current())
  }, [])

  // Size the sphere to the stage and place every card.
  const layout = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const m = motion.current
    const { width, height } = stage.getBoundingClientRect()
    const { radius, cardWidth, perspective } = sizing(width, height, items.length)
    m.radius = radius
    m.size = { width, height }
    stage.style.perspective = `${perspective}px`
    points.forEach((point, i) => {
      const card = cardRefs.current[i]
      if (!card) return
      const tall = items[i].kind === 'mobile'
      const w = tall ? Math.round(cardWidth * 0.52) : cardWidth
      const h = tall ? Math.round(cardWidth * 1.12) : Math.round(cardWidth / 1.5)
      card.style.width = `${w}px`
      card.style.height = `${h}px`
      card.style.marginLeft = `${-w / 2}px`
      card.style.marginTop = `${-h / 2}px`
      card.style.transform = cardTransform(point, radius)
    })
    m.depth = []
    render()
  }, [items, points, render])

  useIsomorphicLayoutEffect(() => {
    const m = motion.current
    m.yaw = clearestYaw(points)
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    m.reduced = query.matches
    const onMotionChange = (event) => {
      m.reduced = event.matches
    }
    query.addEventListener('change', onMotionChange)

    layout()
    setReady(true)

    // Relayout on real size changes only. Mobile URL bars and scrollbars change the
    // size by a few pixels; ignoring changes under 20px avoids needless work.
    let pending = 0
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (Math.abs(width - m.size.width) < 20 && Math.abs(height - m.size.height) < 20) return
      cancelAnimationFrame(pending)
      pending = requestAnimationFrame(layout)
    })
    observer.observe(stageRef.current)

    return () => {
      query.removeEventListener('change', onMotionChange)
      m.yaw = 0
      observer.disconnect()
      cancelAnimationFrame(pending)
      cancelAnimationFrame(m.frame)
      m.frame = 0
    }
  }, [layout, points])

  // Dragging. Mouse and pen rotate at once. Touch waits until the gesture is clearly
  // sideways, so a vertical swipe still scrolls the page.
  useEffect(() => {
    const stage = stageRef.current
    const m = motion.current
    let pointer = null

    const onDown = (event) => {
      if (openIndexRef.current !== -1 || event.button > 0) return
      const card = event.target.closest('[data-card]')
      pointer = {
        id: event.pointerId,
        type: event.pointerType,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        card: card ? Number(card.dataset.card) : -1,
        moved: 0,
        active: event.pointerType !== 'touch',
      }
      m.target = null
      m.velYaw = 0
      m.velPitch = 0
      if (pointer.active) {
        m.dragging = true
        stage.setPointerCapture(event.pointerId)
        kick()
      }
    }

    const onMove = (event) => {
      if (!pointer || event.pointerId !== pointer.id) return
      const dx = event.clientX - pointer.lastX
      const dy = event.clientY - pointer.lastY
      pointer.moved = Math.max(
        pointer.moved,
        Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY),
      )

      if (!pointer.active) {
        if (pointer.moved < 10) return
        const totalX = Math.abs(event.clientX - pointer.startX)
        const totalY = Math.abs(event.clientY - pointer.startY)
        if (totalY > totalX * 1.15) {
          pointer = null // Vertical: let the page scroll.
          return
        }
        pointer.active = true
        m.dragging = true
        stage.setPointerCapture(event.pointerId)
        kick()
      }

      pointer.lastX = event.clientX
      pointer.lastY = event.clientY
      m.velYaw = dx * DEGREES_PER_PIXEL
      m.velPitch = -dy * DEGREES_PER_PIXEL
      m.yaw += m.velYaw
      m.pitch += m.velPitch
    }

    const onUp = (event) => {
      if (!pointer || event.pointerId !== pointer.id) return
      const slop = pointer.type === 'touch' ? 14 : 6
      const tapped = pointer.moved < slop && pointer.card !== -1
      m.dragging = false
      if (m.reduced || tapped) {
        m.velYaw = 0
        m.velPitch = 0
      }
      if (tapped) setOpenIndex(pointer.card)
      pointer = null
      kick()
    }

    const onCancel = () => {
      pointer = null
      m.dragging = false
      kick()
    }

    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onCancel)
    return () => {
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onCancel)
    }
  }, [kick])

  // Keyboard: focusing a card turns the sphere so that card faces the viewer.
  const onCardFocus = (index) => (event) => {
    if (!event.currentTarget.matches(':focus-visible')) return
    const m = motion.current
    const { yaw, pitch } = facingAngles(points[index], PITCH_LIMIT)
    // Take the short way round.
    const turns = Math.round((m.yaw - yaw) / 360)
    m.target = { yaw: yaw + turns * 360, pitch: pitch - REST_TILT }
    m.velYaw = 0
    m.velPitch = 0
    kick()
  }

  // Pointer clicks are handled in pointerup (pointer capture retargets them).
  // Keyboard activation arrives as a click with detail 0.
  const onCardClick = (index) => (event) => {
    if (event.detail === 0) setOpenIndex(index)
  }

  // Links such as #project-rest-countries (used by the Skills section) open that project.
  useEffect(() => {
    const openFromHash = () => {
      const match = window.location.hash.match(/^#project-(.+)$/)
      if (!match) return
      const index = items.findIndex((item) => item.project.id === match[1])
      if (index === -1) return
      const m = motion.current
      const { yaw, pitch } = facingAngles(points[index], PITCH_LIMIT)
      m.target = { yaw: yaw + Math.round((m.yaw - yaw) / 360) * 360, pitch: pitch - REST_TILT }
      kick()
      stageRef.current?.scrollIntoView({ block: 'center', behavior: m.reduced ? 'auto' : 'smooth' })
      setOpenIndex(index)
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [items, points, kick])

  const closeDialog = useCallback(() => {
    const index = openIndexRef.current
    // Drop a #project-… hash so the same link works again next time.
    if (window.location.hash.startsWith('#project-')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    setOpenIndex(-1)
    // Return focus to the card that opened the dialog, without scrolling the page.
    requestAnimationFrame(() => cardRefs.current[index]?.focus({ preventScroll: true }))
  }, [])

  return (
    <div className="sphere-wrap">
      <div
        ref={stageRef}
        className={`sphere${ready ? ' is-ready' : ''}`}
        role="group"
        aria-labelledby={headingId}
        aria-describedby="sphere-hint"
      >
        <div ref={worldRef} className="sphere-world">
          <div className="sphere-orb">
            {items.map((item, i) => (
              <button
                key={`${item.project.title}-${item.caption}`}
                ref={(node) => {
                  cardRefs.current[i] = node
                }}
                type="button"
                data-card={i}
                className={`sphere-card${item.kind === 'mobile' ? ' is-tall' : ''}`}
                aria-label={`${item.project.title}, ${item.caption}. Open ${item.kind === 'text' ? 'details' : 'screenshot'}`}
                onFocus={onCardFocus(i)}
                onClick={onCardClick(i)}
              >
                {item.kind === 'text' ? (
                  <span className="sphere-text-card" aria-hidden="true">
                    <span className="sphere-text-title">{item.project.title}</span>
                    <span className="sphere-text-stack">{item.project.stack.join(', ')}</span>
                    <span className="sphere-text-note">{item.caption}</span>
                  </span>
                ) : (
                  <img src={item.card} alt="" loading="lazy" decoding="async" draggable="false" />
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Flat, above the 3D world, on the same centre point. Inside the world, tilted
            cards could intersect the heading's plane and slice through the words. */}
        <div className="sphere-headline">
          <div className="sphere-headline-inner">{children}</div>
        </div>
      </div>

      <p id="sphere-hint" className="sphere-hint">
        <span className="sphere-hint-line" aria-hidden="true" />
        Drag to turn. Select a card to open the project.
      </p>

      <ShotDialog
        items={items}
        index={openIndex}
        onNavigate={setOpenIndex}
        onClose={closeDialog}
        originRef={cardRefs}
      />
    </div>
  )
}
