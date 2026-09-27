// Evidence for "How this site is built". Every number here was measured, not estimated.
// Before: the client-rendered build (no prerendering, GSAP in the main bundle, no font fallback).
// After: this build. Re-measure on the live URL with PageSpeed Insights and update.

export const measurement = {
  method:
    'Lighthouse 13 lab runs on the production build, median of three, simulated mid-range phone on a slow 4G connection.',
  date: 'September 2026',
  // "after" is the current build: premium redesign, eye-tracking portrait, no marquee.
  rows: [
    { metric: 'Largest Contentful Paint', before: '2.33 s', after: '2.48 s' },
    { metric: 'First Contentful Paint', before: '2.09 s', after: '1.94 s' },
    { metric: 'Cumulative Layout Shift', before: '0.056', after: '0' },
    { metric: 'Total Blocking Time', before: '78 ms', after: '115 ms' },
    { metric: 'JavaScript on first load, gzipped', before: '107 KB', after: '130 KB' },
    { metric: 'Lighthouse performance score', before: '95', after: '95' },
  ],
  desktopScore: '98',
  // Same lab setup, just before and after the redesign's scroll effects.
  redesignCost: { js: '85 → 129 KB', tbt: '37 → 132 ms', lcp: '2.25 → 2.61 s' },
  // Same lab setup, measured just before and after adding the sphere.
  sphereCost: { js: '4 KB', tbt: '84 → 112 ms', lcp: '2.06 → 2.23 s' },
}
