import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ProjectSphere } from '../../src/components/ProjectSphere'
import { sphereItems } from '../../src/data/projects'

const renderSphere = () =>
  render(
    <ProjectSphere headingId="t">
      <h2 id="t">Selected work</h2>
    </ProjectSphere>,
  )

describe('project sphere', () => {
  it('shows one real screenshot card per shot, each named after its project', () => {
    renderSphere()
    const group = screen.getByRole('group', { name: 'Selected work' })
    const cards = within(group).getAllByRole('button')
    expect(cards).toHaveLength(sphereItems().length)
    expect(cards[0]).toHaveAccessibleName(/^REST Countries, .+\. Open screenshot$/)
  })

  it('does not invent content: every card is a real screenshot or an explicit text card', () => {
    for (const item of sphereItems()) {
      expect(item.caption).toBeTruthy()
      if (item.kind === 'text') expect(item.card).toBeUndefined()
      else expect(item.card).toBeTruthy()
      expect(item.project.live).toMatch(/^https:/)
      expect(item.project.source).toMatch(/^https:/)
    }
  })

  it('opens a screenshot from the keyboard and pages through with the buttons', async () => {
    const user = userEvent.setup()
    renderSphere()
    const first = screen.getAllByRole('button', { name: /Open screenshot/ })[0]
    first.focus()
    await user.keyboard('{Enter}')

    const dialog = document.querySelector('dialog')
    expect(dialog).toHaveAttribute('open')
    expect(within(dialog).getByRole('heading', { name: 'REST Countries' })).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /Live site/ })).toHaveAttribute(
      'href',
      'https://rest-countries-ap-i.vercel.app/',
    )

    await user.click(within(dialog).getByRole('button', { name: 'Previous' }))
    const last = sphereItems().at(-1)
    expect(within(dialog).getByRole('heading', { name: last.project.title })).toBeInTheDocument()
  })

  it('gives a project without a screenshot a text card instead of an invented image', () => {
    renderSphere()
    const card = screen.getByRole('button', { name: 'IP Address Tracker, No screenshot yet. Open details' })
    expect(card.querySelector('img')).toBeNull()
  })

  it('puts the full write-up in the dialog', async () => {
    const user = userEvent.setup()
    renderSphere()
    screen.getAllByRole('button', { name: /^REST Countries/ })[0].focus()
    await user.keyboard('{Enter}')
    const dialog = document.querySelector('dialog')
    expect(within(dialog).getByRole('heading', { name: 'How it works' })).toBeInTheDocument()
    expect(within(dialog).getAllByRole('listitem').length).toBeGreaterThan(2)
    expect(within(dialog).getByRole('heading', { name: 'What I’d improve next' })).toBeInTheDocument()
  })

  it('opens a project from a #project- link', () => {
    window.location.hash = '#project-maison-soleil'
    renderSphere()
    const dialog = document.querySelector('dialog')
    expect(dialog).toHaveAttribute('open')
    expect(within(dialog).getByRole('heading', { level: 2 })).toHaveTextContent('Maison Soleil')
  })

  it('closes the screenshot with the Close button', async () => {
    const user = userEvent.setup()
    renderSphere()
    screen.getAllByRole('button', { name: /Open screenshot/ })[1].focus()
    await user.keyboard('{Enter}')
    const dialog = document.querySelector('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Close' }))
    expect(dialog).not.toHaveAttribute('open')
  })
})
