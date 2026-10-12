import { test, expect } from '@playwright/test';

test.describe('SEO meta tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page title contains main keywords', async ({ page }) => {
    await expect(page).toHaveTitle(/Certificados Energ/);
    await expect(page).toHaveTitle(/Galicia/);
  });

  test('meta description mentions the brand and services', async ({ page }) => {
    const content = await page.locator('meta[name="description"]').getAttribute('content');
    expect(content).toContain('Tomatierra');
    expect(content).toMatch(/certificados energ/i);
  });

  test('canonical URL is set', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://tomatierraingenieria.com/');
  });

  test('hreflang es and x-default are present', async ({ page }) => {
    await expect(page.locator('link[hreflang="es"]')).toBeAttached();
    await expect(page.locator('link[hreflang="x-default"]')).toBeAttached();
  });

  test('Open Graph image, title and description are set', async ({ page }) => {
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toMatch(/og-image\.png/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
  });

  test('og:image dimensions are declared', async ({ page }) => {
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
  });

  test('Twitter card is summary_large_image', async ({ page }) => {
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });

  test('robots allows indexing', async ({ page }) => {
    const content = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(content).toContain('index');
    expect(content).toContain('follow');
  });

  test('lang attribute is Spanish', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('JSON-LD structured data is valid and contains schema.org', async ({ page }) => {
    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).not.toBeNull();
    const data = JSON.parse(scriptContent!);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@graph']).toHaveLength(3);
  });

  test('description is a short, conversion-oriented summary', async ({ page }) => {
    const content = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
    expect(content.length).toBeLessThanOrEqual(160);
    expect(content).toContain('CAE');
    expect(content).toContain('Galicia');
    expect(content).toMatch(/Pide presupuesto/);
  });

  test('og:image:alt is declared', async ({ page }) => {
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /\S{3,}/);
  });

  test('theme-color is the forest green', async ({ page }) => {
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#1f4a33');
  });

  test('favicon is the SVG and no broken apple-touch-icon is linked', async ({ page }) => {
    const icon = page.locator('link[rel="icon"]');
    await expect(icon).toHaveAttribute('href', '/favicon.svg');
    expect((await page.request.get('/favicon.svg')).status()).toBe(200);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(0);
  });

  test('og-image.png is served', async ({ page }) => {
    const response = await page.request.get('/og-image.png');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  });

  test('no third-party font requests and no HTML comments in production', async ({ page }) => {
    const html = await (await page.request.get('/')).text();
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toContain('<!--');
  });

  test('JSON-LD services match the three verticals', async ({ page }) => {
    const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    const service = data['@graph'].find((n: { '@type': string }) => n['@type'] === 'ProfessionalService');
    const names = service.hasOfferCatalog.itemListElement.map(
      (offer: { itemOffered: { name: string } }) => offer.itemOffered.name,
    );
    expect(names).toEqual(['Viviendas: certificado energético', 'Industria y CAE', 'Movilidad eléctrica']);
  });

  test('JSON-LD contains Organization with contact email', async ({ page }) => {
    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(scriptContent!);
    const org = data['@graph'].find((n: { '@type': string }) => n['@type'] === 'Organization');
    expect(org).toBeDefined();
    expect(org.email).toBeDefined();
  });
});
