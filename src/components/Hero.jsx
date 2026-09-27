import { navItems, site } from '../data/site'
import { ContactButton } from './ContactButton'
import { HeroPortrait } from './HeroPortrait'
import { ThemeToggle } from './ThemeToggle'

/*
  The entrance is CSS, not GSAP, and starts at first paint. The heading and portrait
  are the largest things on screen (the Largest Contentful Paint), so they only slide
  into place and are never hidden. Fading them in from invisible would delay the
  moment the page counts as loaded. The portrait's eye tracking is in HeroPortrait.
*/
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip"
    >
      <nav aria-label="Main" className="enter px-5 pt-6 sm:px-10 md:pt-8">
        <ul className="flex items-center justify-between gap-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-sm font-medium uppercase tracking-wider text-text transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>

      <div className="overflow-hidden">
        <h1
          id="hero-title"
          className="display rise-only mt-6 w-full whitespace-nowrap text-center text-[12.4vw] font-black uppercase leading-none tracking-[-0.045em] sm:mt-4 md:-mt-2"
        >
          Hi, I&rsquo;m Ibrahim
        </h1>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between gap-6 px-5 pb-7 sm:px-10 sm:pb-8 md:pb-10">
        <p className="enter enter-2 max-w-44 text-[clamp(0.75rem,1.3vw,1.3rem)] font-light uppercase leading-snug tracking-wide text-text sm:max-w-[15rem] md:max-w-[18rem]">
          {site.name}. {site.tagline}
        </p>
        <div className="enter enter-3">
          <ContactButton href="#contact" />
        </div>
      </div>

      {/* Centred. Below the lg breakpoint it sits in the middle of the hero, clear of
          the bottom text and button; from lg it rests on the bottom edge. */}
      <div className="rise-only rise-portrait absolute left-1/2 top-[54%] z-10 w-[min(62vw,280px)] -translate-x-1/2 -translate-y-1/2 sm:w-[300px] md:w-[340px] lg:bottom-0 lg:top-auto lg:w-[360px] lg:translate-y-0 xl:w-[440px]">
        <HeroPortrait alt={site.photoAlt} />
      </div>
    </section>
  )
}
