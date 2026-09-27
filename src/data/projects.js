// Project content. Every claim below was checked against the project's source code.
// Screenshots are real renders of each project's own code, not the design files.

import restHomeDark from '../assets/projects/rest-countries-home-dark.webp'
import restHomeDarkSm from '../assets/projects/rest-countries-home-dark-sm.webp'
import restHomeLight from '../assets/projects/rest-countries-home-light.webp'
import restHomeLightSm from '../assets/projects/rest-countries-home-light-sm.webp'
import restDetail from '../assets/projects/rest-countries-detail-dark.webp'
import restDetailSm from '../assets/projects/rest-countries-detail-dark-sm.webp'
import restMobile from '../assets/projects/rest-countries-home-mobile.webp'
import restMobileSm from '../assets/projects/rest-countries-home-mobile-sm.webp'
import soleilDesktop from '../assets/projects/maison-soleil-desktop.webp'
import soleilDesktopSm from '../assets/projects/maison-soleil-desktop-sm.webp'
import soleilMobile from '../assets/projects/maison-soleil-mobile.webp'
import soleilMobileSm from '../assets/projects/maison-soleil-mobile-sm.webp'
import restHomeDarkCard from '../assets/projects/rest-countries-home-dark-card.webp'
import restHomeLightCard from '../assets/projects/rest-countries-home-light-card.webp'
import restDetailCard from '../assets/projects/rest-countries-detail-dark-card.webp'
import restMobileCard from '../assets/projects/rest-countries-home-mobile-card.webp'
import soleilDesktopCard from '../assets/projects/maison-soleil-desktop-card.webp'
import soleilMobileCard from '../assets/projects/maison-soleil-mobile-card.webp'
import extensions from '../assets/projects/browser-extensions.webp'
import extensionsSm from '../assets/projects/browser-extensions-sm.webp'
import extensionsCard from '../assets/projects/browser-extensions-card.webp'
import ticket from '../assets/projects/conference-ticket.webp'
import ticketSm from '../assets/projects/conference-ticket-sm.webp'
import ticketCard from '../assets/projects/conference-ticket-card.webp'
import mortgage from '../assets/projects/mortgage-calculator.webp'
import mortgageSm from '../assets/projects/mortgage-calculator-sm.webp'
import mortgageCard from '../assets/projects/mortgage-calculator-card.webp'
import age from '../assets/projects/age-calculator.webp'
import ageSm from '../assets/projects/age-calculator-sm.webp'
import ageCard from '../assets/projects/age-calculator-card.webp'

const FRONTEND_MENTOR = 'https://www.frontendmentor.io'

