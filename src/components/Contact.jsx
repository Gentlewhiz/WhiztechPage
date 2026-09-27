import { useRef, useState } from 'react'
import { site } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import { ContactButton } from './ContactButton'

const socials = [
  { label: 'GitHub', href: site.links.github },
  { label: 'LinkedIn', href: site.links.linkedin },
  { label: 'X', href: site.links.x },
  { label: 'WhatsApp', href: site.links.whatsapp },
]

/* No form and no third-party service: a plain mailto link, so nothing is collected. */
export function Contact() {
  const scope = useRef(null)
  const [copied, setCopied] = useState(false)
  useReveal(scope)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section
      id="contact"
      ref={scope}
      aria-labelledby="contact-title"
      className="flex min-h-[80svh] flex-col items-center justify-center gap-10 px-5 py-24 text-center sm:px-8"
    >
      <h2
        id="contact-title"
        data-reveal
        data-y="40"
        className="display text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-[-0.045em]"
      >
        Contact
      </h2>
      <p data-reveal className="max-w-[32rem] text-lg leading-relaxed text-muted">
        Have a role, a project or a question about my work? Email me and I&rsquo;ll reply as soon
        as I can.
      </p>
      <a
        data-reveal
        href={`mailto:${site.email}`}
        className="break-all text-[clamp(1.35rem,4.6vw,3.75rem)] font-semibold tracking-[-0.03em] underline decoration-line decoration-1 underline-offset-[0.2em] transition-colors hover:decoration-accent"
      >
        {site.email}
      </a>
      <div data-reveal className="flex flex-wrap items-center justify-center gap-4">
        <ContactButton>Email me</ContactButton>
        <button type="button" onClick={copyEmail} className="btn btn-quiet">
          {copied ? 'Copied' : 'Copy email'}
        </button>
        <span role="status" className="sr-only">
          {copied ? 'Email address copied' : ''}
        </span>
      </div>
      <ul data-reveal className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm uppercase tracking-widest">
        {socials.map((social) => (
          <li key={social.label}>
            <a href={social.href} className="text-muted transition-colors hover:text-text" target="_blank" rel="noreferrer">
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
