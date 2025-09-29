# 🌐 Portafolio — Manuel Causil

Sitio personal para presentar perfil, habilidades y proyectos. Enfocado en **performance**, **accesibilidad** y **UX**, con diseño **dark/light**, animaciones suaves, contenido desde `astro:content` y sistema de **traducciones (ES/EN)** con i18next.

---

## ✨ Características

- **UI consistente y accesible**
  - Modo **oscuro/claro** persistente (`localStorage`, `prefers-color-scheme`).
  - Navegación con manejo de foco, `aria-*`, `aria-live` y “skip links”.
  - Encabezado sticky con realce de sección activa y menús accesibles.
- **Internacionalización (i18n)**
  - i18next + http-backend.
  - Claves en `public/locales/{es|en}/common.json`.
  - Marcado por atributos: `data-i18n`, `data-i18n-html`, `data-i18n-attr`, `data-i18n-params`.
  - Actualización del atributo `lang` y del selector de idioma.
- **Habilidades (Skills)**
  - Medidores con `aria-label` dinámico (porcentaje), tooltips y títulos traducibles.
- **Proyectos**
  - Cargados desde **collections** (`astro:content`) y ordenados por año.
  - Traducciones por **slug**: `projects.<slug>.title` y `projects.<slug>.description`.
- **Testimonios**
  - Carrusel con **Swiper** (accesible), fallback en **grid** si no hay JS.
  - Traducciones por **key** (`testimonials.items.<key>.*`).
- **Formulario de Contacto**
  - Envío con **Formsubmit** (sin backend).
  - Validación en cliente (nombre, email, teléfono, país, ciudad, asunto).
  - `_autoresponse` y `_subject` traducibles.
  - `toast` y mensajes inline sin redirecciones obligatorias.
- **Animaciones**
  - Partículas (ligero y respeta `prefers-reduced-motion`).
  - **ScrollReveal** en encabezados y rejillas.
  - Typewriter y efectos motion-safe.

---

## 🧱 Estructura del proyecto (detallada)

> Raíz del proyecto (según tu estructura actual).

