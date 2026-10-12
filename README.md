# Tomatierra Ingeniería

Landing de Tomatierra Ingeniería: certificación energética, auditorías y CAE, y movilidad eléctrica en Galicia.
Hecha con [Astro 5](https://astro.build) y [Tailwind CSS 4](https://tailwindcss.com), sin frameworks de JS.

## Estructura del proyecto

```
website/
├── public/              # estáticos servidos tal cual (favicon.svg, og-image.png, robots.txt)
├── src/
│   ├── components/      # una sección = un .astro (Header, Hero, Services, Steps, Why, Cae, Faq,
│   │                    #   QuoteForm, StickyCta, Footer) + EnergyLabel, Icon e IconSprite
│   ├── data/            # datos tipados: images.ts (fotos en base64) e icons.ts (nombres del sprite)
│   ├── layouts/         # BaseLayout.astro: <head> SEO, JSON-LD, fuentes, sprite y script
│   ├── pages/           # index.astro (única página)
│   ├── scripts/         # TypeScript del cliente: menú, barra fija, etiqueta A–G, reveal, formulario
│   └── styles/          # global.css: Tailwind 4, tokens en @theme y componentes
├── tests/               # Playwright: seo, components, interactions
├── astro.config.mjs
├── playwright.config.ts
└── wrangler.toml        # Cloudflare Workers Static Assets → ./dist
```

## Comandos

| Comando              | Acción                                                          |
| :------------------- | :-------------------------------------------------------------- |
| `npm install`        | Instala las dependencias (Node 20 o superior)                   |
| `npm run dev`        | Servidor de desarrollo en `localhost:4321`                      |
| `npm run build`      | Genera el sitio estático en `./dist/`                           |
| `npm run preview`    | Sirve la build localmente                                       |
| `npm run check`      | Comprueba tipos de `.astro` y `.ts` (`astro check`)             |
| `npm test`           | Tests Playwright (hace build y arranca `preview` en el `4323`)  |
| `npm run test:ui`    | Modo visual interactivo de Playwright                           |
| `npm run test:debug` | Tests paso a paso                                               |

## Estilos, fuentes e imágenes

- **Tailwind 4** con el plugin `@tailwindcss/vite` (en `astro.config.mjs`). Sin `tailwind.config.*`
  ni `@astrojs/tailwind`. Los tokens (colores, fuentes, radios, sombras) están en `@theme` dentro de
  `src/styles/global.css`; las piezas repetidas, en `@layer components` y `@utility`.
- **Fuentes self-hosted** con `@fontsource` (Fraunces, Space Grotesk y Space Mono), importadas en
  `BaseLayout.astro`. No hay peticiones a Google Fonts.
- **Fotos embebidas en base64** (WebP) en `src/data/images.ts`, con `alt`, `width` y `height`: no
  hay ficheros de imagen de fotos en el repo ni dependencias de Unsplash en tiempo de ejecución. El
  fichero se genera con un script externo (sharp); los créditos están en su comentario de cabecera.
- `og:image` es `public/og-image.png` (1200×630).

## Tests

Los tests usan [Playwright](https://playwright.dev) contra la **build de producción**
(`npm run build && npm run preview` en el puerto `4323`) con dos proyectos: Chrome de escritorio y
móvil (Pixel 7).

- `tests/seo.spec.ts`: título, description, canonical, hreflang, OG/Twitter, JSON-LD, favicon, sin
  Google Fonts ni comentarios HTML publicados.
- `tests/components.spec.ts`: estructura de secciones, accesibilidad (SVG, encabezados, enlaces,
  imágenes, skip link), anclas, scroll horizontal a 360 px y enlaces `href="#"` pendientes.
- `tests/interactions.spec.ts`: menú móvil, barra fija, formulario, preselección CAE, subgrid de los
  pasos a ≥ 1024 px, movimiento reducido y sin JS.

```bash
npm test
npx playwright show-report
```

## Despliegue (Cloudflare Workers Static Assets)

`wrangler.toml` publica `./dist` como **Worker de solo assets estáticos** (no Cloudflare Pages ni
adaptador de Astro). Rutas: `tomatierraingenieria.com/*` y `www.tomatierraingenieria.com/*`.

```bash
npm run build
npx wrangler deploy --env production   # o Workers Builds conectado al repositorio
```

- No hay `public/_redirects`: no añadas un fallback SPA (`/* /index.html 200`).
- Cabeceras de seguridad o caché, si se quieren, irían en `public/_headers` (tarea aparte). Una CSP
  debe permitir el script inline que añade la clase `js`, el JSON-LD inline y `img-src data:`
  (las fotos son data URIs).
- La redirección `www` → dominio raíz, si se quiere, con una Redirect Rule de Cloudflare.

## Pendiente antes de publicar

- Envío real del formulario (hoy valida en cliente y abre un `mailto:`; Formspree preparado en
  comentario en `QuoteForm.astro`).
- Confirmar con el cliente los `TODO` de los componentes (registro en la Xunta, presupuesto cerrado,
  plazos, tasas y textos legales de CAE/FAQ).

## Contacto

hola@tomatierraingenieria.com · Galicia, España
