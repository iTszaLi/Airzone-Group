// Playwright config for the site QA suites (scripts/qa/*.spec.mjs).
// By default it serves the production build (run `pnpm run build` first) on
// QA_PORT; set QA_BASE_URL to test a server that is already running instead.
import { defineConfig } from '@playwright/test';

const port = Number(process.env.QA_PORT || 4310);
const baseURL = process.env.QA_BASE_URL || `http://127.0.0.1:${port}`;
// Uses the installed Google Chrome; set QA_CHANNEL=chromium after
// `pnpm exec playwright install chromium` on machines without Chrome.
const channel = process.env.QA_CHANNEL || 'chrome';

export default defineConfig({
  testDir: './qa',
  testMatch: '*.spec.mjs',
  outputDir: './qa-reports/test-results',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: './qa-reports/playwright', open: 'never' }]],
  timeout: 60_000,
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled', caret: 'hide', scale: 'css', timeout: 20_000 }, // tall pages take longer than 5 s to capture under load
  },
  use: {
    baseURL,
    channel,
    // Reduced motion shows every section statically (the hero becomes its
    // poster frame), which keeps screenshots and layout checks deterministic.
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
  ],
  webServer: process.env.QA_BASE_URL ? undefined : {
    command: 'node ../artifacts/airzone-group/scripts/serve.mjs',
    env: { PORT: String(port) },
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
