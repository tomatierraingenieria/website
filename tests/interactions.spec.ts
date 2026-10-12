import { test, expect, type Page } from '@playwright/test';

const stickyHidden = (page: Page) => page.locator('[data-sticky-cta]');

test.describe('Mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'The hamburger menu only exists below lg (1024 px)');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('toggle updates aria-expanded, aria-label and data-open', async ({ page }) => {
    const toggle = page.locator('[data-menu-toggle]');
    const menu = page.locator('#menu');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-label', 'Abrir menú');
    await expect(menu).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAttribute('aria-label', 'Cerrar menú');
    await expect(menu).toHaveAttribute('data-open', 'true');
    await expect(menu.getByRole('link', { name: 'Servicios' })).toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toHaveAttribute('data-open', 'false');
    await expect(menu).toBeHidden();
  });

  test('Escape closes the menu and returns focus to the toggle', async ({ page }) => {
    const toggle = page.locator('[data-menu-toggle]');
    await toggle.click();
    await page.locator('#menu a').first().focus();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#menu')).toHaveAttribute('data-open', 'false');
    await expect(toggle).toBeFocused();
  });

  test('clicking a menu link closes the menu', async ({ page }) => {
    await page.locator('[data-menu-toggle]').click();
    await page.locator('#menu').getByRole('link', { name: 'Preguntas frecuentes' }).click();
    await expect(page.locator('#menu')).toHaveAttribute('data-open', 'false');
    await expect(page).toHaveURL(/#faq$/);
  });
});

test.describe('Mobile sticky CTA', () => {
  test.skip(({ isMobile }) => !isMobile, 'The sticky bar only exists below lg (1024 px)');

  test('hidden and inert on the first screen', async ({ page }) => {
    await page.goto('/');
    const bar = stickyHidden(page);
    await expect(bar).toHaveAttribute('data-hidden', 'true');
    await expect(bar).toHaveJSProperty('inert', true);
  });

  test('appears after the hero CTA and hides again at the form', async ({ page }) => {
    await page.goto('/');
    const bar = stickyHidden(page);
    await page.locator('#como-trabajamos').scrollIntoViewIfNeeded();
    await expect(bar).toHaveAttribute('data-hidden', 'false');
    await expect(bar).toHaveJSProperty('inert', false);
    await expect(bar.getByRole('link', { name: 'Pedir presupuesto' })).toBeInViewport();

    await page.locator('#presupuesto').scrollIntoViewIfNeeded();
    await page.locator('[data-quote-form]').scrollIntoViewIfNeeded();
    await expect(bar).toHaveAttribute('data-hidden', 'true');
  });

  test('hides while the menu is open', async ({ page }) => {
    await page.goto('/');
    const bar = stickyHidden(page);
    await page.locator('#como-trabajamos').scrollIntoViewIfNeeded();
    await expect(bar).toHaveAttribute('data-hidden', 'false');
    await page.locator('[data-menu-toggle]').click();
    await expect(bar).toHaveAttribute('data-hidden', 'true');
    await page.keyboard.press('Escape');
    await expect(bar).toHaveAttribute('data-hidden', 'false');
  });
});

