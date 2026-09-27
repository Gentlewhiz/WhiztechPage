import { defineConfig, devices } from '@playwright/test'

// End-to-end tests run against the real production build, served by
// `vite preview` with the same security headers as production (see vite.config.js).
// Run `npm run build` first. First time on a new machine: `npx playwright install chromium`.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:4173/',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npx vite preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: !process.env.CI,
  },
})
