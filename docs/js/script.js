document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('menu-toggle');
    const panel = document.getElementById('mobile-nav');
    const overlay = document.getElementById('nav-overlay');
    let lastFocus = null;

    const openMenu = () => {
        if (!btn || !panel || !overlay) return;
        lastFocus = document.activeElement;
        btn.setAttribute('aria-expanded', 'true');
        panel.dataset.state = 'open';
        panel.hidden = false;
        overlay.dataset.open = 'true';
        overlay.hidden = false;
        document.body.classList.add('body-lock');
        const firstLink = panel.querySelector('a');
        if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
        if (!btn || !panel || !overlay) return;
        btn.setAttribute('aria-expanded', 'false');
        panel.dataset.state = 'closed';
        overlay.dataset.open = 'false';
        document.body.classList.remove('body-lock');
        setTimeout(() => {
            if (panel.dataset.state === 'closed') {
                panel.hidden = true;
                overlay.hidden = true;
            }
        }, 280);
        if (lastFocus) btn.focus();
    };

    const toggleMenu = () => {
        if (!btn || !panel) return;
        panel.dataset.state === 'open' ? closeMenu() : openMenu();
    };

    if (btn && panel && overlay) {
        btn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.dataset.state === 'open') {
                e.preventDefault();
                closeMenu();
            }
        });
        panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
        panel.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            const focusables = panel.querySelectorAll('a,button');
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                last.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        });
    }

    if (!btn || !panel || !overlay) {
        const menuIcon = document.querySelector('#menu-icon');
        const navbar = document.querySelector('.navbar');
        if (menuIcon && navbar) {
            menuIcon.addEventListener('click', () => {
                menuIcon.classList.toggle('bx-x');
                navbar.classList.toggle('active');
            });
            document.querySelectorAll('header nav a').forEach((a) => {
                a.addEventListener('click', () => {
                    menuIcon.classList.remove('bx-x');
                    navbar.classList.remove('active');
                });
            });
        }
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav a, .mobile-nav a');

    const setActiveLink = () => {
        const top = window.scrollY;
        sections.forEach((sec) => {
            const offset = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (top >= offset && top < offset + height) {
                navLinks.forEach((link) => link.classList.remove('active'));
                const selector = `a[href*="${id}"]`;
                document.querySelectorAll(selector).forEach((el) => el.classList.add('active'));
            }
        });
        const header = document.querySelector('.header');
        if (header) header.classList.toggle('sticky', window.scrollY > 100);
    };

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();

    const darkModeIcon = document.getElementById('darkMode-icon');
    if (darkModeIcon) {
        const iconEl = darkModeIcon.matches('i, .bx') ? darkModeIcon : darkModeIcon.querySelector('i') || darkModeIcon;
        const setIcon = (isDark) => {
            iconEl.classList.toggle('bxs-sun', isDark);
            iconEl.classList.toggle('bxs-moon', !isDark);
            iconEl.classList.add('bx');
        };
        const stored = localStorage.getItem('theme');
        const isDarkInit = stored ? stored === 'dark' : document.documentElement.classList.contains('dark-mode');
        if (isDarkInit) document.documentElement.classList.add('dark-mode');
        else document.documentElement.classList.remove('dark-mode');
        setIcon(isDarkInit);
        darkModeIcon.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
            const isDark = document.documentElement.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            setIcon(isDark);
        });
    }

    if (window.Swiper) {
        new window.Swiper('.mySwiper', {
            slidesPerView: 1,
            spaceBetween: 40,
            loop: true,
            grabCursor: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    }

    (function initTypewriter() {
        const el = document.getElementById('typed');
        if (!el) return;
        const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!motionOK) {
            el.textContent = 'Desarrollador Full-Stack';
            const particles = document.getElementById('particles-js');
            if (particles) particles.remove();
            return;
        }
        const phrases = ['Desarrollador Full-Stack', 'React · Vue · Django · Laravel', 'Siempre aprendiendo 🚀'];
        const typeSpeed = 45;
        const backSpeed = 25;
        const backDelay = 1000;
        let i = 0;
        let j = 0;
        let typing = true;

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
    })();

    (function initParallax() {
        const wrap = document.querySelector('.portrait__wrap');
        if (!wrap) return;
        const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!motionOK) return;
        let raf = null;
        let tx = 0,
            ty = 0,
            rx = 0,
            ry = 0;
        const lerp = (a, b, n) => a + (b - a) * n;
        const onMove = (e) => {
            const r = wrap.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = (e.clientX - cx) / r.width;
            const dy = (e.clientY - cy) / r.height;
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
            tx = 0;
            ty = 0;
            rx = 0;
            ry = 0;
            wrap.style.transform = `translate3d(0,0,0) rotateX(0) rotateY(0)`;
        };
        document.addEventListener('mousemove', onMove);
        wrap.addEventListener('mouseleave', reset);
    })();
});