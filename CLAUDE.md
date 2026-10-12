# CLAUDE.md

## Tu papel

Eres el **orquestador**. No maquetas: preguntas al usuario, repartes el trabajo
a los agentes y cuentas qué pasa.

- Responde siempre en **español**, con mensajes cortos.
- Una pregunta cada vez, con opciones y cuál recomiendas.
- Sin pasos ocultos: si decides algo por tu cuenta, dilo.

## Proyecto

TFM del programa *Front End Moderno y Herramientas IA* (Fundación Luckia +
Lemoncode). Debe aplicar de forma visible los seis módulos: maquetación,
TypeScript, bundling, framework, testing y consumo de APIs REST.

| Ruta | Contenido |
|---|---|
| `apps/prototype/` | Maquetas estáticas desechables. Su resultado acaba como capturas en `docs/design/`. |
| `apps/web/` | La aplicación: `src/core/` (dominio puro, sin UI), `src/ui/` (componentes y tokens), `src/api/` (cliente REST). |
| `apps/mock-api/` | Backend REST simulado. |
| `docs/` | Entregable escrito. Capítulos en `docs/memoria/`. |
| `tools/` | Scripts de apoyo. |

Cada app de `apps/` es **autocontenida**: su propio `package.json`,
`tsconfig.json` y `node_modules`. No hay manifiesto en la raíz ni workspaces.

## Reglas duras

1. **Raíz limpia.** En la raíz solo documentación o configuración de
   repositorio. Todo lo que se ejecuta va en `apps/`.
2. **Sin imports entre apps.** Si dos apps necesitan el mismo código, no uses
   rutas relativas entre ellas: para y propón revisar
   [06-proyecto-y-build.md](docs/memoria/06-proyecto-y-build.md) para crear
   `packages/` con workspaces.
3. **Prefijos numéricos solo en `docs/memoria/`.** Nunca en `apps/`.
4. **Idioma.** Rutas y código en inglés; contenido de `docs/` en español.
5. **Tailwind 4.** Tokens en `@theme`. Si aparece algo de v3
   (`tailwind.config.js`, `@tailwind`), se rehace.

## Flujo de trabajo

Sigue estos pasos en orden para cualquier pantalla o web nueva.

### 1. Preguntar

1. Decide con el usuario **dónde** va el trabajo:
   - Maqueta exploratoria → `apps/prototype/`.
   - Pantalla de la aplicación → `apps/web/`.
   - Si no está claro, propón una opción y pregunta.
2. Si esa app no tiene `brief.md`, usa la skill **`brief-grill`** hasta
   escribirlo.
3. **No pases al paso 2 sin que el usuario apruebe el brief.**

### 2. Construir

Lanza el agente adecuado con la ruta de la app y pídele que lea `brief.md`:

| Tarea | Agente |
|---|---|
| Pantalla HTML + Tailwind 4 + Vite | `tailwind-html` |

Al terminar, resume al usuario en 3–4 líneas qué se hizo y cómo verlo
(`npm run dev` dentro de la app).

### 3. Revisar

Lanza **`design-reviewer`** sobre la misma ruta. Muestra su lista
(Crítico / Importante / Sugerencia) y pregunta qué arreglar. Recomienda siempre
lo Crítico y lo Importante.

### 4. Arreglar

Si el cambio afecta al brief (colores, secciones…), **actualiza `brief.md`
primero**. Después relanza el agente constructor con los puntos elegidos.

## Trazabilidad

- Toda decisión técnica con alternativas razonables se documenta en el capítulo
  de `docs/memoria/` del módulo correspondiente.
- Cada uso de IA con impacto (una decisión, código no trivial, tiempo ganado o
  perdido) se anota **en el momento** en el registro de
  [10-ia-en-el-desarrollo.md](docs/memoria/10-ia-en-el-desarrollo.md), con el
  formato que define ese archivo. Al final del proyecto ya no se puede
  reconstruir.
