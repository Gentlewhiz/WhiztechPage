import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Contact } from '../../src/components/Contact'

describe('contact section', () => {
  it('uses plain mailto links, with no form to fill in', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: 'damolaaya@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:damolaaya@gmail.com',
    )
    expect(screen.getByRole('link', { name: 'Email me' })).toHaveAttribute(
      'href',
      'mailto:damolaaya@gmail.com',
    )
    expect(document.querySelector('form, input, textarea')).toBeNull()
  })

  it('copies the address and says so', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<Contact />)

    await user.click(screen.getByRole('button', { name: 'Copy email' }))

    expect(writeText).toHaveBeenCalledWith('damolaaya@gmail.com')
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Email address copied')
  })

  it('links to the other ways to get in touch', () => {
    render(<Contact />)
    for (const name of ['GitHub', 'LinkedIn', 'X', 'WhatsApp']) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', expect.stringMatching(/^https:/))
    }
  })
})
