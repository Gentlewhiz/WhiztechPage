import { describe, expect, it } from 'vitest'
import { facingAngles, fibonacciSphere, rotate } from '../../src/lib/sphere'

describe('sphere geometry', () => {
  it('places the requested number of points on the unit sphere', () => {
    for (const n of [1, 3, 10, 21]) {
      const points = fibonacciSphere(n)
      expect(points).toHaveLength(n)
      for (const p of points) expect(Math.hypot(p.x, p.y, p.z)).toBeCloseTo(1, 9)
    }
  })

  it('keeps every card off the poles so it can be turned to face the viewer', () => {
    for (const p of fibonacciSphere(10)) expect(Math.abs(p.lat)).toBeLessThan(70)
  })

  it('orients each card to face outwards from the centre', () => {
    for (const p of fibonacciSphere(10)) {
      const normal = rotate({ x: 0, y: 0, z: 1 }, p.lon, p.lat)
      expect(normal.x * p.x + normal.y * p.y + normal.z * p.z).toBeCloseTo(1, 6)
    }
  })

  it('turns any card to the horizontal centre, as far forward as the tilt limit allows', () => {
    for (const p of fibonacciSphere(10)) {
      const { yaw, pitch } = facingAngles(p, 32)
      expect(Math.abs(pitch)).toBeLessThanOrEqual(32)
      const front = rotate(p, yaw, pitch)
      expect(front.x).toBeCloseTo(0, 6)
      expect(front.z).toBeGreaterThan(0.6)
    }
  })
})
