import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://tomatierraingenieria.com',
  compressHTML: true,
  integrations: [sitemap()],
  // Tailwind 4 como plugin de Vite (no @astrojs/tailwind, que es de la v3)
  vite: { plugins: [tailwindcss()] },
});
