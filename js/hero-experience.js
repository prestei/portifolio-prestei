/**
 * Hero Experience
 * Modules: SplitText · Timeline · MouseParallax · Dashboard · Motion buttons
 */
(function () {
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = () =>
    window.matchMedia("(pointer: fine)").matches && window.innerWidth > 900;

  /* ---------- SplitText (custom — no Club plugin) ---------- */
  function splitHeroTitle(title) {
    if (!title || title.dataset.split === "1") return;
    title.dataset.split = "1";

    title.querySelectorAll(".hero__line").forEach((line) => {
      const nodes = Array.from(line.childNodes);
      line.textContent = "";

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const parts = node.textContent.split(/(\s+)/);
          parts.forEach((part) => {
            if (!part) return;
            if (!part.trim()) {
              line.appendChild(document.createTextNode(part));
              return;
            }
            if (/^[.,!?;:…]+$/.test(part)) {
              line.appendChild(document.createTextNode(part));
              return;
            }
            const word = document.createElement("span");
            word.className = "hero__word";
            word.textContent = part;
            line.appendChild(word);
          });
          return;
        }

        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("hero__accent")) {
          const accent = document.createElement("em");
          accent.className = "hero__accent";
          const text = node.textContent;
          text.split("").forEach((ch) => {
            const char = document.createElement("span");
            char.className = "hero__char";
            char.textContent = ch;
            accent.appendChild(char);
          });
          line.appendChild(accent);
          // trailing punctuation after accent stays as sibling text in original — handled by text nodes
          return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          line.appendChild(node.cloneNode(true));
        }
      });
    });
  }

  /* ---------- Dashboard live metrics ---------- */
  function initDashboardLive() {
    if (reduce()) return;
    const latency = document.querySelector("[data-hero-latency]");
    const throughput = document.querySelector("[data-hero-throughput]");
    const fill = document.querySelector("[data-hero-fill]");
    const bars = document.querySelectorAll("[data-hero-bars] span");
    const gsap = window.gsap;

    if (fill && gsap) {
      gsap.to(fill, { width: "78%", duration: 1.6, ease: "power3.out", delay: 1.8 });
    }

    if (bars.length && gsap) {
      gsap.from(bars, {
        scaleY: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: "power3.out",
        delay: 1.55,
        transformOrigin: "bottom center",
      });
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          scaleY: 0.72 + Math.random() * 0.28,
          duration: 1.8 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2.4 + i * 0.08,
        });
      });
    }

    let thr = 72;
    setInterval(() => {
      if (latency) {
        latency.textContent = `${34 + Math.floor(Math.random() * 26)}ms`;
      }
      if (throughput && fill) {
        thr = Math.min(96, Math.max(64, thr + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 3))));
        throughput.textContent = `${thr}%`;
        if (gsap) gsap.to(fill, { width: `${thr}%`, duration: 0.8, ease: "power2.out" });
        else fill.style.width = `${thr}%`;
      }
    }, 1800);
  }

  /* ---------- Mouse parallax depth ---------- */
  function initMouseParallax(hero) {
    if (!desktop() || reduce()) return;
    const content = hero.querySelector("[data-hero-content]");
    const dash = hero.querySelector("[data-hero-dash]");
    const floats = hero.querySelectorAll("[data-hero-float]");
    const stage = hero.querySelector(".hero__stage #hero-canvas");
    const gsap = window.gsap;
    if (!gsap) return;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let scrollP = 0;

    if (window.ScrollTrigger) {
      window.ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          scrollP = self.progress;
        },
      });
    }

    window.addEventListener(
      "pointermove",
      (e) => {
        const r = hero.getBoundingClientRect();
        if (e.clientY < r.top || e.clientY > r.bottom) return;
        mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      },
      { passive: true }
    );

    // Soft ambient float (replaces CSS keyframes so it won't fight transforms)
    floats.forEach((el, i) => {
      gsap.to(el, {
        y: i === 0 ? -10 : -8,
        rotation: i === 0 ? 1 : -1,
        duration: 3.2 + i * 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.2,
      });
    });

    const tick = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      const damp = Math.max(0, 1 - scrollP * 1.6);

      if (content) {
        gsap.set(content, {
          x: mouse.x * 4 * damp,
          y: mouse.y * 3 * damp,
          force3D: true,
        });
      }
      if (dash) {
        gsap.set(dash, {
          x: mouse.x * 10 * damp,
          y: mouse.y * 7 * damp,
          rotateY: mouse.x * 3 * damp,
          rotateX: -mouse.y * 2.5 * damp,
          force3D: true,
        });
      }
      floats.forEach((el, i) => {
        const depth = Number(el.getAttribute("data-depth") || 12);
        const baseY = gsap.getProperty(el, "y") || 0;
        // Keep ambient float y; only nudge x from mouse
        gsap.set(el, {
          x: mouse.x * depth * (i === 0 ? 1 : -0.85) * damp,
          force3D: true,
        });
        void baseY;
      });
      if (stage) {
        gsap.set(stage, {
          x: mouse.x * -16 * damp,
          y: mouse.y * -10 * damp,
          force3D: true,
        });
      }

      requestAnimationFrame(tick);
    };
    tick();

    [dash, ...floats].forEach((el) => {
      if (!el) return;
      el.addEventListener("pointerenter", () => {
        const M = window.Motion;
        if (M?.animate) {
          M.animate(el, { scale: 1.03 }, { type: "spring", stiffness: 260, damping: 20 });
        } else {
          gsap.to(el, { scale: 1.03, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        }
      });
      el.addEventListener("pointerleave", () => {
        const M = window.Motion;
        if (M?.animate) {
          M.animate(el, { scale: 1 }, { type: "spring", stiffness: 280, damping: 22 });
        } else {
          gsap.to(el, { scale: 1, duration: 0.45, overwrite: "auto" });
        }
      });
    });
  }

  /* ---------- Motion button microinteractions ---------- */
  function initHeroButtons() {
    if (reduce()) return;
    const btns = document.querySelectorAll("[data-hero-btn]");
    btns.forEach((btn) => {
      btn.addEventListener("pointerenter", () => {
        const M = window.Motion;
        if (M?.animate) {
          M.animate(btn, { scale: 1.04 }, { type: "spring", stiffness: 320, damping: 18 });
        }
      });
      btn.addEventListener("pointerleave", () => {
        const M = window.Motion;
        if (M?.animate) {
          M.animate(btn, { scale: 1 }, { type: "spring", stiffness: 300, damping: 20 });
        }
      });
      btn.addEventListener("pointerdown", () => {
        const M = window.Motion;
        if (M?.animate) {
          M.animate(btn, { scale: 0.97 }, { type: "spring", stiffness: 400, damping: 22 });
        }
      });
      btn.addEventListener("pointerup", () => {
        const M = window.Motion;
        if (M?.animate) {
          M.animate(btn, { scale: 1.02 }, { type: "spring", stiffness: 280, damping: 16 });
        }
      });
    });
  }

  /* ---------- Scroll exit ---------- */
  function initScrollExit(hero) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger || reduce()) return;

    const inner = hero.querySelector(".hero__inner");
    const side = hero.querySelector("[data-hero-side]");
    const canvas = hero.querySelector(".hero__stage #hero-canvas");
    const cards = hero.querySelectorAll(".hero-card");
    const scrollCue = hero.querySelector("[data-hero-el='scroll']");

    if (inner) {
      gsap.to(inner, {
        y: -70,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
    }
    if (side) {
      gsap.to(side, {
        x: 70,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
    }
    if (cards.length) {
      gsap.to(cards, {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "15% top", end: "55% top", scrub: true },
      });
    }
    if (canvas) {
      gsap.to(canvas, {
        y: 90,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
    }
    if (scrollCue) {
      gsap.to(scrollCue, {
        opacity: 0,
        scrollTrigger: { trigger: hero, start: "12% top", end: "35% top", scrub: true },
      });
    }
  }

  /* ---------- Entrance timeline ---------- */
  function runEntrance(hero) {
    const gsap = window.gsap;
    if (!gsap) return;

    const ease = "power3.out";
    const title = hero.querySelector("[data-hero-title]");
    splitHeroTitle(title);

    const lines = hero.querySelectorAll(".hero__line");
    const words = hero.querySelectorAll(".hero__word");
    const chars = hero.querySelectorAll(".hero__char");
    const accent = hero.querySelector(".hero__accent");

    gsap.set(
      [
        ".nav__logo",
        ".nav__links",
        ".nav__actions",
        "[data-hero-el='badge']",
        "[data-hero-el='subtitle']",
        ".hero-chip",
        "[data-hero-el='actions'] .btn",
        ".hero-dash",
        ".hero-card",
        "[data-hero-el='scroll']",
        words,
        chars,
      ],
      { opacity: 0, y: 28, filter: "blur(8px)" }
    );
    gsap.set(lines, { opacity: 0, y: 36 });
    gsap.set(".hero__aura", { opacity: 0, scale: 0.85 });

    const tl = gsap.timeline({
      defaults: { ease },
      delay: 0.02,
    });

    // 1 Logo
    tl.to(".nav__logo", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.7,
    })
      // 2 Navbar
      .to(
        ".nav__links, .nav__actions",
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, stagger: 0.08 },
        "-=0.35"
      )
      // Aura
      .to(".hero__aura", { opacity: 0.85, scale: 1, duration: 1.1 }, "-=0.5")
      // 3 Badge
      .to(
        "[data-hero-el='badge']",
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 },
        "-=0.55"
      )
      // 4 Headline — lines then words
      .to(lines, { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 }, "-=0.2")
      .fromTo(
        words,
        { opacity: 0, y: 28, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.04 },
        "-=0.45"
      )
      // Letters of "negócio"
      .fromTo(
        chars,
        { opacity: 0, y: 18, filter: "blur(8px)", scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.45,
          stagger: 0.035,
          onComplete: () => {
            if (!accent) return;
            accent.classList.add("is-lit", "is-shine");
            gsap.fromTo(
              accent,
              { scale: 1 },
              { scale: 1.04, duration: 0.35, yoyo: true, repeat: 1, ease: "power2.out" }
            );
          },
        },
        "-=0.15"
      )
      // 5 Subtitle
      .to(
        "[data-hero-el='subtitle']",
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65 },
        "-=0.25"
      )
      // 6 Chips
      .to(
        ".hero-chip",
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, stagger: 0.06 },
        "-=0.35"
      )
      // 7 Buttons
      .to(
        "[data-hero-el='actions'] .btn",
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.1 },
        "-=0.25"
      )
      // 8 Dashboard + floating cards
      .to(
        ".hero-dash",
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.55"
      )
      .to(
        ".hero-card",
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.12,
        },
        "-=0.65"
      )
      .to(
        "[data-hero-el='scroll']",
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5 },
        "-=0.35"
      );

    gsap.set(".hero-dash", { scale: 0.96 });
  }

  window.initHeroExperience = function initHeroExperience() {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    if (reduce()) {
      hero.classList.add("is-ready");
      return;
    }

    runEntrance(hero);
    initMouseParallax(hero);
    initDashboardLive();
    initHeroButtons();
    initScrollExit(hero);
    hero.classList.add("is-ready");
  };
})();
