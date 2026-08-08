/* =========================================================================
   Comportamiento del sitio.
   =========================================================================
   Reemplaza a public/js/{script,menu,particles-init,particles}.js y a las
   dependencias de CDN (Swiper y ScrollReveal). Todo son APIs del navegador:
   IntersectionObserver para las apariciones y scroll-snap para el carrusel.
   ========================================================================= */

const t = (key, fallback, params) =>
  typeof window.__t === "function" ? window.__t(key, fallback, params) : fallback;

/* ------------------------------------------------------------------ tema */
function initTheme() {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark-mode");
    document.documentElement.classList.toggle("light", !isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (_) {
      /* modo privado: el tema no persiste entre visitas */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#0b1220" : "#f4f7fb");
  });
}

/* ------------------------------------------------------- menú de navegación */
function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const backdrop = document.querySelector("[data-nav-backdrop]");
  if (!toggle || !nav) return;

  const iconOpen = toggle.querySelector(".icon-open");
  const iconClose = toggle.querySelector(".icon-close");

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("body-lock", open);
    if (backdrop) {
      backdrop.classList.toggle("is-open", open);
      backdrop.hidden = !open;
    }
    if (iconOpen) iconOpen.style.display = open ? "none" : "";
    if (iconClose) iconClose.style.display = open ? "" : "none";
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  backdrop?.addEventListener("click", () => setOpen(false));
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* --------------------------------- cabecera fija + sección activa en la nav */
function initScrollState() {
  const header = document.querySelector("[data-header]");
  if (header) {
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px";
    document.body.prepend(sentinel);
    new IntersectionObserver(
      ([entry]) => header.classList.toggle("is-stuck", !entry.isIntersecting),
      { rootMargin: "0px" }
    ).observe(sentinel);
  }

  const links = [...document.querySelectorAll(".nav__link")];
  const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = entry.target.id;
        for (const link of links) {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        }
      }
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => observer.observe(s));
}

/* --------------------------------------------------- apariciones al scroll */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );
  items.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------- carrusel */
function initCarousel() {
  const track = document.querySelector("[data-carousel]");
  if (!track) return;

  const slides = [...track.children];
  const dotsBox = document.querySelector("[data-carousel-dots]");
  const prev = document.querySelector("[data-carousel-prev]");
  const next = document.querySelector("[data-carousel-next]");
  if (!slides.length) return;

  const step = () => slides[0].getBoundingClientRect().width + 16;

  prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));

  if (!dotsBox) return;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "testimonials__dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute(
      "aria-label",
      t("testimonials.a11y.bullet", `Ir al testimonio ${i + 1}`, { index: i + 1 })
    );
    dot.addEventListener("click", () => {
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: "smooth" });
    });
    dotsBox.appendChild(dot);
    return dot;
  });

  const sync = () => {
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const mid = slide.offsetLeft - track.offsetLeft + slide.clientWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === best);
      d.setAttribute("aria-selected", String(i === best));
    });
  };

  let ticking = false;
  track.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        sync();
        ticking = false;
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", sync, { passive: true });
  sync();
}

/* ------------------------------------------------------- volver arriba */
function initToTop() {
  const btn = document.querySelector("[data-to-top]");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const observer = new IntersectionObserver(
    ([entry]) => btn.classList.toggle("is-visible", !entry.isIntersecting),
    { rootMargin: "-60% 0px 0px 0px" }
  );
  const hero = document.getElementById("home");
  if (hero) observer.observe(hero);
}

/* ------------------------------------------------------------ formulario */
function initForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = form.querySelector("#form-status");
  const submit = form.querySelector('button[type="submit"] span');
  const submitBtn = form.querySelector('button[type="submit"]');

  const rules = {
    name: (v) =>
      !v.trim()
        ? t("contact.form.validation.name_required", "Nombre es obligatorio.")
        : !/^[A-Za-zÀ-ÿñÑ]+(?:[ '-][A-Za-zÀ-ÿñÑ]+)*$/.test(v.trim())
          ? t("contact.form.validation.name_letters", "Usa solo letras y espacios.")
          : v.trim().length < 2
            ? t("contact.form.validation.name_short", "Muy corto.")
            : "",
    phone: (v) => {
      if (!v.trim()) return t("contact.form.validation.phone_required", "Teléfono es obligatorio.");
      const digits = v.replace(/\D/g, "");
      return digits.length < 7 || digits.length > 15
        ? t("contact.form.validation.phone_invalid", "Teléfono inválido (7-15 dígitos).")
        : "";
    },
    email: (v) =>
      !v.trim()
        ? t("contact.form.validation.email_required", "Email es obligatorio.")
        : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
          ? t("contact.form.validation.email_invalid", "Email inválido.")
          : "",
    country: (v) =>
      !v.trim() ? t("contact.form.validation.country_required", "País es obligatorio.") : "",
    city: (v) =>
      !v.trim() ? t("contact.form.validation.city_required", "Ciudad es obligatoria.") : "",
    subject: (v) =>
      !v.trim()
        ? t("contact.form.validation.subject_required", "Asunto es obligatorio.")
        : v.trim().length < 3
          ? t("contact.form.validation.subject_short", "Asunto muy corto.")
          : "",
  };

  const showError = (name, message) => {
    const input = form.querySelector(`#${name}`);
    const box = form.querySelector(`#err-${name}`);
    if (!input || !box) return;
    box.textContent = message;
    input.classList.toggle("is-invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
  };

  for (const name of Object.keys(rules)) {
    const input = form.querySelector(`#${name}`);
    input?.addEventListener("blur", () => showError(name, rules[name](input.value)));
    input?.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) showError(name, rules[name](input.value));
    });
  }

  const toast = (message, ok = true) => {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.toggle("is-error", !ok);
    requestAnimationFrame(() => el.classList.add("is-visible"));
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("is-visible"), 4000);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let firstBad = null;
    for (const [name, validate] of Object.entries(rules)) {
      const input = form.querySelector(`#${name}`);
      const message = validate(input.value);
      showError(name, message);
      if (message && !firstBad) firstBad = input;
    }

    if (firstBad) {
      firstBad.focus();
      toast(t("contact.form.toast.review_fields", "⚠️ Revisa los campos marcados."), false);
      return;
    }

    const original = submit?.textContent;
    if (submit) submit.textContent = t("contact.form.btn.sending", "Enviando…");
    if (submitBtn) submitBtn.disabled = true;
    if (status) status.textContent = "";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      form.reset();
      if (submit) submit.textContent = t("contact.form.btn.sent", "¡Enviado!");
      toast(t("contact.form.toast.sent_ok", "✅ ¡Mensaje enviado correctamente!"));
      setTimeout(() => {
        if (submit) submit.textContent = original;
        if (submitBtn) submitBtn.disabled = false;
      }, 2500);
    } catch (error) {
      console.error("[contacto]", error);
      if (submit) submit.textContent = t("contact.form.btn.retry", "Reintentar");
      if (submitBtn) submitBtn.disabled = false;
      toast(
        t("contact.form.toast.send_error_network", "⚠️ Error de red. Revisa tu conexión."),
        false
      );
    }
  });
}

/* ------------------------------------------------------------------ arranque */
function init() {
  initTheme();
  initNav();
  initScrollState();
  initReveal();
  initCarousel();
  initToTop();
  initForm();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