/*
  shots[0] is the front screenshot. kind: 'desktop' (16:10 frame) or 'mobile'
  (phone frame that overlaps the stack). An empty shots array is allowed: the
  project renders without media in production and shows a labelled placeholder
  during development so you know what to add.
*/
export const featuredProjects = [
  {
    id: 'rest-countries',
    title: 'REST Countries',
    summary:
      'A country explorer. Search 250 countries by name, filter by region, and follow border links from one country to the next.',
    highlights: [
      'Each country has its own route keyed by its three-letter code (/country/NGA), so detail pages can be shared and border countries link to each other.',
      'Search and region filtering are plain functions over the dataset, kept out of the components so they stay easy to test and reuse.',
      'The theme lives in React context: it starts from the system preference, is saved to localStorage, and still works when storage is blocked.',
      'Searches with no matches show an empty state instead of a blank grid.',
    ],
    stack: ['React 19', 'React Router 7', 'Context API', 'Tailwind CSS', 'Vite'],
    // Measured from the production build: dist/assets/index-*.js.
    nextStep:
      'The whole 250-country dataset (404 KB of JSON) is bundled into the main JavaScript file, which comes to 526 KB, or 136 KB gzipped. Loading the data separately and trimming it to the fields the interface uses would cut the first download.',
    live: 'https://rest-countries-ap-i.vercel.app/',
    source: 'https://github.com/Gentlewhiz/Rest-Countries-ApI',
    brief: FRONTEND_MENTOR,
    shots: [
      {
        src: restHomeDark,
        srcSm: restHomeDarkSm,
        card: restHomeDarkCard,
        caption: 'Home, dark mode',
        width: 1600,
        height: 1000,
        kind: 'desktop',
        alt: 'REST Countries home page in dark mode, showing a grid of country cards with flags, a search field and a region filter.',
      },
      {
        src: restDetail,
        srcSm: restDetailSm,
        card: restDetailCard,
        caption: 'Country detail page',
        width: 1600,
        height: 1000,
        kind: 'desktop',
        alt: 'Country detail page for Nigeria with its flag, population, capital, currencies, languages and border country buttons.',
      },
      {
        src: restHomeLight,
        srcSm: restHomeLightSm,
        card: restHomeLightCard,
        caption: 'Home, light mode',
        width: 1600,
        height: 1000,
        kind: 'desktop',
        alt: 'REST Countries home page in light mode.',
      },
      {
        src: restMobile,
        srcSm: restMobileSm,
        card: restMobileCard,
        caption: 'Home on a phone',
        width: 520,
        height: 1125,
        kind: 'mobile',
        alt: 'REST Countries on a phone screen, with country cards in a single column.',
      },
    ],
  },
  {
    id: 'maison-soleil',
    title: 'Maison Soleil booking confirmation',
    summary:
      'A booking confirmation page for a small guesthouse: an itemised receipt, a note from the host, and the arrival, wifi and breakfast details a guest needs.',
    highlights: [
      'The receipt and welcome card sit in a stack that fans apart on hover, built with Tailwind group-hover transforms and no JavaScript.',
      '“Add to calendar” generates an .ics file in the browser, and “Print receipt” opens the print dialog.',
      'The wifi password copies with one tap, falling back to an older method on browsers without the Clipboard API.',
      'On small screens the sidebar becomes a menu that locks page scroll while open and closes when a link is chosen.',
    ],
    stack: ['HTML', 'Tailwind CSS', 'JavaScript'],
    live: 'https://gentlewhiz.github.io/HotelComfirmationPage/',
    source: 'https://github.com/Gentlewhiz/HotelComfirmationPage',
    brief: FRONTEND_MENTOR,
    shots: [
      {
        src: soleilDesktop,
        srcSm: soleilDesktopSm,
        card: soleilDesktopCard,
        caption: 'Desktop layout',
        width: 1600,
        height: 1089,
        kind: 'desktop',
        alt: 'Maison Soleil confirmation page on desktop: sidebar navigation, a receipt and an orange welcome card, and cards for arrival, wifi and breakfast.',
      },
      {
        src: soleilMobile,
        srcSm: soleilMobileSm,
        card: soleilMobileCard,
        caption: 'Phone layout',
        width: 520,
        height: 1125,
        kind: 'mobile',
        alt: 'Maison Soleil confirmation page on a phone screen.',
      },
    ],
  },
  {
    id: 'ip-address-tracker',
    title: 'IP Address Tracker',
    summary:
      'Look up any IP address or domain and see where it is on a map, along with its timezone and internet provider.',
    highlights: [
      'Detects whether the input is an IPv4 address, an IPv6 address or a domain, and sends the matching query to the IPify Geolocation API.',
      'A Leaflet map with a custom marker flies to each new result.',
      'The form is disabled while a request is in flight, and errors are announced to screen readers with role="alert" and aria-invalid.',
    ],
    stack: ['JavaScript', 'Tailwind CSS', 'Leaflet', 'IPify API'],
    nextStep:
      'The IPify API key sits in client-side code, so anyone can read it and spend the quota. Sending requests through a small serverless function would keep the key on the server.',
    live: 'https://gentlewhiz.github.io/Ip-address-tracker/',
    source: 'https://github.com/Gentlewhiz/Ip-address-tracker',
    brief: FRONTEND_MENTOR,
    // TODO: add a screenshot of a completed search (desktop, 1440 × 900 or larger).
    // Save it to src/assets/projects/ and add it here like the entries above.
    shots: [],
    missingShot: 'Screenshot of a completed search on desktop, with the map showing a location',
  },
]

