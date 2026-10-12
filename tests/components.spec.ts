import { test, expect } from '@playwright/test';

test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('logo link shows the brand name and goes to #inicio', async ({ page }) => {
    const logo = page.locator('header a[href="#inicio"]');
    await expect(logo).toContainText('tomatierra');
    await expect(logo).toHaveAttribute('aria-label', /Tomatierra Ingeniería/);
  });

  test('quote CTA points to the form', async ({ page, isMobile }) => {
    const cta = page.locator('header a[href="#presupuesto"]');
    if (isMobile) {
      // Below lg the CTA lives inside the hamburger menu
      await expect(cta).toBeHidden();
      await page.locator('[data-menu-toggle]').click();
    }
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText('Pedir presupuesto');
  });
});

test.describe('Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has exactly one h1', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveCount(1);
  });

  test('h1 is visible with the literal headline', async ({ page }) => {
    const h1 = page.locator('main h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Cuando la energía toca tierra, todo fluye');
    await expect(h1.locator('em')).toHaveText('todo fluye');
  });

  test('hero eyebrow mentions Galicia', async ({ page }) => {
    await expect(page.locator('#inicio .eyebrow')).toHaveText('Certificación energética · Eficiencia · Galicia');
  });

  test('hero has the primary and secondary CTAs', async ({ page }) => {
    await expect(page.locator('#inicio a.btn-primary')).toHaveAttribute('href', '#presupuesto');
    await expect(page.locator('#inicio a.btn-ghost')).toHaveAttribute('href', '#servicios');
  });
});

test.describe('Services section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the literal section h2', async ({ page }) => {
    const heading = page.locator('#servicios h2');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(/Certificación energética,\s*con chispa/);
  });

  test('renders exactly 3 service cards', async ({ page }) => {
    await expect(page.locator('#servicios .service-card')).toHaveCount(3);
  });

  test('all three verticals are represented', async ({ page }) => {
    const titles = page.locator('#servicios .service-card h3');
    await expect(titles).toHaveText(['Viviendas', 'Industria y CAE', 'Movilidad eléctrica']);
  });

  test('each card has a photo and three bullets', async ({ page }) => {
    const cards = page.locator('#servicios .service-card');
    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i).locator('img')).toHaveCount(1);
      await expect(cards.nth(i).locator('.check-list > li')).toHaveCount(3);
    }
  });
});

test.describe('Other sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('how we work has 4 numbered steps', async ({ page }) => {
    await expect(page.locator('#como-trabajamos .step')).toHaveCount(4);
    await expect(page.locator('#como-trabajamos .step-num')).toHaveText(['01', '02', '03', '04']);
    await expect(page.locator('#como-trabajamos .step-title').first()).toHaveText('Nos escribes');
  });

  test('CAE diagram has 4 nodes and 3 connectors', async ({ page }) => {
    await expect(page.locator('.cae-flow > .cae-node')).toHaveCount(4);
    await expect(page.locator('.cae-flow .cae-link')).toHaveCount(3);
    await expect(page.getByText('Hazlo antes de empezar la obra: después ya no se puede.')).toBeVisible();
  });

  test('FAQ has 6 exclusive details', async ({ page }) => {
    const items = page.locator('#faq details[name="faq"]');
    await expect(items).toHaveCount(6);
    await items.nth(0).locator('summary').click();
    await expect(items.nth(0)).toHaveAttribute('open', '');
    await items.nth(1).locator('summary').click();
    await expect(items.nth(1)).toHaveAttribute('open', '');
    await expect(items.nth(0)).not.toHaveAttribute('open', /.*/);
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
    await expect(page.locator('footer [data-year]')).toHaveText(year);
  });

  test('footer mentions the brand name', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('Tomatierra Ingeniería — Galicia, España');
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('all decorative SVGs have aria-hidden="true"', async ({ page }) => {
    const scope = ':is(header, main, footer, [data-sticky-cta])';
    // Guard: make sure the selector actually finds SVGs, so the check below is not vacuous
    expect(await page.locator(`${scope} svg`).count()).toBeGreaterThan(20);
    const svgsWithoutHidden = page.locator(
      `${scope} svg:not([aria-hidden="true"]):not([aria-label]):not([role="img"])`,
    );
    await expect(svgsWithoutHidden).toHaveCount(0);
  });

  test('heading levels are not skipped (h1 → h2 → h3)', async ({ page }) => {
    const levels = await page
      .locator('main :is(h1, h2, h3, h4, h5, h6)')
      .evaluateAll((els) => els.map((el) => Number(el.tagName[1])));
    expect(levels[0]).toBe(1);
    expect(levels.filter((l) => l === 1)).toHaveLength(1);
    expect(levels.filter((l) => l === 2).length).toBeGreaterThanOrEqual(6);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1], `heading ${i} jumps a level`).toBeLessThanOrEqual(1);
    }
  });

  test('page has no auto-playing media', async ({ page }) => {
    await expect(page.locator('[autoplay]')).toHaveCount(0);
  });

  test('all links have discernible text', async ({ page }) => {
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(5);
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      expect(text?.trim() || ariaLabel, `Link ${i} has no accessible label`).toBeTruthy();
    }
  });

  test('images have alt text and size; only the hero is not lazy', async ({ page }) => {
    const images = await page.locator('main img').evaluateAll((imgs) =>
      imgs.map((img) => ({
        alt: img.getAttribute('alt') ?? '',
        width: img.getAttribute('width'),
        height: img.getAttribute('height'),
        loading: img.getAttribute('loading'),
        inHero: !!img.closest('#inicio'),
        src: img.getAttribute('src') ?? '',
      })),
    );
    expect(images).toHaveLength(5);
    for (const img of images) {
      expect(img.alt.trim().length, 'alt').toBeGreaterThan(10);
      expect(Number(img.width), 'width').toBeGreaterThan(0);
      expect(Number(img.height), 'height').toBeGreaterThan(0);
      expect(img.src.startsWith('data:image/webp;base64,'), 'inline WebP').toBe(true);
      expect(img.loading === 'lazy', 'lazy only outside the hero').toBe(!img.inHero);
    }
  });

  test('skip link is the first Tab stop and targets #contenido', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveText('Saltar al contenido');
    await expect(focused).toHaveAttribute('href', '#contenido');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#contenido$/);
  });
});

test.describe('Page layout', () => {
  test('page renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.locator('footer').scrollIntoViewIfNeeded();
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

  test('every in-page anchor points to an existing id', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('a[href^="#"]:not([href="#"])')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')!));
    expect(hrefs.length).toBeGreaterThan(5);
    for (const href of new Set(hrefs)) {
      await expect(page.locator(href), `missing target ${href}`).toHaveCount(1);
    }
  });

  test('publication guard: no placeholder href="#" links remain', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
  });

  test('no horizontal scroll at 360 px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
