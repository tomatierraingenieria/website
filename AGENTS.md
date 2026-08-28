# Tomatierra Ingeniería — Agent Instructions

Static marketing website for an energy-certification engineering firm in Galicia, Spain. Built with **Astro v5** — no JS framework integrations (no React/Vue/Svelte), pure `.astro` files.

## Commands

```bash
npm run dev      # dev server → localhost:4321 (may fall back to :4322 if port taken)
npm run build    # static output → dist/
npm run preview  # preview the build locally
npm test         # Playwright tests — starts dev server on port 4323 automatically
npm run test:ui  # interactive Playwright UI
```

Validate structural changes with `npm run build`. Run `npm test` after any component or SEO change.

## Architecture

```
src/
  components/   # one .astro file per page section
  layouts/      # BaseLayout.astro — all <head> SEO, JSON-LD, fonts
  pages/        # index.astro (only page); new pages → src/pages/[name].astro
  styles/       # global.css — CSS custom properties and shared utilities
public/         # static assets served at root (favicon, robots.txt, og-image.png)
boceto.html     # design draft at root — reference only, not part of the build
```

## Key Conventions

### Design tokens
Always use CSS custom properties — never hardcode colors or spacing values:
```css
/* use */    color: var(--soil);   background: var(--copper-bright);
/* avoid */  color: #2D5F3F;
```
All tokens are defined in [src/styles/global.css](src/styles/global.css).

### Fonts
Three families loaded in [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) via non-render-blocking `onload` pattern:
- **Fraunces** — headings and brand name
- **Space Grotesk** — body text (default `font-family` on `body`)
- **Space Mono** — eyebrow labels (`.eyebrow` utility class)

Do not add `rel="stylesheet"` directly — use the existing `onload` pattern to keep fonts non-blocking.

### SEO / BaseLayout props
Pass per-page overrides to `<BaseLayout>` — defaults cover the homepage:
```astro
<BaseLayout title="..." description="..." image="/og-image.png" />
```
OG image must be a **PNG** at 1200×630 in `public/`. Do not use SVG for `og:image`.

### Accessibility
All decorative SVGs **must** have `aria-hidden="true"`. Content SVGs need an accessible label.

### Heading hierarchy
`h1` (Hero) → `h2` (section heading) → `h3` (card/item title). Do not skip levels.

### Language
All user-facing copy is **Spanish (es-ES)**, targeting Galicia. Technical identifiers (class names, variables) stay in English.

### Scoped styles
Write component styles inside `<style>` blocks within each `.astro` file. Only add to `global.css` for truly shared utilities or tokens.

## Adding a New Section

1. Create `src/components/MySectionName.astro`
2. Import and place it in `src/pages/index.astro` inside `<main>`
3. Add a `<div class="divider"></div>` between sections if needed
4. Use an `<eyebrow>` + `<h2>` heading pattern consistent with Services and Future sections
