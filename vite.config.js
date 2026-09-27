import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { inlineScriptHashes, securityHeaders } from './scripts/security-headers.mjs'

// Adds canonical, og:url and og:image tags once VITE_SITE_URL is set in .env.
// Social platforms need absolute URLs for these, so they are left out until the domain is known.
function siteUrlTags(siteUrl) {
  return {
    name: 'site-url-tags',
    transformIndexHtml(html, ctx) {
      if (!siteUrl) {
        if (ctx.bundle) console.warn('\n[site-url-tags] VITE_SITE_URL is empty: canonical and og:image tags were skipped.\n')
        return html
      }
      const page = ctx.path.endsWith('privacy.html') ? '/privacy.html' : '/'
      return {
        html,
        tags: [
          { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}${page}` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${siteUrl}${page}` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image', content: `${siteUrl}/og-image.png` }, injectTo: 'head' },
        ],
      }
    },
  }
}

// `npm run preview` serves the build with the same headers production uses,
// so a CSP violation shows up locally and in the end-to-end tests.
function previewHeaders() {
  const pages = ['index.html', 'privacy.html'].map((file) => resolve(import.meta.dirname, 'dist', file))
  if (!pages.every(existsSync)) return {}
  const hashes = [...new Set(pages.flatMap((page) => inlineScriptHashes(readFileSync(page, 'utf8'))))]
  return securityHeaders(hashes)
}

export default defineConfig(({ mode, isSsrBuild, isPreview }) => {
  const env = loadEnv(mode, process.cwd())
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/+$/, '')

  return {
    // A relative base keeps asset paths working on a custom domain and on a
    // GitHub Pages project URL (username.github.io/repo/) without changes.
    base: './',
    plugins: [react(), tailwindcss(), !isSsrBuild && siteUrlTags(siteUrl)],
    publicDir: isSsrBuild ? false : 'public',
    build: isSsrBuild
      ? { assetsInlineLimit: 0 }
      : {
          // Never inline small assets as data: URLs. The Content Security Policy only
          // allows images from this site (img-src 'self'), so an inlined image would be
          // blocked. Caught by the end-to-end CSP check.
          assetsInlineLimit: 0,
          rollupOptions: {
            input: {
              main: resolve(import.meta.dirname, 'index.html'),
              privacy: resolve(import.meta.dirname, 'privacy.html'),
            },
          },
        },
    preview: { headers: isPreview ? previewHeaders() : {} },
    test: {
      environment: 'jsdom',
      setupFiles: ['./tests/setup.js'],
      include: ['tests/unit/**/*.test.{js,jsx}'],
    },
  }
})
