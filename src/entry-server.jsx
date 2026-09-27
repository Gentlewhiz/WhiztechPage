import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import Privacy from './Privacy'

// Used only at build time by scripts/prerender.mjs.
const pages = { index: App, privacy: Privacy }

export function render(page) {
  const Page = pages[page]
  return renderToString(
    <StrictMode>
      <Page />
    </StrictMode>,
  )
}
