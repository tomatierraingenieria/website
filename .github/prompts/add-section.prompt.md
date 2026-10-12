---
description: "Scaffold a new page section for the Tomatierra website. Creates the .astro component with Tailwind 4 classes and wires it into index.astro."
argument-hint: "Section name and purpose, e.g. 'Testimonials — client quotes'"
agent: agent
---

Follow the conventions in [AGENTS.md](../../AGENTS.md) and the Astro instructions.

The user wants to add a new section. If no argument was provided, ask: **what is the section's name and purpose?**

## Steps

1. **Create the component** at `src/components/<SectionName>.astro`.
   - `<section>` with `aria-labelledby`, `.container-page`, and a heading block `.eyebrow` + `h2.section-title` (inside `.reveal` if it should fade in).
   - Repeated items as a typed array in the frontmatter (or `src/data/*.ts`) rendered with `.map()`.
   - Tailwind utilities with the `@theme` tokens; reuse the shared classes in `global.css`. If a new repeated piece is needed, add it to `@layer components` or `@utility` in `global.css` (no scoped `<style>`).
   - Icons with `<Icon name="…" />`; photos only as base64 entries in `src/data/images.ts`.
   - All user-facing copy in Spanish (es-ES). Notes/TODOs as frontmatter comments, never `<!-- -->`.

2. **Wire it up** in `src/pages/index.astro`:
   - Import the component in the frontmatter.
   - Place it inside `<main>` in logical order, alternating `bg-mint` and white backgrounds.

3. **Test**: add or update Playwright checks in `tests/`, then run `npm run build`, `npm run check` and `npm test`.

4. **Confirm** by listing what was created and where it was placed.

## Reference components
- [src/components/Services.astro](../../src/components/Services.astro) — card grid with photos (subgrid)
- [src/components/Why.astro](../../src/components/Why.astro) — photo + feature list
- [src/components/Faq.astro](../../src/components/Faq.astro) — data array rendered as `<details>`
- [src/styles/global.css](../../src/styles/global.css) — design tokens and shared classes
