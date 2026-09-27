import { expect, test } from '@playwright/test'

// Fails the test on any console error, uncaught exception or CSP violation.
test.beforeEach(async ({ page }) => {
  const problems = []
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.error(`CSP blocked ${event.blockedURI} (${event.violatedDirective})`)
    })
  })
  page.problems = problems
})
test.afterEach(async ({ page }) => {
  expect(page.problems, page.problems.join('\n')).toEqual([])
})

test('the page is prerendered and readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  page.problems = []
  await page.goto('./')
  await expect(page.getByRole('heading', { level: 1, name: 'Hi, I’m Ibrahim' })).toBeVisible()
  // The sphere needs JavaScript, so a plain list of every project shows instead.
  for (const title of ['REST Countries', 'Maison Soleil booking confirmation', 'IP Address Tracker']) {
    await expect(page.getByRole('heading', { level: 3, name: title })).toBeVisible()
  }
  await context.close()
})

test('serves the Content Security Policy and other security headers', async ({ page }) => {
  const response = await page.goto('./')
  const headers = response.headers()
  expect(headers['content-security-policy']).toContain("script-src 'self' 'sha256-")
  expect(headers['content-security-policy']).not.toContain('unsafe-inline')
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
})

test('hydrates without errors and the theme choice survives a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('./')
  const toggle = page.getByRole('button', { name: 'Dark theme' }).first()
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')

  await toggle.click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)

  await page.reload()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await expect(page.getByRole('button', { name: 'Dark theme' }).first()).toHaveAttribute('aria-pressed', 'false')
})

test('contact is a plain email link, with no form and no third-party requests', async ({ page }) => {
  const outside = []
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4173/')) outside.push(request.url())
  })
  await page.goto('./#contact')
  await expect(page.locator('#contact').getByRole('link', { name: 'damolaaya@gmail.com' })).toHaveAttribute(
    'href',
    'mailto:damolaaya@gmail.com',
  )
  await expect(page.locator('#contact form')).toHaveCount(0)
  // Scroll the whole page so every lazy image and effect loads, then check.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(500)
  expect(outside).toEqual([])
})

test('the floating navigation appears after the hero and hides again at the top', async ({ page }) => {
  await page.goto('./')
  const pill = page.locator('.pill-nav')
  await expect(pill).toBeHidden()
  await page.locator('#skills').scrollIntoViewIfNeeded()
  await expect(pill).toBeVisible()
  await pill.getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/#contact$/)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect(pill).toBeHidden()
})

test('the skip link moves focus past the navigation', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard test')
  await page.goto('./')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

test('the privacy page loads and links home', async ({ page }) => {
  await page.goto('./privacy.html')
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to the portfolio' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Hi, I’m Ibrahim' })).toBeVisible()
})

test('nothing makes the page scroll sideways', async ({ page }) => {
  await page.goto('./')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBe(0)
})

test.describe('project sphere', () => {
  test('dragging turns it, clicking a card opens that project, Escape returns focus', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mouse drag test; touch is covered by the scroll test below')
    await page.goto('./')
    const stage = page.getByRole('group', { name: 'My projects' })
    await stage.scrollIntoViewIfNeeded()
    const world = page.locator('.sphere-world')
    const before = await world.evaluate((el) => el.style.transform)

    const box = await stage.boundingBox()
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.8)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.8, { steps: 8 })
    await page.mouse.up()
    await expect.poll(() => world.evaluate((el) => el.style.transform)).not.toBe(before)

    // Click the card nearest the viewer.
    const front = await page.evaluate(() => {
      let best
      let depth = 2
      for (const card of document.querySelectorAll('[data-card]')) {
        const d = Number(card.style.getPropertyValue('--d'))
        if (d < depth) [best, depth] = [card, d]
      }
      const r = best.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: best.getAttribute('aria-label') }
    })
    await page.mouse.click(front.x, front.y)
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(front.label.split(',')[0])

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page.locator(':focus')).toHaveAttribute('data-card', /\d+/)
  })

  test('a keyboard user can reach every card, and focus turns it to the front', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Keyboard test')
    await page.goto('./')
    const cards = page.locator('[data-card]')
    const count = await cards.count()
    await cards.first().focus()
    for (let i = 1; i < count; i++) await page.keyboard.press('Tab')
    const last = page.locator(':focus')
    await expect(last).toHaveAttribute('data-card', String(count - 1))
    await expect.poll(() => last.evaluate((el) => Number(el.style.getPropertyValue('--d')))).toBeLessThan(0.1)
  })

  test('a link in Skills opens that project on the sphere', async ({ page }) => {
    await page.goto('./')
    await page.locator('#skills').getByRole('link', { name: 'REST Countries' }).first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('REST Countries')
    await dialog.getByRole('button', { name: 'Close' }).click()
    await expect(dialog).toBeHidden()
    await expect(page).not.toHaveURL(/#project-/)
  })

  test('a vertical swipe over the sphere still scrolls the page', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Touch test')
    await page.goto('./')
    await expect(page.locator('.sphere')).toHaveCSS('touch-action', 'pan-y')
  })

  test('without JavaScript the heading shows and the cards are hidden', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    page.problems = []
    await page.goto('./')
    await expect(page.getByRole('heading', { level: 2, name: 'My projects' })).toBeVisible()
    await expect(page.locator('.sphere-world')).toBeHidden()
    await context.close()
  })
})

