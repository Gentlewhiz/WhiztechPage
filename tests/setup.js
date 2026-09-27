import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
  document.documentElement.className = ''
  localStorage.clear()
})

// jsdom has no matchMedia or IntersectionObserver.
window.matchMedia ??= vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
}))
// jsdom has no clipboard.
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => {} }, configurable: true })
}
window.IntersectionObserver ??= class {
  observe() {}
  disconnect() {}
}

// jsdom has no <dialog> behaviour, ResizeObserver or Web Animations.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close() {
    if (!this.open) return
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}
Element.prototype.scrollIntoView ??= function scrollIntoView() {}
window.ResizeObserver ??= class {
  observe() {}
  disconnect() {}
}