```

.
├─ public/                         # Archivos estáticos servidos tal cual
│  ├─ js/
│  │  ├─ menu.js                   # Lógica del menú (toggle, foco, etc.)
│  │  ├─ particles-init.js         # Inicialización de partículas
│  │  ├─ particles.min.js          # Librería de partículas (minificada)
│  │  └─ script.js                 # Comportamiento general: tema, i18n hooks, swiper, typewriter, parallax, validación/form + toast
│  ├─ locales/
│  │  ├─ en/
│  │  │  └─ common.json            # Traducciones EN (header, hero, about, skills, portfolio, testimonials, contact, footer, projects.\*)
│  │  └─ es/
│  │     └─ common.json            # Traducciones ES (estructura espejada de EN)
│  ├─ cv.pdf                       # Hoja de vida para descargar
│  ├─ favicon.ico
│  └─ favicon.svg
│
├─ src/
│  ├─ assets/                      # Imágenes/medios específicos de componentes (opcional)
│  ├─ components/
│  │  ├─ About.astro               # Sección “Sobre mí” (i18n con data-i18n)
│  │  ├─ ContactForm.astro         # Formulario (Formsubmit + validación + i18n en labels/placeholder/hidden)
│  │  ├─ Education.astro           # Educación (estructura de bloque; se puede i18n-izar)
│  │  ├─ Experience.astro          # Experiencia (estructura de bloque; se puede i18n-izar)
│  │  ├─ Footer.astro              # Footer (copy con {{year}} + botón “volver arriba”)
│  │  ├─ Header.astro              # Header (tema, menú, selector de idioma)
│  │  ├─ Hero.astro                # Hero principal (typed, CTA, social)
│  │  ├─ Projects.astro            # Cards desde astro\:content + i18n por slug
│  │  ├─ Skills.astro              # Medidores + listas técnicas/profesionales (i18n completo)
│  │  └─ Testimonials.astro        # Swiper accesible + grid fallback (i18n por key)
│  ├─ content/
│  │  └─ projects/                 # Content collection (MD) para proyectos
│  │     ├─ aquacontrol.md
│  │     ├─ casalup-services.md
│  │     ├─ cea-dizcar.md
│  │     ├─ gcltracs.md
│  │     ├─ innova-energy.md
│  │     ├─ innovamc.md
│  │     ├─ iqhome.md
│  │     ├─ nitt.md
│  │     └─ solon-soluciones.md
│  ├─ layouts/
│  │  └─ (Base.astro opcional)     # Layout base si lo usas (cabecera, pie, fuentes, scripts comunes)
│  ├─ pages/
│  │  └─ index.astro               # Home que compone los componentes
│  └─ styles/
│     ├─ base.css                  # Reset/base, variables CSS (—bg, —text, —accent…)
│     ├─ components.css            # Estilos para componentes (botones, cards, badges…)
│     ├─ sections.css              # Estilos de secciones (hero, about, skills, portfolio…)
│     └─ responsive.css            # Breakpoints y ajustes responsivos
│
├─ astro.config.mjs                # Configuración de Astro (incluye site para Pages si aplica)
├─ package.json                    # Scripts y dependencias
├─ package-lock.json               # Lockfile de NPM
├─ tsconfig.json                   # Config TS (si usas TS con Astro)
├─ index.html                      # (Opcional) landing estática o redirección
└─ README.md                       # Este archivo

````

### 📁 Descripción rápida de carpetas

- **public/**: estáticos (no pasan por el pipeline). Aquí viven `locales/` para i18n y los JS globales que sirves desde CDN/etiquetas `<script>`.
- **src/components/**: secciones y piezas reutilizables. Todo lo i18n-izado por atributos `data-i18n*`.
- **src/content/projects/**: archivos MD que alimentan **Projects** (leídos con `getCollection('projects')`).
- **src/styles/**: CSS modularizado (variables, componentes, secciones y responsive).
- **src/pages/index.astro**: compone `Hero`, `About`, `Skills`, `Projects`, `Testimonials`, `ContactForm`.

---

## 🌍 Internacionalización (i18n)

**Archivos**
- `public/locales/es/common.json` (ES)
- `public/locales/en/common.json` (EN)

**Marcado en componentes**
- Texto plano:  
  ```html
  <span data-i18n="skills.tech"></span>
````

* HTML embebido:

  ```html
  <h2 data-i18n="skills.title" data-i18n-html></h2>
  ```
* Atributos (alt, title, aria-\*):

  ```html
  <img data-i18n-attr="alt:hero.portraitAlt">
  ```
* Parámetros (placeholders `{{percent}}`, `{{title}}`, etc.):

  ```html
  <span class="gauge"
        data-i18n-attr="aria-label:skills.gauge_aria"
        data-i18n-params='{"percent":85}'></span>
  ```

**Proyectos (Projects.astro)**

* Usa el **slug** del MD como clave:
  `projects.<slug>.title` y `projects.<slug>.description`.

**Testimonios (Testimonials.astro)**

* Cada item tiene una **key**:
  `testimonials.items.<key>.{company,person,role,text}`
* Controles accesibles: `testimonials.a11y.{prev,next,carousel,pagination,slide_of,rating}`.

---

## 🗂️ Contenido de Proyectos

Lectura desde `astro:content`:

```ts
import { getCollection } from "astro:content";
const items = (await getCollection("projects"))
  .sort((a, b) => (b.data.year || 0) - (a.data.year || 0));
```

Ejemplo de `src/content/projects/mi-proyecto.md`:

```md
---
title: "Panel de pedidos"
year: 2024
description: "Panel rápido para gestionar clientes y órdenes."
stack: ["React", "Django", "PostgreSQL"]
image: "/images/projects/panel.webp"
url: "https://demo.ejemplo.com"
repo: "https://github.com/usuario/repositorio"
---
```

