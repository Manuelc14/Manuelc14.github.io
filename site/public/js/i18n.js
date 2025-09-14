(function () {
    var FALLBACK = "es";
    var LANG_EMOJI = {
        es: "🇪🇸",
        en: "🇺🇸"
    };

    function normalize(lng) {
        if (!lng) return FALLBACK;
        lng = String(lng).toLowerCase();
        if (lng.indexOf("es") === 0) return "es";
        if (lng.indexOf("en") === 0) return "en";
        return FALLBACK;
    }

    function getStored() {
        try {
            return localStorage.getItem("i18nextLng");
        } catch (_) {
            return null;
        }
    }

    function currentLang() {
        return normalize(getStored() || document.documentElement.lang || navigator.language);
    }

    // ---- Soporte de parámetros en las traducciones ----
    function parseI18nParams(el) {
        var raw = el.getAttribute("data-i18n-params");
        if (!raw) return undefined;
        try {
            return JSON.parse(raw);
        } catch (_) {
            return undefined;
        }
    }

    // Aplica traducciones a atributos: data-i18n-attr="title:clave.aqui; aria-label:otra.clave"
    function applyAttrs(el, key, t, params) {
        var map = el.getAttribute("data-i18n-attr");
        if (!map) return;
        map
            .split(";")
            .map(function (s) {
                return s.trim();
            })
            .filter(Boolean)
            .forEach(function (pair) {
                var parts = pair.indexOf(":") > -1 ? pair.split(":") : [pair, null];
                var attr = parts[0].trim();
                var k = parts[1] ? parts[1].trim() : key;
                var val = t(k, params);
                if (attr) el.setAttribute(attr, val);
            });
    }

    function translateElement(el, t) {
        var key = el.getAttribute("data-i18n");
        if (!key) return;
        var html = el.hasAttribute("data-i18n-html");
        var params = parseI18nParams(el);
        var val = t(key, params);
        if (html) el.innerHTML = val;
        else el.textContent = val;
        applyAttrs(el, key, t, params);
    }

    function renderAll() {
        // t con opciones/params (i18next las usa para {{placeholders}})
        var t = function (k, opts) {
            return (window.i18next && window.i18next.t) ? window.i18next.t(k, opts || {}) : k;
        };

        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            translateElement(el, t);
        });

        var lng = (window.i18next && window.i18next.language) ? window.i18next.language : currentLang();
        document.documentElement.setAttribute("lang", lng);

        // UI de selector de idioma (bandera/código)
        document.querySelectorAll("[data-lang-menu]").forEach(function (root) {
            var flag = root.querySelector(".flag-emoji");
            var code = root.querySelector(".lang-code");
            if (flag) flag.textContent = LANG_EMOJI[lng] || LANG_EMOJI[FALLBACK];
            if (code) code.textContent = lng.toUpperCase();
        });
    }

    function initI18n() {
        if (!window.i18next || !window.i18next.use) {
            // Si no está i18next, al menos renderiza claves -> textos estáticos
            renderAll();
            return;
        }

        window.i18next
            .use(window.i18nextHttpBackend)
            .init({
                lng: currentLang(),
                fallbackLng: FALLBACK,
                debug: false,
                ns: ["common"],
                defaultNS: "common",
                backend: {
                    loadPath: "/locales/{{lng}}/{{ns}}.json"
                },
                interpolation: {
                    escapeValue: false
                },
                returnEmptyString: false
            }, function () {
                renderAll();
            });

        window.i18next.on("languageChanged", renderAll);
        window.i18next.on("loaded", renderAll);
    }

    // Eventos comunes (Astro SPA, render manual, etc.)
    document.addEventListener("DOMContentLoaded", initI18n);
    document.addEventListener("astro:page-load", renderAll);
    document.addEventListener("i18n:render", renderAll);

    // Sincroniza cambios de idioma entre pestañas/ventanas
    window.addEventListener("storage", function (e) {
        if (e.key === "i18nextLng" && window.i18next) {
            var lng = normalize(e.newValue);
            if (lng && lng !== window.i18next.language) window.i18next.changeLanguage(lng);
        }
    });
})();