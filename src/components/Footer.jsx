import { site } from '../data/site'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        {/* The year is baked in at build time; the browser may differ around New Year. */}
        <p suppressHydrationWarning>
          &copy; {new Date().getFullYear()} {site.name}. {site.brand}.
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a href="#top" className="hover:text-text">
              Back to top
            </a>
          </li>
          <li>
            <a href="./privacy.html" className="hover:text-text">
              Privacy
            </a>
          </li>
          <li>
            <a href={site.links.github} className="hover:text-text" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
