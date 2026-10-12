---
description: "Use when creating or editing .astro components in this project. Enforces Astro + Tailwind 4 conventions: @theme tokens, shared component classes, @fontsource fonts, base64 images, Icon component, aria attributes and heading hierarchy."
applyTo: "**/*.astro"
---

## Styling (Tailwind 4)
- Tailwind 4 via `@tailwindcss/vite`. Never add `tailwind.config.*`, `@tailwind` directives or `@astrojs/tailwind`.
- Use the tokens from `@theme` in [src/styles/global.css](../../src/styles/global.css) through their utilities (`text-forest`, `bg-mint`, `text-copper-deep`, `rounded-card`, `shadow-card`, `font-display`…). Inside SVG `style` use `var(--color-…)`. Never hex colors in markup.
- Repeated pieces go in `global.css` (`@layer components` or `@utility`), not in scoped `<style>` blocks: classes added by JS (`is-visible`, `is-done`, `link-light`) would not be reached by Astro's scoping. Reuse what exists: `.container-page`, `.eyebrow`, `.section-title`, `.section-lead`, `.block-title`, `.btn-primary`, `.btn-ghost`, `.btn-outline-light`, `.icon-badge`, `.check-list`, `.feature`, `.reveal`.
- Keep elements under ~12 utilities and follow the class order of the `tailwind-clases-limpias` skill. Every `hover:` needs `focus-visible:` and `active:` counterparts.
- Subgrids (`.service-grid`, `.steps`, `.cae-flow`) and the hero's `max-lg:contents` column need direct children: render items with `.map()` inside the grid element, no wrapper components.
- Navigation and sticky CTA switch at `lg` (1024 px).

## Fonts
- Self-hosted with `@fontsource`, imported once in [src/layouts/BaseLayout.astro](../../src/layouts/BaseLayout.astro). Do not add Google Fonts `<link>`s.
- Families: `font-display` (Fraunces Variable), `font-sans` (Space Grotesk Variable, default), `font-mono` (Space Mono).

## Images
- Photos are base64 WebP data URIs in [src/data/images.ts](../../src/data/images.ts) (`src`, `alt`, `width`, `height`). Do not add image files. Always set `width`/`height`; `loading="lazy"` except the hero.

## Icons and accessibility
- Use `<Icon name="…" />` (always `aria-hidden="true"`); add new icons to `IconSprite.astro` and `src/data/icons.ts`.
- Every other decorative SVG must have `aria-hidden="true"`. Content SVGs need a visible label or `aria-label`.

## Comments
- HTML comments end up in `dist/`. Use `// …` in the frontmatter or `{/* … */}` in the template for notes and TODOs.

## Heading hierarchy
- `h1` appears only in `Hero.astro`. Section headers are `h2`. Card/item titles are `h3`. Never skip levels.

## New section pattern
```astro
---
const items = [{ title: '…', text: '…' }];
---
<section id="my-section" class="py-20 lg:py-28" aria-labelledby="my-section-title">
  <div class="container-page">
    <div class="reveal max-w-2xl">
      <p class="eyebrow">Etiqueta</p>
      <h2 id="my-section-title" class="section-title mt-3">Título de la sección</h2>
      <p class="section-lead">Texto de apoyo.</p>
    </div>
    <ul class="mt-10 grid gap-8 sm:grid-cols-2">
      {items.map((item) => (
        <li class="feature reveal">
          <div>
            <h3 class="feature-title">{item.title}</h3>
            <p class="feature-text">{item.text}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
</section>
```

## Language
- All user-facing copy must be Spanish (es-ES) targeting Galicia. Class names, variables, files and props stay in English.

## SEO (layouts only)
- `BaseLayout` accepts `title`, `description`, `ogTitle`, `ogDescription`, `image` and `imageAlt`. `image` must be a PNG at 1200×630 in `public/`. Never use SVG for `og:image`.
