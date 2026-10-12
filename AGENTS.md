# Tomatierra Ingeniería — Agent Instructions

Static marketing website for an energy-certification engineering firm in Galicia, Spain. Built with **Astro v5 + Tailwind CSS 4** — no JS framework integrations (no React/Vue/Svelte), pure `.astro` files plus small TypeScript modules in `src/scripts/`.

## Quién dirige

La **conversación principal** con Claude. Al abrir la carpeta lee
[`CLAUDE.md`](CLAUDE.md) y sigue su flujo: preguntar → construir → revisar →
arreglar. Pregunta, reparte el trabajo a los agentes y te cuenta qué pasa.

Los agentes no se hablan entre ellos: cada uno hace su parte y le devuelve el
resultado a la conversación principal.

```
Tú ──► Claude (dirige)
         │ 1. brief-grill → brief.md   (te pregunta a ti)
         │ 2. tailwind-html   (construye)
         │ 3. design-reviewer   (revisa, no toca código)
         └ 4. vuelve al 2 con lo que elijas arreglar
```

## `tailwind-html`

Maqueta **pantallas estáticas** en HTML + Tailwind 4 + Vite, sin frameworks.

1. Lee `brief.md` y comprueba que el proyecto es Tailwind v4.
2. Lleva a código la dirección visual del brief (`frontend-design`).
3. Monta los tokens en `@theme` (`tailwind-design-system`).
4. Escribe el HTML semántico, mobile-first, con buenos textos (`ux-copy`).
5. Extrae lo repetido a `@layer components` o `@utility` (`tailwind-clases-limpias`).
6. Termina con `npm run build` y el checklist de `tailwind-clases-limpias`.

## `design-reviewer`

Revisa lo construido **contra el brief**, sin tocar código.

- Usa `design-critique`, `accessibility-review`, `ux-copy` y
  `tailwind-clases-limpias`.
- Su pregunta clave: **¿podría ser la web de cualquier otro sitio?** Si sí,
  le falta personalidad.
- Devuelve como mucho 10 puntos: Crítico / Importante / Sugerencia, cada uno
  con qué, dónde y cómo arreglarlo.

## Por qué hay skills propias

- **`brief-grill`**: sin preguntar antes, la IA hace la web de siempre.
  Esta skill obliga a decidir el estilo visual y un detalle memorable
  **antes** de escribir código.
- **`tailwind-clases-limpias`**: las skills de terceros enseñan **cómo** se
  escribe Tailwind v4, pero ninguna pone **límites** (cuántas clases, cuándo
  extraer, en qué orden).
- **`astro-pods`**: la arquitectura de pods de Lemoncode no está en ninguna
  skill pública.

## Commands

```bash
npm run dev      # dev server → localhost:4321 (may fall back to :4322 if port taken)
npm run build    # static output → dist/
npm run preview  # preview the build locally
npm run check    # astro check (types in .astro and .ts)
npm test         # Playwright (desktop + mobile) — builds and starts `preview` on port 4323
npm run test:ui  # interactive Playwright UI
```

Validate structural changes with `npm run build` (no warnings) and `npm run check`. Run `npm test` after any component, script or SEO change.

## Architecture

```
src/
  components/   # one .astro per page section: Header, Hero (+ EnergyLabel), Services, Steps, Why,
                #   Cae, Faq, QuoteForm, StickyCta, Footer; plus Icon and IconSprite
  data/         # typed data: images.ts (base64 WebP photos, generated), icons.ts (sprite icon names)
  layouts/      # BaseLayout.astro — <head> SEO, JSON-LD, @fontsource imports, sprite, main script
  pages/        # index.astro (only page); new pages → src/pages/[name].astro
  scripts/      # client TypeScript: main.ts imports menu, sticky-cta, energy-label, reveal,
                #   quote-form, year (shared state in ui-state.ts)
  styles/       # global.css — Tailwind 4: @theme tokens, @layer components, @utility
public/         # static assets served at root (favicon.svg, robots.txt, og-image.png)
```

## Key Conventions

### Tailwind 4 and design tokens
- Tailwind 4 through `@tailwindcss/vite` in `astro.config.mjs`. Never add `tailwind.config.*`,
  `@tailwind` directives or `@astrojs/tailwind` (v3).