**Campos usados por la tarjeta:**

* `title` (obligatorio)
* `description` (opcional)
* `stack` (array opcional)
* `image` (opcional; con fallback)
* `url` (opcional; botón “visitar”)
* `repo` (opcional; botón “código”)
* `demo` (opcional; botón “demo”)

---

## 📬 Formulario de Contacto (Formsubmit)

El formulario usa **Formsubmit** con **token** en el `action`:

```html
<form
  id="contact-form"
  action="https://formsubmit.co/TU_TOKEN"
  method="POST"
  class="form form--pro"
  novalidate>
```

**Campos ocultos:**

* `_subject`: asunto (traducible con `data-i18n-attr="value:contact.form.mail_subject"`).
* `_template=table`: plantilla de correo.
* `_captcha=false`: desactiva captcha.
* `_autoresponse`: texto de autorespuesta (traducible).
* `_next`: vacío (se usa toast en la misma página) o URL de gracias.

**Validación y UX:**

* Todos los campos **obligatorios** excepto `message`.
* Validación de **email** y **teléfono** (7–20 con `+ ( ) - .` y espacios).
* Solo letras/espacios para **nombre/país/ciudad** (incluye acentos y ñ).
* Mensajes inline (`.field-error`) y `aria-invalid`; `toast` de éxito/error.

**Activación de Formsubmit:**

1. Primer envío desde un origen (localhost o dominio) → llega email “Activate FormSubmit on …”.
2. Pulsa **Activate** una vez por origen.
3. Preferible usar **token** en `action` (no correo plano).

---

## 🧩 Dependencias externas (CDN)

* **Boxicons** (íconos)
* **Swiper** (carrusel)
* **ScrollReveal** (reveals)
* **Particles.js** (fondo)

`prefers-reduced-motion` está respetado para minimizar animaciones.

---

## 🧪 Scripts de NPM

```bash
npm install       # instala dependencias
npm run dev       # entorno de desarrollo
npm run build     # build de producción (salida estática)
npm run preview   # vista previa de producción
```

---

## 🚢 Despliegue (GitHub Pages)

1. Configura `site` con tu URL en `astro.config.mjs`:

   ```js
   import { defineConfig } from 'astro/config';
   export default defineConfig({
     site: 'https://manuelc14.github.io/',
   });
   ```

2. Publica la carpeta de build (`dist/`, o `docs/` si así lo configuras) en la rama de Pages.

3. Verifica rutas de assets/imágenes.

4. Primer envío del formulario en producción → **actívalo** desde el email de Formsubmit.

---

## 🔐 Accesibilidad & Performance

* `aria-label`, `aria-live`, `role="alert"` en errores; `aria-expanded` en menú.
* Control y trampa de foco en el menú móvil.
* Carga diferida/condicional de scripts y fallbacks sin JS.
* `fetchpriority`/`preload` para imagen principal.
* Colores, contrastes y tamaños de toque amigables.

---

## 🛠️ Stack

* **Astro** (SSR-ready, salida estática)
* **Vanilla JS** (i18n, UI, validación)
* **i18next** + http-backend
* **CSS** con variables (`--bg`, `--card`, `--text`, `--accent`, etc.)
* **Swiper**, **ScrollReveal**, **Particles.js**, **Boxicons**

---

## 📎 Créditos

* Diseño y estilos: CSS propio.
* Comportamiento: `public/js/script.js` + (`menu.js`, `particles-init.js`).
* Íconos: [Boxicons](https://boxicons.com/)
* Carrusel: [Swiper](https://swiperjs.com/)
* Formulario sin backend: [Formsubmit](https://formsubmit.co/)

---

## 📄 Licencia

Proyecto personal. Puedes revisar el código y tomar ideas para tu propio portafolio.

