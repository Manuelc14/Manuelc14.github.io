(() => {
  const config = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.5, anim: { enable: false } },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
      move: { enable: true, speed: 2, out_mode: "out" }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
      modes: { repulse: { distance: 120, duration: 0.4 }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  };

  const init = () => {
    const el = document.getElementById("particles-js");
    if (el && window.particlesJS) window.particlesJS("particles-js", config);
  };

  const tryInit = () => {
    if (document.getElementById("particles-js") && window.particlesJS) { init(); return; }
    requestAnimationFrame(tryInit);
  };

  document.addEventListener("astro:page-load", init);
  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("load", init);

  tryInit();
})();
