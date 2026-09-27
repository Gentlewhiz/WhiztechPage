import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Skills } from './components/Skills'
import { ThisSite } from './components/ThisSite'
import { Work } from './components/Work'
import { useHashTarget, useScrollTriggerRefresh } from './hooks/useHashTarget'

export default function App() {
  useHashTarget()
  useScrollTriggerRefresh()

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-accent px-4 py-2 font-medium text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <ThisSite />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
