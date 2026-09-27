// Geometry for the project sphere. Pure functions, no DOM, so they can be unit tested.

const RAD = Math.PI / 180
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

/**
 * Spreads n points evenly over a unit sphere (Fibonacci lattice).
 * Returns CSS-space unit vectors (y points down) plus the card orientation.
 *
 * Uses the half-step offset (i + 0.5) so no card sits exactly on a pole. With only
 * ten or so cards, two cards on the poles would be a fifth of the work, and the
 * pitch limit means a pole card can never be turned to face the viewer.
 */
export function fibonacciSphere(n) {
  const points = []
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2
    const radius = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = i * GOLDEN_ANGLE
    const x = Math.cos(theta) * radius
    const z = Math.sin(theta) * radius
    points.push({
      x,
      y: -y,
      z,
      lat: Math.asin(y) / RAD,
      lon: Math.atan2(x, z) / RAD,
    })
  }
  return points
}

/**
 * Where a point ends up after the world transform `rotateY(yaw) rotateX(pitch)`.
 * CSS applies the rightmost function first, so pitch is applied before yaw.
 * Positive z is towards the viewer.
 */
export function rotate({ x, y, z }, yawDeg, pitchDeg) {
  const a = pitchDeg * RAD
  const b = yawDeg * RAD
  const y1 = y * Math.cos(a) - z * Math.sin(a)
  const z1 = y * Math.sin(a) + z * Math.cos(a)
  return {
    x: x * Math.cos(b) + z1 * Math.sin(b),
    y: y1,
    z: -x * Math.sin(b) + z1 * Math.cos(b),
  }
}

/**
 * Yaw and pitch that bring a point as close to the front as the pitch limit allows.
 * Pitch is applied before yaw, so the two interact. For each allowed pitch, the yaw
 * that centres the point horizontally is solved exactly; the pitch that brings the
 * point nearest the viewer wins.
 */
export function facingAngles(point, limit = 32) {
  let best = { yaw: 0, pitch: 0, z: -Infinity }
  for (let pitch = -limit; pitch <= limit; pitch += 0.5) {
    const a = pitch * RAD
    const x = point.x
    const z = point.y * Math.sin(a) + point.z * Math.cos(a)
    const yaw = Math.atan2(-x, z) / RAD
    const front = rotate(point, yaw, pitch).z
    if (front > best.z) best = { yaw, pitch, z: front }
  }
  return { yaw: best.yaw, pitch: best.pitch }
}

/** Card transform on the sphere: move to the surface, then face outwards. */
export function cardTransform(point, radius) {
  return `translate3d(${point.x * radius}px, ${point.y * radius}px, ${point.z * radius}px) rotateY(${point.lon}deg) rotateX(${point.lat}deg)`
}
