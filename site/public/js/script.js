document.addEventListener("DOMContentLoaded", () => {
    const d = document;
    const t = (k, opt) => (window.i18next ? window.i18next.t(k, opt) : undefined) ?? k;

    const sections = Array.from(d.querySelectorAll("section[id]"));
    const navLinks = Array.from(d.querySelectorAll("header nav a, .mobile-nav a"));
    const byHref = (id) => d.querySelectorAll(`a[href*="${CSS.escape(id)}"]`);

    if ("IntersectionObserver" in window && sections.length) {
        const active = new Set();
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.getAttribute("id");
                    if (!id) return;
                    if (entry.isIntersecting) active.add(id);
                    else active.delete(id);
                });
                navLinks.forEach((l) => l.classList.remove("active"));
                const current = [...active].at(-1);
                if (current) byHref(current).forEach((el) => el.classList.add("active"));
            }, {
                rootMargin: "-40% 0px -55% 0px",
                threshold: 0.01
            }
        );
        sections.forEach((sec) => io.observe(sec));
    } else {
        const setActiveLink = () => {
            const top = window.scrollY;
            sections.forEach((sec) => {
                const offset = sec.offsetTop - 150;
                const height = sec.offsetHeight;
                const id = sec.getAttribute("id");
                if (!id) return;
                if (top >= offset && top < offset + height) {
                    navLinks.forEach((link) => link.classList.remove("active"));
                    byHref(id).forEach((el) => el.classList.add("active"));
                }
            });
        };
        window.addEventListener("scroll", setActiveLink, {
            passive: true
        });
        setActiveLink();
    }

    const header = d.querySelector(".header");
    if (header) {
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            requestAnimationFrame(() => {
                header.classList.toggle("sticky", window.scrollY > 100);
                ticking = false;
            });
            ticking = true;
        };
        window.addEventListener("scroll", onScroll, {
            passive: true
        });
        onScroll();
    }

    const darkModeIcon = d.getElementById("darkMode-icon");
    if (darkModeIcon) {
        const iconEl = darkModeIcon.matches("i, .bx") ? darkModeIcon : darkModeIcon.querySelector("i") || darkModeIcon;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
        const apply = (isDark) => {
            d.documentElement.classList.toggle("dark-mode", isDark);
            d.documentElement.classList.toggle("light", !isDark);
            iconEl.classList.toggle("bxs-sun", isDark);
            iconEl.classList.toggle("bxs-moon", !isDark);
            iconEl.classList.add("bx");
        };
        const stored = localStorage.getItem("theme");
        const initDark = stored ? stored === "dark" : prefersDark.matches || d.documentElement.classList.contains("dark-mode");
        apply(initDark);
        darkModeIcon.addEventListener("click", () => {
            const nowDark = !d.documentElement.classList.contains("dark-mode");
            apply(nowDark);
            localStorage.setItem("theme", nowDark ? "dark" : "light");
        });
        if (typeof prefersDark.addEventListener === "function") {
            prefersDark.addEventListener("change", (e) => {
                if (!localStorage.getItem("theme")) apply(e.matches);
            });
        }
    }

    let swiperInstance = null;

    function initSwiper() {
        const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!window.Swiper) return;
        const root = document.querySelector(".testimonial-swiper");
        if (!root) return;
        if (swiperInstance) {
            try {
                swiperInstance.destroy(true, true);
            } catch (_) {}
            swiperInstance = null;
        }
        const paginationEl = root.querySelector(".swiper-pagination");
        const nextEl = root.querySelector(".swiper-button-next");
        const prevEl = root.querySelector(".swiper-button-prev");
        swiperInstance = new window.Swiper(root, {
            slidesPerView: 1,
            spaceBetween: 28,
            loop: true,
            grabCursor: true,
            watchOverflow: true,
            speed: 600,
            autoplay: motionReduced ?
                false :
                {
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
            a11y: {
                enabled: true,
                prevSlideMessage: t("testimonials.a11y.prev"),
                nextSlideMessage: t("testimonials.a11y.next"),
                paginationBulletMessage: t("testimonials.a11y.bullet")
            },
            pagination: {
                el: paginationEl,
                clickable: true
            },
            navigation: {
                nextEl,
                prevEl
            },
            breakpoints: {
                768: {
                    slidesPerView: 1.2
                },
                1024: {
                    slidesPerView: 2
                },
                1280: {
                    slidesPerView: 2.25
                }
            }
        });
        try {
            const io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (swiperInstance && swiperInstance.autoplay) {
                            if (entry.isIntersecting) swiperInstance.autoplay.start();
                            else swiperInstance.autoplay.stop();
                        }
                    });
                }, {
                    threshold: 0.2
                }
            );
            io.observe(root);
        } catch (_) {}
        document.addEventListener("visibilitychange", () => {
            if (swiperInstance && swiperInstance.autoplay) {
                if (document.hidden) swiperInstance.autoplay.stop();
                else swiperInstance.autoplay.start();
            }
        });
        document.querySelectorAll(".no-swiper").forEach((el) => {
            el.style.display = "none";
        });
    }

    initSwiper();
    if (window.i18next) window.i18next.on("languageChanged", () => initSwiper());

    (() => {
        const el = d.getElementById("typed");
        if (!el) return;
        const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function getPhrases() {
            if (window.i18next && window.i18next.isInitialized) {
                const arr =
                    window.i18next.t("hero.typed", {
                        returnObjects: true
                    }) ||
                    window.i18next.t("typed", {
                        returnObjects: true
                    });
                if (Array.isArray(arr) && arr.length) return arr;
            }
            return ["Desarrollador Full-Stack", "React · Vue · Django · Laravel", "Siempre aprendiendo 🚀"];
        }
        if (!motionOK) {
            el.textContent = getPhrases()[0];
            const p = d.getElementById("particles-js");
            if (p) p.remove();
            return;
        }
        let phrases = getPhrases(),
            i = 0,
            j = 0,
            typing = true;
        const typeSpeed = 40,
            backSpeed = 35,
            backDelay = 2000;

        function tick() {
            const current = phrases[i];
            if (typing) {
                el.textContent = current.slice(0, j + 1);
                j++;
                if (j === current.length) {
                    typing = false;
                    setTimeout(tick, backDelay);
                    return;
                }
                setTimeout(tick, typeSpeed);
            } else {
                el.textContent = current.slice(0, j - 1);
                j--;
                if (j === 0) {
                    typing = true;
                    i = (i + 1) % phrases.length;
                }
                setTimeout(tick, backSpeed);
            }
        }
        tick();
        if (window.i18next) {
            window.i18next.on("languageChanged", () => {
                phrases = getPhrases();
                i = 0;
                j = 0;
                typing = true;
                el.textContent = "";
            });
        }
    })();

    (() => {
        const wrap = d.querySelector(".portrait__wrap");
        if (!wrap) return;
        const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!motionOK) return;
        let raf = null,
            tx = 0,
            ty = 0,
            rx = 0,
            ry = 0;
        const onMove = (e) => {
            const r = wrap.getBoundingClientRect();
            const cx = r.left + r.width / 2,
                cy = r.top + r.height / 2;
            const dx = (e.clientX - cx) / r.width,
                dy = (e.clientY - cy) / r.height;
            tx = dx * 12;
            ty = dy * 12;
            ry = dx * 6;
            rx = -dy * 6;
            if (!raf) raf = requestAnimationFrame(apply);
        };
        const apply = () => {
            wrap.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
            raf = null;
        };
        const reset = () => {
            tx = ty = rx = ry = 0;
            wrap.style.transform = `translate3d(0,0,0) rotateX(0) rotateY(0)`;
        };
        d.addEventListener("mousemove", onMove, {
            passive: true
        });
        wrap.addEventListener("mouseleave", reset);
    })();

    (() => {
        const form = document.getElementById("contact-form");
        if (!form) return;
        const status = document.getElementById("form-status");
        const btn = form.querySelector(".btn-submit");
        const action = form.getAttribute("action") || "";
        if (action.indexOf("https://formsubmit.co/") !== 0) return;
        let toast = document.getElementById("toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast";
            toast.style.cssText =
                "position:fixed;bottom:2rem;right:2rem;z-index:9999;background:var(--card);color:var(--text);border:1px solid var(--accent);border-radius:12px;padding:1rem 1.25rem;box-shadow:0 8px 20px rgba(0,0,0,.35);opacity:0;transform:translateY(16px);transition:opacity .25s,transform .25s;pointer-events:none;max-width:320px;font-size:1.4rem;";
            document.body.appendChild(toast);
        }
        const showToast = (msg, ok = true) => {
            toast.textContent = msg;
            toast.style.borderColor = ok ? "var(--accent)" : "crimson";
            toast.style.background = ok ? "var(--card)" : "rgba(220,53,69,.92)";
            toast.style.color = ok ? "var(--text)" : "#fff";
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
            setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.transform = "translateY(16px)";
            }, 3000);
        };
        const normalizePhone = (v) => v.replace(/[^\d]/g, "");
        const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        const isAlpha = (v) => /^[A-Za-zÀ-ÿ\u00f1\u00d1]+(?:[ .,'-][A-Za-zÀ-ÿ\u00f1\u00d1]+)*$/.test(v.trim());
        const V = (k) => t(`contact.form.validation.${k}`);
        const BTN = (k) => t(`contact.form.btn.${k}`);
        const TOAST = (k) => t(`contact.form.toast.${k}`);
        const fields = {
            name: {
                el: form.querySelector("#name"),
                err: document.getElementById("err-name"),
                validate: (v) => (!v.trim() ? V("name_required") : !isAlpha(v) ? V("name_letters") : v.trim().length < 2 ? V("name_short") : "")
            },
            phone: {
                el: form.querySelector("#phone"),
                err: document.getElementById("err-phone"),
                validate: (v) =>
                    !v.trim() ? V("phone_required") : ((n) => (n.length < 7 || n.length > 15 ? V("phone_invalid") : ""))(normalizePhone(v))
            },
            email: {
                el: form.querySelector("#email"),
                err: document.getElementById("err-email"),
                validate: (v) => (!v.trim() ? V("email_required") : !isEmail(v) ? V("email_invalid") : "")
            },
            country: {
                el: form.querySelector("#country"),
                err: document.getElementById("err-country"),
                validate: (v) => (!v.trim() ? V("country_required") : !isAlpha(v) ? V("country_letters") : "")
            },
            city: {
                el: form.querySelector("#city"),
                err: document.getElementById("err-city"),
                validate: (v) => (!v.trim() ? V("city_required") : !isAlpha(v) ? V("city_letters") : "")
            },
            subject: {
                el: form.querySelector("#subject"),
                err: document.getElementById("err-subject"),
                validate: (v) => (!v.trim() ? V("subject_required") : v.trim().length < 3 ? V("subject_short") : "")
            },
            message: {
                el: form.querySelector("#message"),
                err: document.getElementById("err-message"),
                validate: (v) => (v && v.length > 1000 ? V("message_max") : "")
            }
        };
        const showError = (field, msg) => {
            field.el.classList.toggle("is-invalid", !!msg);
            field.el.setAttribute("aria-invalid", msg ? "true" : "false");
            if (field.err) field.err.textContent = msg || "";
        };
        const validateField = (field) => {
            const val = (field.el.value || "").trim();
            const msg = field.validate(val);
            showError(field, msg);
            return msg;
        };
        Object.values(fields).forEach((f) => {
            if (!f.el) return;
            const handler = () => validateField(f);
            f.el.addEventListener("blur", handler);
            f.el.addEventListener("input", () => {
                if (f.el.classList.contains("is-invalid")) handler();
            });
        });
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const errors = Object.values(fields).map(validateField).filter(Boolean);
            if (errors.length) {
                const firstInvalid = Object.values(fields).find((f) => f.el.classList.contains("is-invalid"));
                if (firstInvalid && firstInvalid.el) firstInvalid.el.focus();
                showToast(TOAST("review_fields"), false);
                return;
            }
            if (btn) {
                btn.disabled = true;
                btn.textContent = BTN("sending");
            }
            if (status) status.textContent = "";
            try {
                const fd = new FormData(form);
                const res = await fetch(action, {
                    method: "POST",
                    headers: {
                        Accept: "application/json"
                    },
                    body: fd
                });
                if (res.ok) {
                    showToast(TOAST("sent_ok"));
                    if (btn) btn.textContent = BTN("sent");
                    form.reset();
                    Object.values(fields).forEach((f) => showError(f, ""));
                } else {
                    let msg = TOAST("send_error_generic");
                    try {
                        const data = await res.json();
                        if (data && data.errors && data.errors[0] && data.errors[0].message) msg = data.errors[0].message;
                    } catch (_) {}
                    showToast("⚠️ " + msg, false);
                    if (btn) btn.textContent = BTN("retry");
                }
            } catch (_) {
                showToast(TOAST("send_error_network"), false);
                if (btn) btn.textContent = BTN("retry");
            } finally {
                setTimeout(() => {
                    if (btn) {
                        btn.disabled = false;
                        btn.textContent = t("contact.form.submit") || "Enviar";
                    }
                }, 1500);
            }
        });
        if (window.i18next) {
            window.i18next.on("languageChanged", () => {
                if (btn && !btn.disabled) btn.textContent = t("contact.form.submit");
            });
        }
    })();

    if (window.i18next) window.i18next.on("languageChanged", () => initSwiper());
});