- Tokens live in `@theme` in [src/styles/global.css](src/styles/global.css) (`--color-forest`,
  `--color-copper`, `--color-mint`, `--font-display`, `--radius-photo`…). Use their utilities
  (`text-forest`, `bg-mint`, `rounded-card`) or `var(--color-…)` in SVG `style`; never hex values in
  markup.
- Shared pieces (`.btn-primary`, `.section-title`, `.service-card`, `.step`…) are in
  `@layer components` / `@utility` in `global.css`, **not** in scoped `<style>` blocks: some classes
  (`is-visible`, `is-done`, `link-light`) are added by JS and scoped styles would not reach them.
- Follow the `tailwind-clases-limpias` skill: ≤ ~12 utilities per element, class order, every
  `hover:` paired with `focus-visible:` and `active:`.
- Subgrid layouts (`.service-grid`/`.service-card`, `.steps`/`.step`, `.cae-flow`/`.cae-node`) need
  their items as **direct children**: render them with `.map()` inside the grid element, never through
  a component that adds a wrapper. Same for the hero text column (`max-lg:contents`).
- Navigation breakpoint is `lg` (1024 px): hamburger, sticky CTA and body `pb-20` below it.

### Fonts
Self-hosted with `@fontsource` (imported in the frontmatter of
[src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro), before `global.css`):
- **Fraunces Variable** — headings and brand (`font-display`)
- **Space Grotesk Variable** — body text (`font-sans`, default)
- **Space Mono** — eyebrows and labels (`font-mono`, `.eyebrow`)

Do not add Google Fonts `<link>`s.

### Images
Photos are **base64 WebP data URIs** in [src/data/images.ts](src/data/images.ts) (`src`, `alt`,
`width`, `height`), generated by an external sharp script (hero ~1000 px wide, the rest ~700 px).
Do not add image files to the repo. Always render `width`/`height` on `<img>`; only the hero is eager
(`fetchpriority="high"`), the rest use `loading="lazy"`. Photo credits live in the module comment.

### Icons
Use `<Icon name="…" />` ([src/components/Icon.astro](src/components/Icon.astro)): it always renders
`aria-hidden="true"` and `focusable="false"`. New icons are a `<symbol id="i-…">` in `IconSprite.astro`
plus their name in `src/data/icons.ts`.

### JavaScript
One `<script>` in `BaseLayout` imports `src/scripts/main.ts`. The only inline script is the one in
`<head>` that adds the `js` class (it must stay `is:inline` so `.reveal` content does not flicker).
Keep the DOM contracts used by the scripts: ids `#inicio`, `#menu`, `#servicio`, `#presupuesto`,
`#contenido`, `#<field>-error` and the `data-*` hooks (`data-menu-toggle`, `data-sticky-cta`,
`data-energy-pointer`, `data-play`, `data-service`, `data-quote-form`, `data-form-status`,
`data-copy-request`, `data-year`…).

### Comments
HTML comments are published in `dist/`. Put notes and `TODO`s in the frontmatter (`//`) or in
`{/* */}` inside the template.

### SEO / BaseLayout props
Pass per-page overrides to `<BaseLayout>` — defaults cover the homepage:
```astro
<BaseLayout title="..." description="..." ogTitle="..." ogDescription="..." image="/og-image.png" imageAlt="..." />
```
OG image must be a **PNG** at 1200×630 in `public/`. Do not use SVG for `og:image`. The JSON-LD
`@graph` has 3 nodes (tests check it). `theme-color` is `#1f4a33`.

### Accessibility
All decorative SVGs **must** have `aria-hidden="true"`. Content SVGs need an accessible label.
Visible focus everywhere (light outline inside the forest form section via `focus-scope-light`).
Animations respect `prefers-reduced-motion`.

### Heading hierarchy
`h1` (Hero) → `h2` (section heading) → `h3` (card/item title). Do not skip levels.

### Language
All user-facing copy is **Spanish (es-ES)**, targeting Galicia. Technical identifiers (class names, variables, files) stay in English.

## Adding a New Section

1. Create `src/components/MySectionName.astro` with a `<section>` using `.container-page`, an
   `.eyebrow` + `h2.section-title` heading (wrapped in `.reveal` if it should fade in) and an
   `aria-labelledby` pointing to the `h2`.
2. Keep repeated items as typed arrays in the frontmatter (or `src/data/*.ts`) and render them with `.map()`.
3. Import and place it in `src/pages/index.astro` inside `<main>`. Alternate `bg-mint` sections with white ones.
4. Add or update Playwright tests.
