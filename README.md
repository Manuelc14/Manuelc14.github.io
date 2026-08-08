# Portafolio — Manuel Causil

Sitio personal y hoja de vida en línea. Una sola página, estática, sin
dependencias de terceros en tiempo de ejecución.

**En producción:** https://manuelc14.github.io

## Stack

| Qué        | Con qué                                                         |
| ---------- | --------------------------------------------------------------- |
| Framework  | Astro 5 (salida estática, sin adapter)                          |
| Estilos    | CSS propio por capas (`@layer`), sin framework                  |
| Contenido  | Astro Content Collections + Zod                                 |
| Idiomas    | Español renderizado en el HTML; inglés por reemplazo en cliente |
| Iconos     | Sprite SVG en línea                                             |
| Tipografía | Poppins auto-alojada (subset latin, 4 pesos)                    |
| Formulario | FormSubmit.co por `fetch`                                       |
| Despliegue | GitHub Actions → GitHub Pages                                   |

Cero peticiones a CDN: no hay Boxicons, Swiper, ScrollReveal, i18next ni
Google Fonts. El JavaScript enviado son ~10 KB.

## Desarrollo

El proyecto vive en `site/`, no en la raíz.

```bash
cd site
npm ci
npm run dev       # http://localhost:4321
```

| Comando           | Qué hace                                    |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo                      |
| `npm run build`   | Compila a `site/dist`                       |
| `npm run preview` | Sirve el build                              |
| `npm run verify`  | Formato + lint + tipos (lo mismo que el CI) |

## Estructura

```
site/
├─ public/
│  ├─ fonts/          Poppins auto-alojada
│  ├─ locales/        Traducciones es / en
│  ├─ images/og.png   Imagen para redes (necesita URL estable)
│  └─ robots.txt
└─ src/
   ├─ assets/img/     Imágenes que procesa astro:assets
   ├─ components/     Una sección por componente
   ├─ content/
   │  ├─ config.ts    Schema Zod de los proyectos
   │  └─ projects/    Un .md por proyecto
   ├─ layouts/Base.astro
   ├─ pages/index.astro
   ├─ scripts/        app.js (comportamiento) · i18n.js (idiomas)
   └─ styles/
      ├─ tokens.css   Paleta y escalas: fuente única de verdad
      ├─ main.css     Punto de entrada, define el orden de capas
      └─ components/  Un archivo por componente, con sus media queries
```

## Añadir un proyecto

Crea un `.md` en `site/src/content/projects/`:

```yaml
---
title: "Nombre del proyecto"
year: 2026
stack: ["Astro", "SEO"]
url: "https://ejemplo.com" # opcional
sector: "Sector · Enfoque" # opcional
status: "Activo" # opcional
order: 3 # opcional: posición fija en la rejilla
description: "Qué resuelve, en una frase."
highlights: # opcional
  - "Capacidad principal"
---
```

Sobre el orden: los proyectos con `order` van primero, del menor al mayor —
es el escaparate—. Los que no lo tienen van detrás, por año descendente.

Después:

1. Asigna un icono al slug en `src/components/Projects.astro` (mapa `meta`).
   Sin icono usa uno genérico.
2. Añade `projects.<slug>.title` y `.description` en los dos archivos de
   `public/locales/`.

Los campos que no declares simplemente no se renderizan. Si añades uno nuevo,
decláralo también en `content/config.ts`: Zod descarta en silencio lo que no
esté en el schema.

## Convenciones

- Ningún componente escribe un color literal: todo sale de `tokens.css`.
- `html { font-size: 62.5% }`, así que **1rem = 10px**, no 16px.
- Cuatro breakpoints: 480 / 768 / 1024 / 1280.
- Las imágenes van en `src/assets/` y se rinden con `<Image />`. Lo que se
  deja en `public/` se publica sin optimizar.
- Todo texto visible debe existir en el HTML; `i18n.js` solo lo reemplaza.
- Conventional Commits.

## Despliegue

Cada push a `main` dispara el workflow: formato, lint, tipos, build y
publicación en GitHub Pages. Si cualquiera de los tres primeros falla, no se
despliega.

## Licencia

Proyecto personal. El código está a la vista; puedes revisarlo y tomar ideas
para tu propio portafolio.