test('content waiting to be revealed stays reachable, and focus finishes the reveal', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard test')
  await page.goto('./')
  // Far below the fold and not yet revealed, but still in the accessibility tree.
  const link = page.locator('#skills').getByRole('link', { name: 'REST Countries' }).first()
  await expect(link).toBeAttached()
  // Tab onto it so the focus is keyboard focus.
  await page.locator('#skills-title').evaluate((el) => {
    el.tabIndex = -1
    el.focus()
  })
  await page.keyboard.press('Tab')
  await expect(link).toBeFocused()
  const row = page.locator('#skills dl > div').first()
  await expect.poll(() => row.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
})

test.describe('hero portrait', () => {
  const irisOffsets = (page) =>
    page.evaluate(() =>
      [...document.querySelectorAll('[data-iris]')].map((element) => {
        const transform = element.transform.baseVal.consolidate()
        return transform ? [transform.matrix.e, transform.matrix.f] : [0, 0]
      }),
    )

  test('the eyes follow the cursor, stay within bounds, and return when it stops', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Needs a mouse')
    await page.goto('./')
    const size = page.viewportSize()

    await page.mouse.move(size.width - 10, size.height / 2, { steps: 5 })
    await expect.poll(async () => (await irisOffsets(page)).every(([x]) => x > 3)).toBe(true)

    await page.mouse.move(10, size.height / 2, { steps: 5 })
    await expect.poll(async () => (await irisOffsets(page)).every(([x]) => x < -3)).toBe(true)

    await page.mouse.move(size.width / 2, 5, { steps: 5 })
    await expect.poll(async () => (await irisOffsets(page)).every(([, y]) => y < -1)).toBe(true)
    for (const [x, y] of await irisOffsets(page)) {
      expect(Math.abs(x)).toBeLessThanOrEqual(9.01)
      expect(Math.abs(y)).toBeLessThanOrEqual(4.01)
    }

    // No movement for a while: back to looking straight ahead.
    await expect
      .poll(async () => (await irisOffsets(page)).every(([x, y]) => Math.abs(x) < 0.05 && Math.abs(y) < 0.05), {
        timeout: 6000,
      })
      .toBe(true)
  })

  test('with reduced motion the eyes stay still', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Needs a mouse')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    await page.mouse.move(5, 5, { steps: 5 })
    await page.mouse.move(1200, 700, { steps: 5 })
    await page.waitForTimeout(700)
    expect(await irisOffsets(page)).toEqual([
      [0, 0],
      [0, 0],
    ])
  })

  test('on a touch screen the portrait stays still', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Touch test')
    await page.goto('./')
    await page.touchscreen.tap(30, 400)
    await page.waitForTimeout(700)
    expect(await irisOffsets(page)).toEqual([
      [0, 0],
      [0, 0],
    ])
  })

  test('the portrait never collides with the headline, text or button', async ({ page }) => {
    await page.goto('./')
    const overlap = await page.evaluate(() => {
      const box = (element) => element.getBoundingClientRect()
      const area = (a, b) =>
        Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
        Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
      const portrait = box(document.querySelector('[data-parallax] img'))
      const range = document.createRange()
      range.selectNodeContents(document.querySelector('#hero-title'))
      return [range.getBoundingClientRect(), box(document.querySelector('#top p')), box(document.querySelector('#top .btn-glow'))].map(
        (other) => area(portrait, other),
      )
    })
    expect(overlap).toEqual([0, 0, 0])
  })
})