export const archiveProjects = [
  {
    id: 'browser-extensions',
    title: 'Browser extensions manager',
    practised:
      'Loads the list from JSON, filters all, active and inactive, toggles and removes items, and remembers the light or dark theme.',
    stack: ['JavaScript', 'CSS'],
    live: 'https://gentlewhiz.github.io/BrowserExtension/',
    source: 'https://github.com/Gentlewhiz/BrowserExtension',
    shots: [
      {
        src: extensions,
        srcSm: extensionsSm,
        card: extensionsCard,
        width: 1600,
        height: 1067,
        kind: 'desktop',
        caption: 'Extension list',
        alt: 'Browser extensions manager in light mode: a grid of extension cards with toggles and All, Active and Inactive filters.',
      },
    ],
  },
  {
    id: 'conference-ticket',
    title: 'Conference ticket generator',
    practised:
      'A form with drag-and-drop avatar upload, file type and 500 KB size checks, and field validation before the ticket is generated.',
    stack: ['JavaScript', 'CSS'],
    live: 'https://gentlewhiz.github.io/conference-ticket-generator/',
    source: 'https://github.com/Gentlewhiz/conference-ticket-generator',
    shots: [
      {
        src: ticket,
        srcSm: ticketSm,
        card: ticketCard,
        width: 1600,
        height: 1067,
        kind: 'desktop',
        caption: 'Ticket form',
        alt: 'Conference ticket form with an avatar upload area and fields for name, email and GitHub username.',
      },
    ],
  },
  {
    id: 'mortgage-calculator',
    title: 'Mortgage repayment calculator',
    practised:
      'Works out the monthly payment and total repaid for repayment and interest-only mortgages, with required-field validation.',
    stack: ['JavaScript', 'CSS'],
    live: 'https://mortagecal.vercel.app/',
    source: 'https://github.com/Gentlewhiz/mortagecal',
    shots: [
      {
        src: mortgage,
        srcSm: mortgageSm,
        card: mortgageCard,
        width: 1600,
        height: 1067,
        kind: 'desktop',
        caption: 'Calculator form',
        alt: 'Mortgage calculator with amount, term and interest rate fields, mortgage type options and an empty results panel.',
      },
    ],
  },
  {
    id: 'age-calculator',
    title: 'Age calculator',
    practised:
      'Turns a birth date into years, months and days, checking each field’s range and rejecting dates in the future.',
    stack: ['JavaScript', 'CSS'],
    live: 'https://gentlewhiz.github.io/Agecal/',
    source: 'https://github.com/Gentlewhiz/Agecal',
    shots: [
      {
        src: age,
        srcSm: ageSm,
        card: ageCard,
        width: 1600,
        height: 1067,
        kind: 'desktop',
        caption: 'Empty state',
        alt: 'Age calculator with day, month and year fields and a result that reads years, months and days.',
      },
    ],
  },
  {
    // No screenshot: the repository is missing its stylesheet, so a render from source
    // would not match the live site. Add a real screenshot of the live page if you want it on the sphere.
    id: 'social-links',
    title: 'Social links profile',
    practised: 'A small responsive profile card with a list of social links.',
    stack: ['HTML', 'CSS'],
    live: 'https://socialpage-one.vercel.app/',
    source: 'https://github.com/Gentlewhiz/socialpage',
  },
]

// One card per real screenshot, for the project sphere. A project without a screenshot
// gets a text card instead of an invented image, so it is still on the page.
// Featured projects come first so the first cards are the strongest work.
export function sphereItems() {
  const items = []
  const add = (project, featured) => {
    const shots = project.shots ?? []
    if (shots.length === 0) {
      items.push({ kind: 'text', caption: 'No screenshot yet', project, featured })
      return
    }
    for (const shot of shots) items.push({ ...shot, project, featured })
  }
  featuredProjects.forEach((project) => add(project, true))
  archiveProjects.forEach((project) => add(project, false))
  return items
}

export const allProjects = [...featuredProjects, ...archiveProjects]
