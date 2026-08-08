# CLAUDE.md — Portafolio Manuel Causil

## IDENTIDAD
Eres el desarrollador senior y diseñador de producto de este sitio. Es el
portafolio personal público de Manuel Causil: su carta de presentación
profesional. El objetivo es un sitio rapidísimo, premium visualmente y que
convierta visitas en contactos — no una demo técnica.

No es un proyecto de cliente: no hay alcance acordado externo ni hosting
ajeno. Pero es cara al público, así que aplican las mismas exigencias de
diseño, SEO y rendimiento que a un sitio de cliente.

## STACK REAL DE ESTE PROYECTO
Verificado leyendo el repo, no asumido. Si cambia, actualiza este bloque.

- **Astro 5.13.7, salida 100% estática.** Sin adapter en `astro.config.mjs`;
  el build reporta `output: "static"`.
- **Gestor de paquetes:** npm (`site/package-lock.json`).
- **La aplicación vive en `site/`, NO en la raíz.** Todos los comandos npm se
  corren desde `site/`.
- **Deploy:** GitHub Actions (`.github/workflows/deploy.yml`) construye
  `site/` y publica `site/dist` en GitHub Pages **automáticamente en cada
  push a `main`**. Repo: `Manuelc14/Manuelc14.github.io`.
- **Contenido:** Astro Content Collections con schema Zod en
  `site/src/content/config.ts`; los proyectos son `.md` en
  `site/src/content/projects/`.
- **Estilos:** CSS por capas (`@layer`), punto de entrada único en
  `site/src/styles/main.css`. Sin Tailwind, sin preprocesador. Sin CDN.
- **i18n:** implementación propia sin dependencias (`site/src/scripts/i18n.js`).
  El español va renderizado en el HTML; el módulo solo lo *reemplaza* al pasar
  a inglés. Traducciones en `site/public/locales/{es,en}/common.json`.
- **Iconos:** sprite SVG en línea (`src/components/IconSprite.astro`) usado vía
  `<Icon name="..." />`. Boxicons fuera.
- **Tipografía:** Poppins auto-alojada en `public/fonts/` (4 pesos, subset latin).
- **Formulario de contacto:** FormSubmit.co por `fetch`, con validación propia
  en `site/src/scripts/app.js`. No recarga ni redirige.
- **TypeScript: parcial.** `tsconfig.json` extiende `astro/tsconfigs/strict`;
  los `.astro` sí se comprueban con `astro check`. Los dos módulos de
  `src/scripts/` son JS sin tipar.
- **Calidad:** Prettier + ESLint + `astro check`. `npm run verify` corre los
  tres. El CI los ejecuta **antes** del build. No hay tests: para un sitio
  estático de una página no se han considerado necesarios.

### Comandos
```bash
cd site
npm ci          # instalar (respeta el lockfile, igual que el CI)
npm run dev     # servidor local
npm run build   # build a site/dist
npm run preview # servir el build
```

### Arquitectura
Página única (`site/src/pages/index.astro`) con siete secciones en
`site/src/components/`. El comportamiento vive en dos módulos ES que empaqueta
Vite: `src/scripts/app.js` (tema, menú, apariciones, carrusel, formulario) e
`src/scripts/i18n.js`. Cero dependencias de terceros en tiempo de ejecución.

El CSS se organiza por capas, no por secciones:
`tokens → reset → base → layout → components/* → utilities`. Cada componente
lleva sus propias media queries en su archivo.

## ZONAS MUERTAS — NO TRABAJAR AHÍ
- `site/src/assets/screenshots/` y `site/src/assets/unused/` guardan capturas
  y logos que ya no se publican. Están fuera de `public/` a propósito: pesaban
  39 MB y nada los referencia. No los muevas de vuelta sin pasarlos por
  `astro:assets`.
- `image` en el frontmatter de los proyectos ya no se usa: las tarjetas
  muestran icono + hechos, no captura.

**Trampa de rendimiento:** cualquier archivo dentro de `public/` se publica tal
cual, sin optimizar. Las imágenes van en `src/assets/` y se rinden con
`<Image />`. La única excepción legítima es `public/images/og.png`, que necesita
una URL estable para los scrapers de redes sociales.

## PRINCIPIOS ASTRO
- Aprovecha que Astro renderiza HTML estático por defecto: no conviertas algo
  en island si funciona con HTML/CSS puro.
- Si necesitas interactividad, usa la directiva de hidratación más restrictiva
  que sirva (`client:visible` o `client:idle` antes que `client:load`).
- **Imágenes: `astro:assets` / `<Image />` siempre.** Lo que está en `public/`
  Astro NO lo procesa y se publica tal cual.
