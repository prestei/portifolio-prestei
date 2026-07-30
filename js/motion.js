(function () {
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = () => window.matchMedia("(pointer: fine)").matches && window.innerWidth > 900;

  function splitLines(el) {
    if (!el || el.dataset.split === "1") return;
    const text = el.textContent.trim();
    const words = text.split(/(\s+)/);
    el.textContent = "";
    el.dataset.split = "1";
    const line = document.createElement("span");
    line.className = "split-line";
    const inner = document.createElement("span");
    inner.className = "split-line__inner";
    words.forEach((w) => {
      if (!w.trim()) {
        inner.appendChild(document.createTextNode(w));
        return;
      }
      const span = document.createElement("span");
      span.className = "split-word";
      span.textContent = w;
      inner.appendChild(span);
    });
    line.appendChild(inner);
    el.appendChild(line);
  }

  window.initCursor = function initCursor() {
    if (!desktop() || reduce()) return;
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor";
    ring.className = "cursor__ring";
    document.body.append(dot, ring);
    document.body.classList.add("has-cursor");

    const pos = { x: 0, y: 0, rx: 0, ry: 0 };
    window.addEventListener(
      "pointermove",
      (e) => {
        pos.x = e.clientX;
        pos.y = e.clientY;
      },
      { passive: true }
    );

    const tick = () => {
      pos.rx += (pos.x - pos.rx) * 0.18;
      pos.ry += (pos.y - pos.ry) * 0.18;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%,-50%)`;
      ring.style.transform = `translate3d(${pos.rx}px, ${pos.ry}px, 0) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    document.querySelectorAll("a, button, .card, .badge, .tech-chip").forEach((el) => {
      el.addEventListener("pointerenter", () => document.body.classList.add("is-cursor-hover"));
      el.addEventListener("pointerleave", () => document.body.classList.remove("is-cursor-hover"));
    });
  };

  window.initTiltCards = function initTiltCards() {
    if (!desktop() || reduce()) return;
    document.querySelectorAll(".card, .diff-card, .service-card, .project-card, .testimonial").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const px = (x / r.width - 0.5) * 2;
        const py = (y / r.height - 0.5) * 2;
        card.style.setProperty("--spot-x", `${x}px`);
        card.style.setProperty("--spot-y", `${y}px`);
        card.style.transform = `perspective(900px) rotateY(${px * 4}deg) rotateX(${-py * 4}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  };

  window.initMagneticButtons = function initMagneticButtons() {
    const gsap = window.gsap;
    if (!gsap || !desktop() || reduce()) return;

    document.querySelectorAll(".btn, [data-magnetic]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        btn.style.setProperty("--mx", `${x}%`);
        btn.style.setProperty("--my", `${y}%`);
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) / 12,
          y: (e.clientY - r.top - r.height / 2) / 12,
          scale: 1.03,
          duration: 0.25,
          overwrite: true,
        });
      });
      btn.addEventListener("pointerleave", () => {
        gsap.to(btn, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" });
      });
      btn.addEventListener("click", (e) => {
        const r = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "btn__ripple";
        const size = Math.max(r.width, r.height) * 1.4;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - r.left - size / 2}px`;
        ripple.style.top = `${e.clientY - r.top - size / 2}px`;
        btn.appendChild(ripple);
        if (window.anime) {
          window.anime({
            targets: ripple,
            scale: [0, 1],
            opacity: [0.45, 0],
            duration: 600,
            easing: "easeOutQuad",
            complete: () => ripple.remove(),
          });
        } else {
          setTimeout(() => ripple.remove(), 600);
        }
      });
    });
  };

  window.initMotion = function initMotion() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const anime = window.anime;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    if (reduce()) {
      gsap.set(".reveal, .service-card, .project-card, .diff-card, .process-step, .split-word", {
        clearProps: "all",
        opacity: 1,
        y: 0,
      });
      return;
    }

    // Split section titles (hero title handled by hero-experience.js)
    document.querySelectorAll(".section__title").forEach(splitLines);

    // Motion.dev when ready — ambient float on atmosphere
    const runMotion = () => {
      const M = window.Motion;
      if (!M) return;
      M.animate(
        ".atmosphere__glow--a",
        { x: [0, 40, 0], y: [0, 24, 0] },
        { duration: 14, repeat: Infinity, easing: "ease-in-out" }
      );
      M.animate(
        ".atmosphere__glow--b",
        { x: [0, -30, 0], y: [0, -20, 0] },
        { duration: 18, repeat: Infinity, easing: "ease-in-out" }
      );
      document.querySelectorAll(".diff-card .icon-badge").forEach((el, i) => {
        M.inView(el, () => {
          M.animate(el, { scale: [0.8, 1], opacity: [0, 1] }, { duration: 0.55, delay: i * 0.05 });
        });
      });
    };
    if (window.Motion) runMotion();
    else window.addEventListener("motion:ready", runMotion, { once: true });

    // Scroll reveals
    gsap.utils.toArray(".reveal").forEach((el) => {
      const words = el.querySelectorAll(".split-word");
      if (words.length) {
        gsap.from(words, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          y: "110%",
          opacity: 0,
          duration: 0.7,
          stagger: 0.028,
          ease: "power3.out",
        });
      } else {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          y: 36,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.8,
          ease: "power3.out",
        });
      }
    });

    gsap.from(".service-card", {
      scrollTrigger: { trigger: "[data-services]", start: "top 80%" },
      y: 48,
      opacity: 0,
      duration: 0.7,
      stagger: 0.09,
      ease: "power3.out",
    });

    gsap.from(".showcase__header .section__eyebrow, .showcase__header .section__title, .showcase__header .section__subtitle", {
      scrollTrigger: { trigger: ".showcase", start: "top 78%" },
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
    });

    gsap.from(".diff-card", {
      scrollTrigger: { trigger: ".diff__grid", start: "top 82%" },
      y: 40,
      opacity: 0,
      duration: 0.65,
      stagger: 0.08,
    });

    gsap.from(".testimonial", {
      scrollTrigger: { trigger: ".testimonials__grid", start: "top 82%" },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
    });

    // Process timeline grow
    const progress = document.querySelector(".process__line-progress");
    if (progress) {
      gsap.to(progress, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: ".process__track",
          start: "top 70%",
          end: "bottom 55%",
          scrub: true,
        },
      });
    }

    gsap.utils.toArray(".process-step").forEach((step, i) => {
      gsap.from(step, {
        scrollTrigger: {
          trigger: step,
          start: "top 80%",
          onEnter: () => step.classList.add("is-active"),
          onEnterBack: () => step.classList.add("is-active"),
        },
        y: 28,
        opacity: 0,
        duration: 0.55,
        delay: i * 0.05,
      });
    });

    // Tech chips entrance via anime
    if (anime) {
      const chips = document.querySelectorAll(".tech-chip");
      if (chips.length) {
        ScrollTrigger.create({
          trigger: ".tech-stage",
          start: "top 80%",
          once: true,
          onEnter: () => {
            anime({
              targets: chips,
              scale: [0.6, 1],
              opacity: [0, 1],
              delay: anime.stagger(40),
              duration: 600,
              easing: "easeOutElastic(1, .7)",
            });
          },
        });
      }
    }

    // Counters with bounce
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
            duration: 1.7,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
            },
            onComplete: () => {
              if (anime) {
                anime({
                  targets: el,
                  scale: [1, 1.06, 1],
                  duration: 500,
                  easing: "easeOutElastic(1, .6)",
                });
              }
            },
          });
        },
      });
    });

    // Marquee
    const track = document.querySelector(".marquee__track");
    if (track) {
      const tween = gsap.to(track, { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
      track.parentElement?.addEventListener("pointerenter", () => tween.timeScale(0.35));
      track.parentElement?.addEventListener("pointerleave", () => tween.timeScale(1));
    }

    // Nav progress + active section
    const progressBar = document.querySelector(".nav__progress");
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (progressBar) progressBar.style.width = `${self.progress * 100}%`;
      },
    });

    document.querySelectorAll(".nav__link[href^='#']").forEach((link) => {
      const id = link.getAttribute("href");
      const section = id && document.querySelector(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => link.classList.toggle("is-active", self.isActive),
      });
    });

    // —— Section effects (subtle) ——
    gsap.utils.toArray(".section, .clients, .stats, .cta").forEach((section) => {
      const eyebrow = section.querySelector(".section__eyebrow");
      const subtitle = section.querySelector(".section__subtitle");
      if (eyebrow) {
        gsap.from(eyebrow, {
          scrollTrigger: { trigger: section, start: "top 82%" },
          x: -16,
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
        });
      }
      if (subtitle && !subtitle.classList.contains("reveal")) {
        gsap.from(subtitle, {
          scrollTrigger: { trigger: section, start: "top 80%" },
          y: 18,
          opacity: 0,
          duration: 0.65,
          delay: 0.08,
          ease: "power2.out",
        });
      }
    });

    // About tiles + visual
    gsap.from(".about-tile", {
      scrollTrigger: { trigger: ".about__visual", start: "top 80%" },
      y: 32,
      opacity: 0,
      scale: 0.96,
      duration: 0.65,
      stagger: 0.12,
      ease: "power3.out",
    });

    if (desktop()) {
      gsap.to(".about__visual", {
        scrollTrigger: { trigger: "#sobre", start: "top bottom", end: "bottom top", scrub: true },
        y: -36,
      });
    }

    // Service icons micro pop
    gsap.utils.toArray(".service-card .icon-badge").forEach((badge, i) => {
      gsap.from(badge, {
        scrollTrigger: { trigger: badge, start: "top 90%" },
        scale: 0.7,
        opacity: 0,
        duration: 0.5,
        delay: (i % 3) * 0.06,
        ease: "back.out(1.6)",
      });
    });

    // Clients strip fade
    gsap.from(".clients__label", {
      scrollTrigger: { trigger: ".clients", start: "top 90%" },
      opacity: 0,
      y: 12,
      duration: 0.5,
    });

    // Stats panel
    gsap.from(".stats__inner", {
      scrollTrigger: { trigger: ".stats", start: "top 78%" },
      y: 40,
      opacity: 0,
      scale: 0.98,
      duration: 0.8,
      ease: "power3.out",
    });

    // CTA
    gsap.from(".cta__box", {
      scrollTrigger: { trigger: ".cta", start: "top 80%" },
      y: 48,
      opacity: 0,
      scale: 0.97,
      duration: 0.85,
      ease: "power3.out",
    });

    // Footer soft fade
    gsap.from(".footer__grid > *", {
      scrollTrigger: { trigger: ".footer", start: "top 92%" },
      y: 24,
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power2.out",
    });

    // Tech core pulse when in view
    const techCore = document.querySelector(".tech-stage__core");
    if (techCore && anime) {
      ScrollTrigger.create({
        trigger: ".tech-stage",
        start: "top 75%",
        once: true,
        onEnter: () => {
          anime({
            targets: techCore,
            scale: [0.85, 1],
            opacity: [0, 1],
            duration: 700,
            easing: "easeOutElastic(1, .7)",
          });
        },
      });
    }

    // Badge cloud (mobile / fallback) stagger
    gsap.from(".tech__cloud .badge", {
      scrollTrigger: { trigger: ".tech__cloud", start: "top 88%" },
      y: 14,
      opacity: 0,
      scale: 0.92,
      duration: 0.4,
      stagger: { each: 0.03, from: "center" },
      ease: "power2.out",
    });

    // Process step numbers scale when active
    gsap.utils.toArray(".process-step__num").forEach((num) => {
      ScrollTrigger.create({
        trigger: num.closest(".process-step"),
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.fromTo(num, { scale: 0.85 }, { scale: 1, duration: 0.45, ease: "back.out(1.7)" });
        },
      });
    });

    // Commitment / testimonial icons
    if (anime) {
      document.querySelectorAll(".testimonial__avatar").forEach((av, i) => {
        ScrollTrigger.create({
          trigger: av,
          start: "top 92%",
          once: true,
          onEnter: () => {
            anime({
              targets: av,
              rotate: ["-8deg", "0deg"],
              scale: [0.85, 1],
              opacity: [0, 1],
              delay: i * 80,
              duration: 550,
              easing: "easeOutCubic",
            });
          },
        });
      });
    }

    window.initMagneticButtons();
    window.initTiltCards();
    window.initCursor();
  };
})();
