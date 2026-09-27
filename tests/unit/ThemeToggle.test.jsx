import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ThemeToggle } from '../../src/components/ThemeToggle'

describe('theme toggle', () => {
  it('reflects the theme set before React loaded', () => {
    document.documentElement.classList.add('dark')
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches the theme and remembers the choice', async () => {
    const user = userEvent.setup()
    document.documentElement.classList.add('dark')
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: 'Dark theme' }))

    expect(document.documentElement).not.toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('light')
    expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('still switches when storage is blocked', async () => {
    const user = userEvent.setup()
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = () => {
      throw new Error('blocked')
    }
    try {
      render(<ThemeToggle />)
      await user.click(screen.getByRole('button', { name: 'Dark theme' }))
      expect(document.documentElement).toHaveClass('dark')
    } finally {
      Storage.prototype.setItem = original
    }
  })
})
