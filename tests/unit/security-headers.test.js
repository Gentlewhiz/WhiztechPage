import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  contentSecurityPolicy,
  inlineScriptHashes,
  vercelConfig,
} from '../../scripts/security-headers.mjs'

const root = resolve(import.meta.dirname, '../..')
const read = (file) => readFileSync(resolve(root, file), 'utf8')

describe('content security policy', () => {
  it('hashes inline scripts and ignores external ones', () => {
    const html = '<script>console.log(1)</script><script type="module" src="./a.js"></script>'
    const hashes = inlineScriptHashes(html)
    expect(hashes).toHaveLength(1)
    expect(hashes[0]).toMatch(/^'sha256-[A-Za-z0-9+/]+=*'$/)
  })

  it('never allows unsafe-inline or unsafe-eval', () => {
    const csp = contentSecurityPolicy(["'sha256-abc='"])
    expect(csp).not.toContain('unsafe-inline')
    expect(csp).not.toContain('unsafe-eval')
    expect(csp).toContain("frame-ancestors 'none'")
  })

  it('lets the page contact no third party at all', () => {
    const csp = contentSecurityPolicy([])
    expect(csp).toContain("connect-src 'self';")
    expect(csp).not.toMatch(/https?:\/\//)
  })

  // If someone edits the theme script in index.html, vercel.json must be
  // regenerated (npm run build), or the browser will block the script.
  it('keeps vercel.json in sync with the inline scripts in the HTML', () => {
    const hashes = [
      ...new Set(['index.html', 'privacy.html'].flatMap((file) => inlineScriptHashes(read(file)))),
    ]
    const committed = JSON.parse(read('vercel.json'))
    expect(committed).toEqual(vercelConfig(hashes))
  })
})
