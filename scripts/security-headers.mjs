import { createHash } from 'node:crypto'

// Single source of truth for the HTTP headers. scripts/prerender.mjs writes them
// to dist/_headers (Netlify, Cloudflare Pages) and vercel.json (Vercel), and
// vite.config.js applies them to `npm run preview` so tests run under the real CSP.

/** SHA-256 hashes of every inline <script> in an HTML string, in CSP format. */
export function inlineScriptHashes(html) {
  const hashes = []
  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attrs) || !body.trim()) continue
    hashes.push(`'sha256-${createHash('sha256').update(body).digest('base64')}'`)
  }
  return hashes
}

export function contentSecurityPolicy(scriptHashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes.join(' ')}`.trim(),
    "style-src 'self'",
    "img-src 'self'",
    "font-src 'self'",
    // The page talks to no third parties at all.
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ')
}

export function securityHeaders(scriptHashes) {
  return {
    'Content-Security-Policy': contentSecurityPolicy(scriptHashes),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  }
}

// Hashed files in /assets never change content under the same name, so browsers
// may keep them for a year. HTML must revalidate so new deploys show up at once.
export const cacheHeaders = {
  assets: 'public, max-age=31536000, immutable',
  html: 'public, max-age=0, must-revalidate',
}

export function netlifyHeadersFile(scriptHashes) {
  const lines = ['/*']
  for (const [key, value] of Object.entries(securityHeaders(scriptHashes))) lines.push(`  ${key}: ${value}`)
  lines.push(`  Cache-Control: ${cacheHeaders.html}`, '', '/assets/*', `  Cache-Control: ${cacheHeaders.assets}`, '')
  return lines.join('\n')
}

export function vercelConfig(scriptHashes) {
  const toList = (object) => Object.entries(object).map(([key, value]) => ({ key, value }))
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    headers: [
      { source: '/(.*)', headers: toList({ ...securityHeaders(scriptHashes), 'Cache-Control': cacheHeaders.html }) },
      { source: '/assets/(.*)', headers: toList({ 'Cache-Control': cacheHeaders.assets }) },
    ],
  }
}
