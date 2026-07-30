import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.7/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.7/ScrollTrigger.js/+esm";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initGsapMotion() {
  if (reduceMotion()) {
    gsap.set([".reveal", "[data-hero-line]", ".process-step", ".stat__value"], {
      clearProps: "all",
      opacity: 1,
      y: 0,
      filter: "none",
    });
    return;
  }

  // Hero entrance
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .from(".hero__eyebrow", { y: 20, opacity: 0, duration: 0.7 })
    .from(".hero__title .line", { y: 48, opacity: 0, duration: 0.85, stagger: 0.1 }, "-=0.35")
    .from(".hero__subtitle", { y: 24, opacity: 0, duration: 0.7 }, "-=0.45")
    .from(".hero__meta span", { y: 12, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.4")
    .from(".hero__actions > *", { y: 18, opacity: 0, duration: 0.55, stagger: 0.08 }, "-=0.35")
    .from(".hero__canvas-wrap", { opacity: 0, scale: 0.96, duration: 1.1 }, "-=0.9");

  // Scroll reveals (skip items already handled by grid stagger)
  gsap.utils.toArray(".reveal").forEach((el) => {
    if (el.closest(".services__grid, .projects__grid, .diff__grid, .testimonials__grid, .tech__cloud")) {
      return;
    }
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
      y: 36,
      opacity: 0,
      filter: "blur(8px)",
      duration: 0.85,
      ease: "power3.out",
    });
  });

  // Service / project cards stagger
  gsap.utils.toArray(".services__grid, .projects__grid, .diff__grid, .testimonials__grid").forEach((grid) => {
    const cards = grid.querySelectorAll(":scope > *");
    gsap.from(cards, {
      scrollTrigger: {
        trigger: grid,
        start: "top 82%",
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
    });
  });

  // Process steps
  gsap.from(".process-step", {
    scrollTrigger: {
      trigger: ".process__timeline",
      start: "top 75%",
    },
    y: 30,
    opacity: 0,
    duration: 0.65,
    stagger: 0.12,
    ease: "power2.out",
  });

  // Tech badges wave
  gsap.from(".tech__cloud .badge", {
    scrollTrigger: {
      trigger: ".tech__cloud",
      start: "top 85%",
    },
    y: 16,
    opacity: 0,
    scale: 0.92,
    duration: 0.45,
    stagger: { each: 0.03, from: "center" },
    ease: "power2.out",
  });

  // Counters
  gsap.utils.toArray("[data-counter]").forEach((el) => {
    const target = Number(el.getAttribute("data-target") || 0);
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
          },
        });
      },
    });
  });

  // Magnetic buttons
  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    const strength = 18;
    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x / strength, y: y / strength, duration: 0.35, ease: "power2.out" });
    });
    btn.addEventListener("pointerleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.4)" });
    });
  });

  // Marquee speed feel via GSAP (optional pause on hover)
  const track = document.querySelector(".marquee__track");
  if (track) {
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 32,
      ease: "none",
      repeat: -1,
    });
    track.parentElement?.addEventListener("pointerenter", () => tween.timeScale(0.35));
    track.parentElement?.addEventListener("pointerleave", () => tween.timeScale(1));
  }

  // Parallax soft on hero canvas
  gsap.to(".hero__canvas-wrap", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    y: 120,
    opacity: 0.35,
    ease: "none",
  });
}
