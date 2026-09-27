import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from '../../src/components/Header'

describe('floating navigation', () => {
  it('lists the sections in page order', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation', { name: 'Sections' })
    const links = within(nav).getAllByRole('link').map((link) => link.getAttribute('href'))
    expect(links).toEqual(['#about', '#skills', '#work', '#contact'])
  })

  it('starts hidden on the home page, where the hero has its own navigation', () => {
    render(<Header />)
    expect(document.querySelector('.pill-nav')).not.toHaveAttribute('data-visible')
  })

  it('is always shown on other pages, and links back to the home page sections', () => {
    render(<Header home="./" alwaysVisible />)
    expect(document.querySelector('.pill-nav')).toHaveAttribute('data-visible')
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', './#work')
  })
})