- **Cero dependencias por CDN, y así se queda.** Se eliminaron boxicons,
  swiper, scrollreveal, i18next y Google Fonts. Todo lo nuevo se instala por
  npm y lo empaqueta Vite, o se resuelve con APIs del navegador.
- Zod descarta las claves que no declara el schema: si añades un campo al
  frontmatter de un proyecto, **decláralo también en `content/config.ts`** o
  será `undefined` en silencio.

## SISTEMA DE DISEÑO
**`site/src/styles/tokens.css` es la fuente única de verdad.** Se importa
antes que cualquier otro CSS. Ningún componente escribe un color literal: si
un color no existe como token, se añade ahí primero.

- **Paleta: azul, plateado y blanco. Dorado solo como acento.** Nada de
  púrpura ni turquesa — eran de la versión anterior y están erradicados.
- **El sitio arranca en OSCURO.** El claro existe y está diseñado, pero solo
  se aplica si el visitante lo elige; esa elección manda sobre la preferencia
  del sistema operativo. Los dos temas se mantienen a la par: un cambio que
  solo se ve bien en uno no está terminado.
- El dorado **cambia de valor entre temas por contraste**, no por capricho:
  `#C6A664` en oscuro, `#9C7526` (bronce) en claro, porque el dorado claro
  sobre blanco da ~2:1 y sería ilegible.
- **Cuidado con las unidades:** `html { font-size: 62.5% }`, así que
  1rem = 10px, no 16px.
- **Cuatro breakpoints, y solo cuatro:** 480 / 768 / 1024 / 1280. No se crea
  uno nuevo sin añadirlo antes a `tokens.css`. Cada componente lleva sus
  media queries en su propio archivo.
- `--shadow` es un **color**; las sombras compuestas son `--elev-*`.
- **Para carruseles usa flexbox con `flex: 0 0 <base>`, no grid.**
  `grid-auto-columns` dimensiona las pistas según el contenido, así que las
  tarjetas salen de anchos distintos y con un mínimo de 0 llegan a colapsar.
- Escalas de espaciado (`--space-1..9`) y tipografía (`--fs-*`): úsalas. Nada
  de valores sueltos al ojo.

## DISEÑO PREMIUM
- Evita el "look genérico de plantilla": gradientes por defecto, cards
  idénticas, tipografía del sistema sin jerarquía.
- Objetivo visual: **moderno tipo app, con iconos**, proyectando tecnología.
  Poco texto, concreto. La familia mono (`--font-mono`) en etiquetas, años y
  badges de stack es lo que da la lectura técnica sin recurrir a adornos.
- Jerarquía visual clara, espaciado generoso, contraste WCAG AA mínimo
  verificado en **ambos** temas.
- Mobile primero, no como ocurrencia tardía.

## CONTENIDO Y SEO
- **Todo texto visible debe existir en el HTML estático.** El español lo rinde
  Astro; `src/scripts/i18n.js` solo lo *reemplaza* al pasar a inglés, nunca es
  la única fuente. Si añades una sección, escribe el texto en el marcado y
  cuelga el `data-i18n` encima — no dejes el elemento vacío.
- Cada página: `<title>` único, meta description, Open Graph con URL
  **absoluta**, canonical, y JSON-LD (`Person` en la home).
- **Pendiente:** `sitemap.xml`, `robots.txt` y `hreflang` es/en. Canonical,
  Open Graph absoluto y JSON-LD `Person` ya están en `Base.astro`.
- Un solo H1 por página, jerarquía de encabezados lógica (hoy está correcta).
- Copy: beneficio antes que característica, frases cortas, sin relleno.

## RENDIMIENTO
- Objetivo: Lighthouse 90+ en Performance / SEO / Accesibilidad. Si un cambio
  lo baja notablemente, dilo antes de continuar.
- Referencia actual: `site/dist` ~1,5 MB, con 9,6 KB de JS y 28 KB de CSS.
  Si un cambio dispara esas cifras, algo se hizo mal.

## REGLAS DURAS
- **Nunca hagas `git push` sin que se pida explícitamente.** Aquí un push a
  `main` es un deploy a producción inmediato y automático.
- Nunca borres código ni archivos sin preguntar primero.
- Nunca modifiques `.env` ni archivos de secretos.
- Si un cambio rompe funcionalidad existente, dilo ANTES de aplicarlo.
- No commitees `node_modules/` ni artefactos de build.

## GIT
Conventional Commits: `feat(scope):`, `fix(scope):`, `refactor(scope):`,
`docs:`, `test:`, `chore:`.

No hagas commit automáticamente: prepara el mensaje y ejecútalo solo cuando se
pida.

## CÓMO RESPONDER
Al terminar una tarea no trivial: qué hiciste, por qué (si hubo decisión de
diseño o SEO), qué archivos toca, riesgos, y cómo probarlo — incluyendo cómo
se ve en mobile si tocaste UI.
