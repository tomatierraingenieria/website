import { test, expect } from '@playwright/test';

test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders brand name', async ({ page }) => {
    await expect(page.locator('header .brand-name')).toContainText('tomatierra');
  });

  test('contact CTA points to a mailto link', async ({ page }) => {
    const mailto = page.locator('header a[href^="mailto:"]');
    await expect(mailto).toBeVisible();
    await expect(mailto).toHaveAttribute('href', /^mailto:/);
  });
});

test.describe('Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has exactly one h1', async ({ page }) => {
    // .wrap excludes Astro dev-toolbar h1s (not present in production)
    await expect(page.locator('.wrap h1')).toHaveCount(1);
  });

  test('h1 is visible on page load', async ({ page }) => {
    await expect(page.locator('.wrap h1')).toBeVisible();
  });

  test('hero eyebrow mentions Galicia', async ({ page }) => {
    const eyebrow = page.locator('.hero .eyebrow');
    await expect(eyebrow).toContainText('Galicia');
  });
});

test.describe('Services section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders section h2 heading', async ({ page }) => {
    const heading = page.locator('h2').first();
    await expect(heading).toBeVisible();
  });

  test('renders exactly 3 service cards', async ({ page }) => {
    await expect(page.locator('.card')).toHaveCount(3);
  });

  test('all three verticals are represented', async ({ page }) => {
    const cards = page.locator('.card');
    await expect(cards.nth(0)).toContainText('Viviendas');
    await expect(cards.nth(1)).toContainText('Industria');
    await expect(cards.nth(2)).toContainText('Transporte');
  });

  test('each card has an h3 title', async ({ page }) => {
    await expect(page.locator('.card h3')).toHaveCount(3);
  });
});

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('footer is present', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });

  test('footer shows current year', async ({ page }) => {
    const year = new Date().getFullYear().toString();
    await expect(page.locator('footer')).toContainText(year);
  });

  test('footer mentions the brand name', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('Tomatierra');
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('all decorative SVGs have aria-hidden="true"', async ({ page }) => {
    // Scoped to .wrap to exclude Astro dev-toolbar SVGs (not present in production)
    const svgsWithoutHidden = page.locator('.wrap svg:not([aria-hidden="true"]):not([aria-label]):not([role="img"])');
    await expect(svgsWithoutHidden).toHaveCount(0);
  });

  test('heading levels are not skipped (h1 → h2 → h3)', async ({ page }) => {
    const h1Count = await page.locator('.wrap h1').count();
    const h2Count = await page.locator('.wrap h2').count();
    const h3Count = await page.locator('.wrap h3').count();
    expect(h1Count).toBe(1);
    expect(h2Count).toBeGreaterThanOrEqual(1);
    // h3 only appears if h2 exists first
    if (h3Count > 0) expect(h2Count).toBeGreaterThan(0);
  });

  test('page has no auto-playing media', async ({ page }) => {
    const autoplay = page.locator('[autoplay]');
    await expect(autoplay).toHaveCount(0);
  });

  test('all links have discernible text', async ({ page }) => {
    const links = page.locator('a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      expect(text?.trim() || ariaLabel, `Link ${i} has no accessible label`).toBeTruthy();
    }
  });
});

test.describe('Page layout', () => {
  test('page renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('/');
    expect(errors).toHaveLength(0);
  });

  test('page has no broken internal links', async ({ page }) => {
    await page.goto('/');
    const internalLinks = page.locator('a[href^="/"], a[href^="./"], a[href^="../"]');
    const count = await internalLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await internalLinks.nth(i).getAttribute('href');
      const response = await page.request.get(href!);
      expect(response.status(), `Broken link: ${href}`).toBeLessThan(400);
    }
  });
});
