// Skills grouped by capability. Each one points at the work that shows it.
// `projects` are ids from projects.js and link to that project on the page.

export const skillGroups = [
  {
    title: 'Frontend',
    skills: [
      {
        name: 'React',
        primary: true,
        detail: 'Components, routing with React Router, and shared state with context.',
        projects: ['rest-countries'],
      },
      {
        name: 'JavaScript',
        detail:
          'Fetching data and handling API errors, form validation, file uploads, filtering, and saving preferences to localStorage.',
        projects: ['ip-address-tracker', 'maison-soleil'],
        more: 'and most of the smaller builds',
      },
      {
        name: 'HTML and CSS',
        detail: 'Semantic markup, CSS Grid and Flexbox.',
        more: 'Every project here',
      },
      {
        name: 'Tailwind CSS',
        detail: 'Responsive layouts, dark mode, and hover and focus states.',
        projects: ['rest-countries', 'maison-soleil', 'ip-address-tracker'],
      },
    ],
  },
  {
    title: 'Engineering',
    skills: [
      {
        name: 'Responsive design',
        detail: 'Layouts that are designed for phones, not just shrunk: collapsing navigation, single-column grids.',
        projects: ['maison-soleil', 'rest-countries'],
      },
      {
        name: 'Accessibility',
        detail:
          'Labelled controls, aria-expanded on menus, errors announced to screen readers, visible focus.',
        projects: ['ip-address-tracker', 'maison-soleil'],
      },
      {
        name: 'Git',
        detail: 'Every project is versioned on GitHub and deployed through GitHub Pages or Vercel.',
        link: { label: 'GitHub profile', href: 'https://github.com/Gentlewhiz' },
      },
    ],
  },
]

// Honest about stage: these are being learned, not claimed as expertise.
export const growingInto = [
  {
    name: 'Performance',
    detail: 'Measuring Core Web Vitals, then fixing what the numbers show.',
    onThisSite: true,
  },
  {
    name: 'Web security',
    detail: 'Content Security Policy, security headers, and handling user input safely.',
    onThisSite: true,
  },
  {
    name: 'Testing',
    detail: 'Unit and integration tests with Vitest and Testing Library, end-to-end tests with Playwright.',
    onThisSite: true,
  },
  {
    name: 'Advanced React architecture',
    detail: 'Code splitting, rendering strategies and structuring larger apps.',
  },
  {
    name: 'AI integration',
    detail: 'Adding AI features to frontend apps. Projects will appear here once there is work worth showing.',
  },
]
