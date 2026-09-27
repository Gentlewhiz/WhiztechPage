import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroPortrait } from '../../src/components/HeroPortrait'
import iris from '../../src/data/portrait.json'

// Ray casting: is (x, y) inside the polygon?
function inside([x, y], polygon) {
  let hit = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

describe('portrait eye geometry', () => {
  const extremes = []
  for (const dx of [-iris.maxX, 0, iris.maxX]) for (const dy of [-iris.maxY, 0, iris.maxY]) extremes.push([dx, dy])

  it('keeps each pupil inside its eye at every extreme of the movement', () => {
    for (const eye of Object.values(iris.eyes)) {
      const pupil = eye.r * 0.45
      for (const [dx, dy] of extremes) {
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
          const point = [eye.cx + dx + Math.cos(a) * pupil, eye.cy + dy + Math.sin(a) * pupil]
          expect(inside(point, eye.opening)).toBe(true)
        }
      }
    }
  })

  it('moves only a few pixels', () => {
    expect(iris.maxX).toBeLessThanOrEqual(12)
    expect(iris.maxY).toBeLessThanOrEqual(6)
  })

  it('places each iris patch centred on its measured iris, inside the image', () => {
    for (const eye of Object.values(iris.eyes)) {
      const { x, y, size } = eye.patch
      expect(Math.abs(x + size / 2 - eye.cx)).toBeLessThan(1)
      expect(Math.abs(y + size / 2 - eye.cy)).toBeLessThan(1)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x + size).toBeLessThanOrEqual(iris.width)
    }
  })
})

describe('hero portrait', () => {
  it('is one described image, with the eye layers hidden from assistive technology', () => {
    const { container } = render(<HeroPortrait alt="Illustrated portrait" />)
    expect(container.querySelectorAll('img')).toHaveLength(1)
    expect(container.querySelector('img')).toHaveAttribute('alt', 'Illustrated portrait')
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('clipPath')).toHaveLength(2)
    expect(container.querySelectorAll('[data-iris]')).toHaveLength(2)
  })

  it('renders the eyes looking straight ahead without JavaScript', () => {
    const { container } = render(<HeroPortrait alt="" />)
    for (const image of container.querySelectorAll('[data-iris]')) {
      expect(image.getAttribute('transform')).toBeNull()
    }
  })
})
