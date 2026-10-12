import { defineConfig, devices } from '@playwright/test';

// Port 4323 is dedicated to tests — avoids conflicts with dev server on 4321/4322
const TEST_PORT = 4323;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: `http://localhost:${TEST_PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Hamburger menu and sticky CTA only exist below lg (1024 px)
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
  // Tests run against the production build (bundled scripts, compressHTML, no dev toolbar)
  webServer: {
    command: `npm run build && npm run preview -- --port ${TEST_PORT}`,
    url: `http://localhost:${TEST_PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
