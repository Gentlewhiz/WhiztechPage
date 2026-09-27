import { measurement } from '../data/engineering'
import { site } from '../data/site'
import { SectionHeading } from './SectionHeading'

const rowClass =
  'grid gap-x-8 gap-y-3 py-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] [&>*]:min-w-0'
const textClass = 'max-w-[42rem] space-y-3 text-[0.9375rem] leading-relaxed text-muted'

export function ThisSite() {
  return (
    <section id="this-site" aria-labelledby="this-site-title" className="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeading id="this-site-title" title="How this site is built">
        This portfolio is also a project. Here is what went into it, with the measurements and
        tests to back it up.
      </SectionHeading>

      <dl className="mt-12 divide-y divide-line border-y border-line">
        <div className={rowClass}>
          <dt className="text-lg font-medium tracking-[-0.015em]">Rendering</dt>
          <dd className={textClass}>
            <p>
              Static site generation. At build time React renders each page to HTML, and the browser
              then hydrates it. Text, links and images arrive in the first response and work with
              JavaScript turned off.
            </p>
            <p>
              Everything on these pages is known at build time, so server-side rendering would add a
              server without adding anything a visitor needs. Plain client-side rendering would
              leave the first screen blank until JavaScript ran.
            </p>
          </dd>
        </div>

        <div className={rowClass}>
          <dt className="text-lg font-medium tracking-[-0.015em]">Performance</dt>
          <dd className={textClass}>
            {measurement.rows.length > 0 && (
              // Focusable so keyboard users can scroll the table on narrow screens.
              <div
                className="overflow-x-auto rounded-sm"
                tabIndex={0}
                role="region"
                aria-label="Performance measurements"
              >
                <table className="w-full min-w-[26rem] border-collapse text-left text-sm">
                  <caption className="mb-3 text-left text-[0.9375rem] text-muted">
                    Before and after the changes below, on a phone profile.
                  </caption>
                  <thead>
                    <tr className="border-b border-line text-text">
                      <th scope="col" className="py-2 pr-4 font-medium">Metric</th>
                      <th scope="col" className="py-2 pr-4 font-medium">Before</th>
                      <th scope="col" className="py-2 font-medium">After</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-[0.8125rem]">
                    {measurement.rows.map((row) => (
                      <tr key={row.metric} className="border-b border-line last:border-b-0">
                        <th scope="row" className="py-2 pr-4 font-sans text-sm font-normal text-text">
                          {row.metric}
                        </th>
                        <td className="py-2 pr-4">{row.before}</td>
                        <td className="py-2 text-text">{row.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p>
              The font swap was shifting the layout. Text now renders first in a local fallback font
              resized to Geist&rsquo;s exact metrics, and the main font file is preloaded.
            </p>
            <p>
              The sphere uses CSS 3D transforms and its own small animation loop. GSAP with
              ScrollTrigger drives the scroll effects: the paragraph that lights up as you read,
              the section reveals and the floating navigation. The hero&rsquo;s entrance is plain CSS
              that starts at first paint, and its heading and portrait only slide, never fade from
              invisible, because hiding the largest content until JavaScript runs would delay the
              moment the page looks ready.
            </p>
            <p>
              Screenshots are WebP in two sizes, so phones download the smaller one. Each has fixed
              dimensions so nothing jumps while it loads. Hashed asset files are cached for a year;
              pages revalidate on every visit so updates appear immediately.
            </p>
            <p>
              Not every change was free, and the table shows it. The redesign&rsquo;s scroll effects
              run on GSAP with ScrollTrigger, which took JavaScript on first load from{' '}
              {measurement.redesignCost.js}, Total Blocking Time from {measurement.redesignCost.tbt}{' '}
              and Largest Contentful Paint from {measurement.redesignCost.lcp} on the slow phone
              profile. Earlier, the sphere itself cost about {measurement.sphereCost.js}. The
              eye-tracking portrait is the largest thing in the first screen, so it is served at two
              sizes (61 KB on phones) and marked high priority; Largest Contentful Paint is now 2.48
              seconds on the slow phone profile, just inside the 2.5 second threshold Google calls
              good. On desktop the score is {measurement.desktopScore}. Loading GSAP only once the first screen
              has rendered is the next thing to try; the stylesheet blocking the first paint for
              about 0.3 seconds is the other.
            </p>
            <p className="text-sm">
              {measurement.method} Interaction to Next Paint needs real visitors, so the lab
              uses Total Blocking Time as a stand-in. Measured {measurement.date}.
            </p>
          </dd>
        </div>

        <div className={rowClass}>
          <dt className="text-lg font-medium tracking-[-0.015em]">The project sphere</dt>
          <dd className={textClass}>
            <p>
              Plain CSS 3D transforms, no WebGL or 3D library. Cards sit on a Fibonacci lattice,
              which spreads any number of points evenly over a sphere, so it adapts to however many
              real screenshots there are. The first and last points are offset from the poles, so
              every card can be turned to face you.
            </p>
            <p>
              Rotation and momentum live outside React state and are written straight to the page,
              so dragging never re-renders a component. The animation loop only runs while
              something is moving and stops completely when the sphere is still.
            </p>
            <p>
              Every card is a button you can reach with Tab, and focusing one turns it to the front.
              Each opens a native dialog with the full write-up, and links elsewhere on the page
              open a project directly. A vertical swipe on a phone still scrolls the page. Projects
              without a screenshot get a text card rather than an invented image. With JavaScript
              off, a plain list of projects shows instead.
            </p>
          </dd>
        </div>

        <div className={rowClass}>
          <dt className="text-lg font-medium tracking-[-0.015em]">Motion</dt>
          <dd className={textClass}>
            <p>
              GSAP runs through its React hook, scoped to each component, so every animation and
              scroll trigger is cleaned up when the component goes away.
            </p>
            <p>
              The portrait&rsquo;s eyes follow the cursor. The image is flat, so it is split into
              layers: the portrait with its irises painted out, and each iris cut from the
              original, clipped to the traced outline of its eye so it can never cross a lid or the
              glasses. At rest the layers reproduce the original exactly. Each iris moves at most a
              few pixels through one reusable tween per axis, with no React state involved, and
              only for a mouse or trackpad while the hero is on screen. After a short pause the
              eyes ease back to looking straight ahead.
            </p>
            <p>
              Reveals fade with opacity, never visibility. Content hidden with visibility drops out
              of what screen readers can reach, so they could not find a section until it had been
              scrolled past on screen. If keyboard focus lands in something not yet revealed, it
              finishes at once. The scroll-lit paragraph moves from the muted colour to the full one
              rather than from near-invisible, so it passes contrast at every point. With reduced
              motion switched on, none of it runs.
            </p>
          </dd>
        </div>

        <div className={rowClass}>
          <dt className="text-lg font-medium tracking-[-0.015em]">Security</dt>
          <dd className={textClass}>
            <p>
              A Content Security Policy only allows scripts, styles, fonts and images from this site,
              and the page may not contact any other address. The one inline script, which applies
              your theme before the page paints, is allowed by its SHA-256 hash rather than by
              switching inline scripts on. Headers also block framing and MIME-type sniffing.
            </p>
            <p>
              There is no form: contact is a plain email link, so the site collects nothing. There
              are no logins, cookies or stored tokens, so session attacks such as cross-site
              request forgery have nothing to target here.
            </p>
          </dd>
        </div>

        <div className={rowClass}>
          <dt className="text-lg font-medium tracking-[-0.015em]">Testing</dt>
          <dd className={textClass}>
            <p>
              30 unit and integration tests (Vitest and Testing Library) cover the contact form, the
              theme switch, the mobile menu, the screenshot stack, the sphere&rsquo;s geometry and
              keyboard use, the content data, and a check that the security policy matches the
              page&rsquo;s inline script.
            </p>
            <p>
              18 end-to-end scenarios (Playwright) run against the production build on a desktop and
              a phone profile. They check the page works without JavaScript, the security headers
              are served, the page contacts no third party, the portrait&rsquo;s eyes follow the
              cursor and settle, stay still with reduced motion or touch, and never collide with the
              hero text, the floating navigation appears and hides, the sphere can be dragged, clicked and used from the keyboard, content waiting
              to be revealed stays reachable, nothing scrolls sideways on a phone, and no console
              errors or policy violations occur. That last check caught a real bug: a small
              image inlined by the build would have been blocked by the security policy.
            </p>
            {site.repo && (
              <p>
                <a href={site.repo} className="link" target="_blank" rel="noreferrer">
                  Read the source and tests on GitHub
                </a>
              </p>
            )}
          </dd>
        </div>
      </dl>
    </section>
  )
}
