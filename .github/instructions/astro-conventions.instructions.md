---
description: "Use when creating or editing .astro components in this project. Enforces Astro-specific conventions: CSS tokens, scoped styles, font loading, aria attributes, and heading hierarchy."
applyTo: "**/*.astro"
---

## CSS & Styling
- Use CSS custom properties from [src/styles/global.css](../../src/styles/global.css), never hardcode colors or spacing: `var(--soil)`, `var(--copper-bright)`, `var(--moss)`, `var(--radius)`, etc.
- Write component CSS inside a `<style>` block in the same file (scoped by default in Astro). Only add to `global.css` for shared utilities or new design tokens.
- Do not add `class` or `id` selectors to `global.css` that belong to a single component.

## Fonts
- Do not add a new `<link rel="stylesheet">` for Google Fonts. Fonts are already loaded in [src/layouts/BaseLayout.astro](../../src/layouts/BaseLayout.astro) via the non-blocking `onload` pattern.
- Available families: `'Fraunces'` (headings/brand), `'Space Grotesk'` (body), `'Space Mono'` (eyebrow labels via `.eyebrow` utility class).

## Accessibility
- Every decorative SVG must have `aria-hidden="true"`.
- Content SVGs (conveying meaning) need a visible label or `aria-label`.

## Heading hierarchy
- `h1` appears only in `Hero.astro`. Section headers are `h2`. Card/item titles are `h3`. Never skip levels.

## New section pattern
```astro
---
---
<section>
  <div class="section-head">
    <div>
      <span class="eyebrow">Label</span>
      <h2>Section title</h2>
    </div>
    <p>Supporting paragraph.</p>
  </div>
  <!-- section content -->
</section>

<style>
  /* component-scoped styles here, use var(--token) */
</style>
```

## Language
- All user-facing copy must be Spanish (es-ES) targeting Galicia. Class names, variables, and props stay in English.

## SEO (layouts only)
- `BaseLayout` accepts `title`, `description`, and `image` props. The `image` must be a PNG at 1200×630 in `public/`. Never use SVG for `og:image`.
