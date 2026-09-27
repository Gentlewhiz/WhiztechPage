import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is prerendered at build time (scripts/prerender.mjs), so React
// attaches to the existing markup. The dev server serves an empty root instead.
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)
