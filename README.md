# Tomatierra Ingeniería

Sitio web de Tomatierra Ingeniería — certificación energética de viviendas, industria y transporte. Desarrollado con [Astro](https://astro.build).

## Estructura del proyecto

```
tomatierra-astro/
├── public/          # assets estáticos (favicon, og-image.png, robots.txt)
├── src/
│   ├── components/  # una sección = un archivo .astro
│   ├── layouts/     # BaseLayout.astro — SEO, JSON-LD, fuentes
│   ├── pages/       # index.astro (única página)
│   └── styles/      # global.css — tokens CSS y utilidades
├── tests/           # tests Playwright (seo.spec.ts, components.spec.ts)
├── .github/
│   ├── instructions/ # convenciones para agentes IA
│   └── prompts/      # comandos slash reutilizables
├── playwright.config.ts
├── astro.config.mjs
└── package.json
```

## Comandos

Ejecutar en la raíz del proyecto:

| Comando                  | Acción                                                   |
| :----------------------- | :------------------------------------------------------- |
| `npm install`            | Instala las dependencias                                 |
| `npm run dev`            | Servidor de desarrollo en `localhost:4321`               |
| `npm run build`          | Genera el sitio estático en `./dist/`                    |
| `npm run preview`        | Previsualiza la build localmente                         |
| `npm test`               | Ejecuta los tests Playwright (inicia el servidor solo)   |
| `npm run test:ui`        | Modo visual interactivo de Playwright                    |
| `npm run test:debug`     | Tests en modo depuración paso a paso                     |

## Tests

Los tests usan [Playwright](https://playwright.dev) y arrancan el servidor de desarrollo automáticamente en el puerto `4323` (dedicado para tests, no interfiere con el dev en `4321`).

```bash
npm test              # todos los tests
npm run test:ui       # interfaz visual — filtrar, reintentar, grabar
npx playwright show-report  # ver el último informe HTML
```

Hay dos suites:
- `tests/seo.spec.ts` — título, meta tags, OG, JSON-LD, hreflang, robots
- `tests/components.spec.ts` — header, hero, servicios, footer, accesibilidad, enlaces

## Despliegue en Cloudflare Pages

La carpeta `dist/` generada por `npm run build` está optimizada para Cloudflare Pages.

### Configuración del sitio
- **Dominio:** https://tomatierraingenieria.com
- **Redirecciones:** HTTP → HTTPS, www → dominio canónico
- **Build:** `npm run build` → `dist/`
- **Versión Node.js:** 20+

### Pasos de despliegue

1. **Conectar a Cloudflare Pages**
   - Dashboard → Pages → Create application → Connect to Git
   - Seleccionar tu repositorio `tomatierra-astro`
   - Build command: `npm run build`
   - Build output: `dist`
   - Deploy

2. **Configurar DNS**
   - Apuntar nameservers del registrador a Cloudflare
   - O usar CNAME si Cloudflare no maneja el DNS

3. **Seguridad en Cloudflare**
   - SSL/TLS → Full (strict)
   - Security → High level
   - Caching → Cache Everything

### Optimizaciones incluidas
- ✅ Headers de seguridad (HSTS, CSP, X-Frame-Options)
- ✅ Caché inteligente (1 año assets, 1 hora HTML)
- ✅ Compresión Brotli
- ✅ Sitemap + JSON-LD
- ✅ Redirecciones automáticas

### Testing antes de desplegar
```bash
npm test      # Verificar todos los tests pasan
npm run build # Generar build de producción
npm run preview # Previsualizar localmente
```

## Contacto

hola@tomatierraingenieria.com · Galicia, España
