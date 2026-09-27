import { useRef } from 'react'
import { site } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import { AnimatedWords } from './AnimatedWords'
import { ContactButton } from './ContactButton'

const STATEMENT =
  'I turn design files into sites that hold up on any screen, built with React, JavaScript and Tailwind CSS. I care about the parts that are easy to skip: loading and error states, keyboard access, and light and dark themes that both feel finished.'

export function About() {
  const scope = useRef(null)
  useReveal(scope)

  return (
    <section
      id="about"
      ref={scope}
      aria-labelledby="about-title"
      className="flex min-h-[100svh] flex-col items-center justify-center gap-16 px-5 py-24 text-center sm:gap-20 sm:px-8 md:gap-24"
    >
      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <h2
          id="about-title"
          data-reveal
          data-y="40"
          className="display text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-[-0.045em]"
        >
          About me
        </h2>
        <div className="max-w-[36rem] space-y-6">
          <AnimatedWords
            text={STATEMENT}
            className="text-[clamp(1.05rem,2vw,1.4rem)] font-medium leading-relaxed"
          />
          <p data-reveal className="text-[0.9375rem] leading-relaxed text-muted">
            I&rsquo;m {site.name}. I started with HTML, CSS and plain JavaScript, and I&rsquo;m now
            going deeper into React. Alongside that I&rsquo;m learning to add AI features to
            frontend apps; there&rsquo;s nothing to show for it yet, and when there is, it will be
            here.
          </p>
        </div>
      </div>
      <div data-reveal>
        <ContactButton href="#contact" />
      </div>
    </section>
  )
}
