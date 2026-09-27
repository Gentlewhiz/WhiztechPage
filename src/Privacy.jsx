import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { site } from './data/site'

// Plain-language notice. It describes what this site actually does; it is not legal advice.
export default function Privacy() {
  return (
    <>
      <Header home="./" alwaysVisible />
      <main id="top" className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <h1 className="text-[2.25rem] font-semibold leading-tight tracking-[-0.035em] sm:text-[2.75rem]">
          Privacy
        </h1>
        <p className="mt-4 text-muted">Last updated September 2026.</p>

        <div className="mt-12 space-y-10 text-[1.0625rem] leading-relaxed text-muted [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-text">
          <section>
            <h2>What this site collects</h2>
            <p>
              Nothing. There are no forms, cookies, analytics or tracking scripts, and fonts and
              images are served from this site, not from third parties. The contact link opens
              your own email app; anything you send goes straight to my inbox like any other email.
            </p>
          </section>

          <section>
            <h2>Your theme setting</h2>
            <p>
              If you switch between light and dark mode, the choice is saved in your
              browser&rsquo;s local storage so it&rsquo;s remembered next time. It never leaves
              your device.
            </p>
          </section>

          <section>
            <h2>Links to other sites</h2>
            <p>
              Project, GitHub, LinkedIn, X and WhatsApp links take you to other services with their
              own privacy practices.
            </p>
          </section>

          <section>
            <h2>Deleting your email</h2>
            <p>
              If you&rsquo;ve emailed me and want the message deleted, email{' '}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>{' '}
              and I&rsquo;ll remove it.
            </p>
          </section>
        </div>

        <p className="mt-14">
          <a href="./" className="link">
            Back to the portfolio
          </a>
        </p>
      </main>
      <Footer />
    </>
  )
}
