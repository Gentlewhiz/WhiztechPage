// Turns the client-rendered build into static HTML (static site generation).
// Runs after `vite build` and `vite build --ssr`; see "build" in package.json.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { inlineScriptHashes, netlifyHeadersFile, vercelConfig } from './security-headers.mjs'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const ssrDir = resolve(root, 'dist-ssr')

const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href)

// Preload the one font every visitor needs for the first screen.
const assets = await readdir(resolve(dist, 'assets'))
const bodyFont = assets.find((file) => /^geist-latin-wght-normal-.*\.woff2$/.test(file))
if (!bodyFont) throw new Error('Could not find the Geist latin font in dist/assets')
const preload = `<link rel="preload" href="./assets/${bodyFont}" as="font" type="font/woff2" crossorigin />`

const pages = [
  { name: 'index', file: 'index.html' },
  { name: 'privacy', file: 'privacy.html' },
]

let scriptHashes = []
for (const page of pages) {
  const path = resolve(dist, page.file)
  let html = await readFile(path, 'utf8')
  if (!html.includes('<div id="root"></div>')) throw new Error(`No empty root in ${page.file}`)
  // The SSR build writes asset URLs as /assets/...; make them relative like the
  // client build so the site also works under a sub-path (GitHub Pages).
  const markup = render(page.name).replace(/(["\s])\/assets\//g, '$1./assets/')
  html = html
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
    .replace('</title>', `</title>\n    ${preload}`)
  await writeFile(path, html)
  scriptHashes = [...new Set([...scriptHashes, ...inlineScriptHashes(html)])]
}

await writeFile(resolve(dist, '_headers'), netlifyHeadersFile(scriptHashes))
await writeFile(resolve(root, 'vercel.json'), `${JSON.stringify(vercelConfig(scriptHashes), null, 2)}\n`)
await rm(ssrDir, { recursive: true, force: true })

console.log(`Prerendered ${pages.length} pages. CSP allows ${scriptHashes.length} inline script(s).`)
