import { useCallback, useEffect, useRef } from 'react'

const EASE = 'cubic-bezier(.22,.61,.36,1)'
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Transform that places `plate` over `origin` (both DOMRects), used to animate
// the plate out of the card it was opened from (FLIP: first, last, invert, play).
function invert(origin, plate) {
  const scale = Math.max(0.04, origin.width / plate.width)
  const dx = origin.left + origin.width / 2 - (plate.left + plate.width / 2)
  const dy = origin.top + origin.height / 2 - (plate.top + plate.height / 2)
  return `translate(${dx}px, ${dy}px) scale(${scale})`
}

export function ShotDialog({ items, index, onNavigate, onClose, originRef }) {
  const dialogRef = useRef(null)
  const plateRef = useRef(null)
  const closing = useRef(false)
  const item = index >= 0 ? items[index] : null

  const animatePlate = useCallback(
    (direction) => {
      const plate = plateRef.current
      const origin = originRef.current[index]
      if (!plate?.animate || !origin || reducedMotion()) return Promise.resolve()
      const from = invert(origin.getBoundingClientRect(), plate.getBoundingClientRect())
      const frames = [
        { transform: from, opacity: 0 },
        { transform: 'none', opacity: 1 },
      ]
      const animation = plate.animate(direction === 'in' ? frames : frames.reverse(), {
        duration: direction === 'in' ? 520 : 360,
        easing: EASE,
        fill: 'both',
      })
      return animation.finished.catch(() => {})
    },
    [index, originRef],
  )

  // Open when an index is set; content updates in place when navigating.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || index < 0 || dialog.open) return
    closing.current = false
    dialog.showModal()
    animatePlate('in')
  }, [index, animatePlate])

  const requestClose = useCallback(async () => {
    const dialog = dialogRef.current
    if (!dialog?.open || closing.current) return
    closing.current = true
    await animatePlate('out')
    plateRef.current?.getAnimations?.().forEach((animation) => animation.cancel())
    dialog.close()
  }, [animatePlate])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined
    const onCancel = (event) => {
      // Escape: animate out instead of closing instantly.
      event.preventDefault()
      requestClose()
    }
    const onClosed = () => {
      closing.current = false
      onClose()
    }
    dialog.addEventListener('cancel', onCancel)
    dialog.addEventListener('close', onClosed)
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      dialog.removeEventListener('close', onClosed)
    }
  }, [requestClose, onClose])

  const step = (delta) => onNavigate((index + delta + items.length) % items.length)

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') step(1)
    if (event.key === 'ArrowLeft') step(-1)
  }

  // A click on the dialog element itself is a click on the backdrop.
  const onDialogClick = (event) => {
    if (event.target === dialogRef.current) requestClose()
  }

  const project = item?.project
  const description = project?.summary ?? project?.practised

  return (
    // The dialog handles Escape, focus trapping and making the page inert.
    <dialog
      ref={dialogRef}
      className="shot-dialog"
      aria-labelledby="shot-title"
      onClick={onDialogClick}
      onKeyDown={onKeyDown}
    >
      {item && (
        <div ref={plateRef} className="shot-plate">
          {item.kind === 'text' ? (
            <div className="shot-close-row">
              <button type="button" className="shot-close is-inline" onClick={requestClose}>
                Close
              </button>
            </div>
          ) : (
            <figure className="shot-figure">
              <img
                key={item.src}
                src={item.src}
                srcSet={item.srcSm ? `${item.srcSm} ${Math.round(item.width / 2)}w, ${item.src} ${item.width}w` : undefined}
                sizes="(min-width: 900px) 860px, 92vw"
                alt={item.alt}
                width={item.width}
                height={item.height}
                className={item.kind === 'mobile' ? 'is-tall' : undefined}
              />
              <button type="button" className="shot-close" onClick={requestClose}>
                Close
              </button>
            </figure>
          )}

          <div className="shot-meta">
            <div>
              <h2 id="shot-title" className="shot-title">
                {project.title}
              </h2>
              <p className="shot-caption">
                {item.caption}
                <span className="sr-only">. Card {index + 1} of {items.length}.</span>
              </p>
              <p className="shot-links">
                <a href={project.live} className="link" target="_blank" rel="noreferrer">
                  Live site<span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a href={project.source} className="link" target="_blank" rel="noreferrer">
                  Source code<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
              <p className="shot-stack">{project.stack.join(', ')}</p>
            </div>
            <div>
              <p className="shot-description">{description}</p>
              {project.highlights && (
                <>
                  <h3 className="shot-subhead">How it works</h3>
                  <ul className="shot-list">
                    {project.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </>
              )}
              {project.nextStep && (
                <>
                  <h3 className="shot-subhead">What I&rsquo;d improve next</h3>
                  <p className="shot-description">{project.nextStep}</p>
                </>
              )}
              {project.brief && (
                <p className="shot-note">
                  Design from{' '}
                  <a href={project.brief} className="link" target="_blank" rel="noreferrer">
                    Frontend Mentor
                  </a>
                  . I wrote the code.
                </p>
              )}
            </div>
          </div>

          <div className="shot-nav">
            <button type="button" className="btn btn-quiet" onClick={() => step(-1)}>
              Previous
            </button>
            <span className="shot-count" aria-hidden="true">
              {index + 1} / {items.length}
            </span>
            <button type="button" className="btn btn-quiet" onClick={() => step(1)}>
              Next
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
