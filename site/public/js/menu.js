document.addEventListener("DOMContentLoaded", () => {
    const d = document;
    const body = d.body;
    const overlay = d.getElementById("nav-overlay");
    const panel = d.getElementById("mobile-nav");
    const openBtn = d.getElementById("menu-toggle");
    const closeBtn = d.getElementById("mobile-close");

    if (!panel || panel.dataset.jsInit === "1") return;
    panel.dataset.jsInit = "1";

    function focusables() {
        return panel.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
    }

    let lastFocus = null;

    function setHidden(el, v) {
        if (el) el.hidden = v;
    }

    function openMenu() {
        lastFocus = d.activeElement;
        if (openBtn) openBtn.setAttribute("aria-expanded", "true");
        panel.dataset.state = "open";
        setHidden(panel, false);
        if (overlay) overlay.setAttribute("data-open", "true");
        setHidden(overlay, false);
        body.classList.add("body-lock");
        panel.setAttribute("aria-modal", "true");
        setTimeout(() => {
            const first = focusables()[0] || closeBtn || panel;
            if (first && first.focus) first.focus({
                preventScroll: true
            });
        }, 0);
    }

    function closeMenu() {
        if (openBtn) openBtn.setAttribute("aria-expanded", "false");
        panel.dataset.state = "closed";
        if (overlay) overlay.removeAttribute("data-open");
        body.classList.remove("body-lock");
        panel.removeAttribute("aria-modal");
        setTimeout(() => {
            if (panel.dataset.state === "closed") {
                setHidden(panel, true);
                setHidden(overlay, true);
            }
        }, 280);
        if (lastFocus && lastFocus.focus) lastFocus.focus({
            preventScroll: true
        });
    }

    function toggleMenu() {
        panel.dataset.state === "open" ? closeMenu() : openMenu();
    }

    if (openBtn) openBtn.addEventListener("click", toggleMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);

    d.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && panel.dataset.state === "open") {
            e.preventDefault();
            closeMenu();
        }
    });

    panel.addEventListener("keydown", (e) => {
        if (e.key !== "Tab") return;
        const nodes = Array.from(focusables());
        if (!nodes.length) return;
        const first = nodes[0],
            last = nodes[nodes.length - 1];
        if (e.shiftKey && d.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && d.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

    panel.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
});