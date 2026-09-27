import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import Privacy from './Privacy'
import './index.css'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <Privacy />
  </StrictMode>
)

// Production HTML is prerendered at build time (scripts/prerender.mjs), so React
// attaches to the existing markup. The dev server serves an empty root instead.
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)
