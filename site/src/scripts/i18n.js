/* =========================================================================
   Traducción en cliente, sin dependencias.
   =========================================================================
   Antes esto cargaba i18next + i18next-http-backend desde unpkg.com: dos
   peticiones a un tercero de las que dependía que el sitio tuviera texto.

   Ahora el español va renderizado en el HTML (bueno para SEO y para quien
   navegue sin JS) y este módulo solo REEMPLAZA el texto cuando se pide
   inglés. En español no descarga absolutamente nada.
   ========================================================================= */

const DEFAULT_LANG = "es";
const LANGS = ["es", "en"];
const STORE_KEY = "lang";

const cache = new Map();

function readStored() {
  try {
    return localStorage.getItem(STORE_KEY);
  } catch (_) {
    return null;
  }
}

function writeStored(lang) {
  try {
    localStorage.setItem(STORE_KEY, lang);
  } catch (_) {
    /* modo privado: el idioma no persiste, pero la sesión funciona */
  }
}

function normalize(lang) {
  const l = String(lang || "").toLowerCase();
  return LANGS.find((x) => l.startsWith(x)) || DEFAULT_LANG;
}

/** Resuelve "a.b.c" dentro del objeto de traducciones. */
function resolve(dict, key) {
  return key.split(".").reduce((acc, part) => (acc == null ? undefined : acc[part]), dict);
}

/** Sustituye {{marcadores}} por sus valores. */
function interpolate(str, params) {
  if (!params || typeof str !== "string") return str;
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(params, k) ? String(params[k]) : m
  );
}

async function load(lang) {
  if (cache.has(lang)) return cache.get(lang);
  const res = await fetch(`/locales/${lang}/common.json`);
  if (!res.ok) throw new Error(`No se pudo cargar el idioma "${lang}" (${res.status})`);
  const dict = await res.json();
  cache.set(lang, dict);
  return dict;
}

function parseParams(el) {
  const raw = el.getAttribute("data-i18n-params");
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return undefined;
  }
}

/** Aplica data-i18n-attr="title:clave; aria-label:otra.clave" */
function applyAttrs(el, dict, params) {
  const map = el.getAttribute("data-i18n-attr");
  if (!map) return;
  for (const pair of map.split(";")) {
    const trimmed = pair.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const attr = trimmed.slice(0, idx).trim();
    const key = trimmed.slice(idx + 1).trim();
    const value = resolve(dict, key);
    if (attr && typeof value === "string") {
      el.setAttribute(attr, interpolate(value, params));
    }
  }
}

function translateTree(root, dict) {
  for (const el of root.querySelectorAll("[data-i18n], [data-i18n-attr]")) {
    const params = parseParams(el);
    const key = el.getAttribute("data-i18n");

    if (key) {
      const value = resolve(dict, key);
      if (typeof value === "string") {
        const text = interpolate(value, params);
        if (el.hasAttribute("data-i18n-html")) el.innerHTML = text;
        else el.textContent = text;
      }
    }

    applyAttrs(el, dict, params);
  }
}

/* --- Guardamos el HTML español original para poder volver sin recargar --- */
const originals = new WeakMap();

function snapshot(root) {
  for (const el of root.querySelectorAll("[data-i18n], [data-i18n-attr]")) {
    if (originals.has(el)) continue;
    originals.set(el, {
      html: el.innerHTML,
      attrs: (el.getAttribute("data-i18n-attr") || "")
        .split(";")
        .map((p) => p.split(":")[0].trim())
        .filter(Boolean)
        .map((a) => [a, el.getAttribute(a)]),
    });
  }
}

function restore(root) {
  for (const el of root.querySelectorAll("[data-i18n], [data-i18n-attr]")) {
    const snap = originals.get(el);
    if (!snap) continue;
    el.innerHTML = snap.html;
    for (const [attr, value] of snap.attrs) {
      if (value === null) el.removeAttribute(attr);
      else el.setAttribute(attr, value);
    }
  }
}

let current = DEFAULT_LANG;

async function setLang(lang) {
  const next = normalize(lang);
  if (next === current) return;

  if (next === DEFAULT_LANG) {
    restore(document.body);
  } else {
    const dict = await load(next);
    translateTree(document.body, dict);
    // El diccionario queda disponible para los mensajes que genera el JS
    // (validación del formulario, avisos), no solo para el marcado.
    window.__i18nDict = dict;
  }

  current = next;
  document.documentElement.lang = next;
  writeStored(next);

  const label = document.querySelector("[data-lang-label]");
  if (label) label.textContent = next.toUpperCase();

  const btn = document.querySelector("[data-lang-toggle]");
  if (btn) {
    btn.setAttribute("title", next === "es" ? "Cambiar a inglés" : "Switch to Spanish");
  }

  if (next === DEFAULT_LANG) window.__i18nDict = null;
  document.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: next } }));
}

/** Traduce una clave suelta desde JS. Devuelve el respaldo si no hay diccionario. */
window.__t = (key, fallback, params) => {
  const dict = window.__i18nDict;
  const value = dict ? resolve(dict, key) : undefined;
  return interpolate(typeof value === "string" ? value : fallback, params);
};

function init() {
  snapshot(document.body);

  const btn = document.querySelector("[data-lang-toggle]");
  if (btn) {
    btn.addEventListener("click", () => {
      setLang(current === "es" ? "en" : "es").catch((err) => {
        console.error("[i18n]", err);
      });
    });
  }

  const stored = readStored();
  if (stored && normalize(stored) !== DEFAULT_LANG) {
    setLang(stored).catch((err) => console.error("[i18n]", err));
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
