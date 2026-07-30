const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (reduceMotion()) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

export function initParallax() {
  if (reduceMotion()) return;

  const orbs = document.querySelectorAll("[data-parallax]");
  const scene = document.querySelector("[data-parallax-scene]");
  if (!orbs.length && !scene) return;

  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    orbs.forEach((orb) => {
      const speed = Number(orb.getAttribute("data-parallax") || 0.1);
      orb.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });

    if (scene) {
      const rect = scene.getBoundingClientRect();
      const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.02;
      scene.style.transform = `translate3d(0, ${progress}px, 0)`;
    }

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}
