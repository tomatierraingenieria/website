---
description: "Scaffold a new page section for the Tomatierra website. Creates the .astro component, wires it into index.astro, and places a divider."
argument-hint: "Section name and purpose, e.g. 'Testimonials — client quotes'"
agent: agent
---

Follow the conventions in [AGENTS.md](../../AGENTS.md) and the Astro instructions.

The user wants to add a new section. If no argument was provided, ask: **what is the section's name and purpose?**

## Steps

1. **Create the component** at `src/components/<SectionName>.astro`.
   - Use the standard layout: `.section-head` with `.eyebrow` + `h2`, then the section body.
   - Use CSS custom properties from `global.css` for all colors and values.
   - Write all styles in a scoped `<style>` block inside the component.
   - All user-facing copy must be in Spanish (es-ES).
   - Add `aria-hidden="true"` to any decorative SVGs.

2. **Wire it up** in `src/pages/index.astro`:
   - Import the new component at the top of the frontmatter.
   - Place it inside `<main>` in logical order relative to existing sections.
   - Add `<div class="divider"></div>` before or after as appropriate.

3. **Confirm** by listing what was created and where it was placed.

## Reference components
- [src/components/Services.astro](../../src/components/Services.astro) — card grid pattern
- [src/components/Future.astro](../../src/components/Future.astro) — tag list pattern
- [src/styles/global.css](../../src/styles/global.css) — all design tokens
