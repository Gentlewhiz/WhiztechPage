import { site } from '../data/site'

// The one "loud" control on the page: a purple pill with an inner glow and an
// inset white outline. White text stays above 6:1 contrast across the gradient.
export function ContactButton({ href = `mailto:${site.email}`, children = 'Contact me' }) {
  return (
    <a href={href} className="btn-glow">
      {children}
    </a>
  )
}