test.describe('Desktop layout', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop-only layout checks');

  test('no hamburger nor sticky bar from lg', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/');
    await expect(page.locator('[data-menu-toggle]')).toBeHidden();
    await expect(page.locator('[data-sticky-cta]')).toBeHidden();
    await expect(page.locator('#menu').getByRole('link', { name: 'Servicios' })).toBeVisible();
  });

  for (const width of [1024, 1440]) {
    test(`the 4 steps share rows (subgrid) at ${width} px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const tops = await page.locator('#como-trabajamos .step').evaluateAll((steps) =>
        steps.map((step) =>
          ['.step-icon', '.step-num', '.step-title', '.step-text'].map((sel) =>
            Math.round(step.querySelector(sel)!.getBoundingClientRect().top),
          ),
        ),
      );
      expect(tops).toHaveLength(4);
      for (let row = 0; row < 4; row++) {
        const values = tops.map((stepTops) => stepTops[row]);
        expect(Math.max(...values) - Math.min(...values), `row ${row} misaligned: ${values}`).toBeLessThanOrEqual(1);
      }
      // And the steps are laid out side by side, not stacked
      const lefts = await page
        .locator('#como-trabajamos .step')
        .evaluateAll((steps) => steps.map((s) => Math.round(s.getBoundingClientRect().left)));
      expect(new Set(lefts).size).toBe(4);
    });
  }
});

test.describe('Quote form', () => {
  const required = ['nombre', 'email', 'municipio', 'servicio', 'mensaje', 'rgpd'];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-quote-form]').scrollIntoViewIfNeeded();
  });

  test('empty submit flags every required field and focuses the first', async ({ page }) => {
    await page.locator('[data-quote-form] button[type="submit"]').click();
    for (const id of required) {
      await expect(page.locator(`#${id}`), id).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator(`#${id}-error`), id).not.toBeEmpty();
    }
    await expect(page.locator('#telefono')).not.toHaveAttribute('aria-invalid');
    await expect(page.locator('[data-form-status]')).toHaveText(/^Faltan 6 campos por completar/);
    await expect(page.locator('#nombre')).toBeFocused();
  });

  test('fixing a field clears its error', async ({ page }) => {
    await page.locator('[data-quote-form] button[type="submit"]').click();
    await expect(page.locator('#nombre-error')).not.toBeEmpty();
    await page.locator('#nombre').fill('Ana');
    await expect(page.locator('#nombre')).not.toHaveAttribute('aria-invalid');
    await expect(page.locator('#nombre-error')).toBeEmpty();
    await expect(page.locator('#nombre-error')).toBeHidden();
  });

  test('invalid email shows the specific message', async ({ page }) => {
    await page.locator('#email').fill('ana.correo.com');
    await page.locator('[data-quote-form] button[type="submit"]').click();
    await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#email-error')).toHaveText(/Revisa el email/);
  });

  test('valid data shows an honest status and the copy button', async ({ page }) => {
    await page.locator('#nombre').fill('Ana Pérez');
    await page.locator('#email').fill('ana@example.com');
    await page.locator('#municipio').fill('Lugo');
    await page.locator('#servicio').selectOption('viviendas');
    await page.locator('#mensaje').fill('Piso de 80 m² para vender.');
    await page.locator('#rgpd').check();
    await expect(page.locator('[data-copy-request]')).toBeHidden();
    await page.locator('[data-quote-form] button[type="submit"]').click();
    for (const id of required) {
      await expect(page.locator(`#${id}`), id).not.toHaveAttribute('aria-invalid');
    }
    await expect(page.locator('[data-form-status]')).toContainText('Hemos intentado abrir tu correo');
    await expect(page.locator('[data-form-status] a.link-light')).toHaveAttribute(
      'href',
      'mailto:hola@tomatierraingenieria.com',
    );
    await expect(page.locator('[data-copy-request]')).toBeVisible();
  });

  test('CAE CTA preselects the industry service', async ({ page }) => {
    await expect(page.locator('#servicio')).toHaveValue('');
    await page.locator('[data-service="industria-cae"]').click();
    await expect(page.locator('#servicio')).toHaveValue('industria-cae');
    await expect(page).toHaveURL(/#presupuesto$/);
  });
});

test.describe('Reduced motion', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
  });

  test('energy label shows A immediately', async ({ page }) => {
    await expect(page.locator('[data-energy-letter]')).toHaveText('A');
    const row = await page
      .locator('[data-energy-pointer]')
      .evaluate((el) => getComputedStyle(el).getPropertyValue('--row').trim());
    expect(row).toBe('0');
  });

  test('every reveal and play block is visible without scrolling', async ({ page }) => {
    const states = await page
      .locator('.reveal, [data-play]')
      .evaluateAll((els) => els.map((el) => el.classList.contains('is-visible')));
    expect(states.length).toBeGreaterThan(10);
    expect(states.every(Boolean)).toBe(true);
    const lastReveal = page.locator('.reveal').last();
    await expect(lastReveal).toHaveCSS('opacity', '1');
  });

  test('logo and steps do not animate', async ({ page }) => {
    const logoAnimations = await page
      .locator('header .logo-draw')
      .evaluate((svg) => svg.getAnimations({ subtree: true }).length);
    expect(logoAnimations).toBe(0);
    const stepAnimations = await page
      .locator('.steps')
      .evaluate((ol) => ol.getAnimations({ subtree: true }).length);
    expect(stepAnimations).toBe(0);
  });
});

test.describe('With motion', () => {
  test('logo draws on load and the label runs down to A', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    // Check the declared animation, not the running one: under load it may already be finished
    const animatedParts = await page
      .locator('header .logo-draw')
      .evaluate((svg) =>
        [svg, ...svg.querySelectorAll('*')].filter((el) => getComputedStyle(el).animationName !== 'none').length,
      );
    expect(animatedParts).toBeGreaterThan(0);
    // The pointer ends on A after the G→A run
    await expect(page.locator('[data-energy-letter]')).toHaveText('A', { timeout: 6000 });
    await expect(page.locator('[data-energy-pointer]')).toHaveClass(/is-done/, { timeout: 6000 });
  });
});

test.describe('Without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('reveal content is visible (hiding depends on html.js)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/\bjs\b/);
    await expect(page.locator('#servicios .service-card').first()).toHaveCSS('opacity', '1');
    await expect(page.locator('.steps .step-icon').first()).toHaveCSS('opacity', '1');
    await expect(page.locator('footer [data-year]')).toHaveText(String(new Date().getFullYear()));
  });
});
