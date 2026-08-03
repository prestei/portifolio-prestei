(function () {
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = () => window.matchMedia("(pointer: fine)").matches && window.innerWidth > 900;

  function brandHex() {
    return 0x2ea8e6;
  }

  window.initShowcaseBg = function initShowcaseBg() {
    const canvas = document.getElementById("showcase-canvas");
    if (!canvas || !window.THREE || reduce()) return;

    const THREE = window.THREE;
    const section = canvas.closest(".showcase");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 8;

    const count = window.innerWidth < 768 ? 50 : 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: brandHex(),
      size: 0.03,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const linePositions = [];
    const maxDist = 3.2;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < maxDist * maxDist) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: brandHex(),
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const resize = () => {
      const w = section.clientWidth;
      const h = section.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let visible = false;
    let scrollY = 0;
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    }, { threshold: 0.05 }).observe(section);

    if (window.ScrollTrigger) {
      window.ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          scrollY = self.progress;
        },
      });
    }

    const tick = () => {
      requestAnimationFrame(tick);
      if (!visible) return;
      points.rotation.y = scrollY * 0.6;
      points.rotation.x = scrollY * 0.25;
      points.position.y = scrollY * -1.5;
      lines.rotation.copy(points.rotation);
      lines.position.copy(points.position);
      renderer.render(scene, camera);
    };
    tick();
  };

  window.initShowcaseMotion = function initShowcaseMotion() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const anime = window.anime;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const items = document.querySelectorAll(".showcase-item");
    if (!items.length) return;
    if (document.documentElement.dataset.showcaseMotion === "1") {
      // Ainda assim, garantir loaders resolvidos se re-chamado
      items.forEach((item) => {
        const frame = item.querySelector(".tech-frame");
        const img = item.querySelector(".tech-frame__viewport img");
        if (frame && img && (img.complete || img.naturalWidth)) frame.classList.add("is-loaded");
      });
      return;
    }
    document.documentElement.dataset.showcaseMotion = "1";

    if (reduce()) {
      items.forEach((item) => {
        item.classList.add("is-inview");
        item.querySelector(".tech-frame")?.classList.add("is-revealed", "is-loaded");
        const img = item.querySelector("img");
        if (img) {
          img.style.opacity = "1";
          img.style.transform = "none";
        }
      });
      return;
    }

    items.forEach((item) => {
      const frame = item.querySelector(".tech-frame");
      const img = item.querySelector(".tech-frame__viewport img");
      const info = item.querySelector(".showcase-item__info");
      const path = item.querySelector(".tech-frame__path");
      const reverse = item.classList.contains("showcase-item--reverse");
      const parts = info?.querySelectorAll(
        ".showcase-item__cat, .showcase-item__title, .showcase-item__desc"
      );

      // Border draw with anime / gsap
      if (path) {
        const len = path.getTotalLength?.() || 1200;
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 78%",
          once: true,
          onEnter: () => item.classList.add("is-inview"),
        },
        defaults: { ease: "power3.out" },
      });

      tl.from(frame, {
        x: reverse ? 48 : -48,
        opacity: 0,
        scale: 0.96,
        duration: 0.85,
      });

      if (path) {
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: "power2.inOut",
          },
          "-=0.55"
        );
      }

      if (img) {
        gsap.set(img, { scale: 1.1, filter: "brightness(0.85)" });
        tl.to(
          img,
          {
            scale: 1,
            filter: "brightness(1)",
            duration: 0.9,
            ease: "power2.out",
            onStart: () => frame?.classList.add("is-revealed"),
          },
          "-=0.7"
        );
      }

      if (parts?.length) {
        const mobile = window.matchMedia("(max-width: 960px)").matches;
        tl.from(
          parts,
          {
            ...(mobile ? {} : { y: 18 }),
            opacity: 0,
            duration: 0.55,
            stagger: 0.08,
            immediateRender: false,
            clearProps: "transform",
          },
          "-=0.45"
        );
      }

      // Image load — never leave the spinner stuck
      if (img && frame) {
        let done = false;
        const markLoaded = () => {
          if (done) return;
          done = true;
          frame.classList.add("is-loaded");
        };

        img.addEventListener("load", markLoaded, { once: true });
        img.addEventListener("error", markLoaded, { once: true });

        if (img.complete && img.naturalWidth > 0) {
          markLoaded();
        } else if (typeof img.decode === "function") {
          img.decode().then(markLoaded).catch(() => {});
        }

        // Fallback curto — não segurar spinner por segundos
        window.setTimeout(markLoaded, 1200);
      }

      // Hover — Motion.dev spring or GSAP
      if (desktop() && frame && img) {
        frame.addEventListener("pointerenter", () => {
          frame.classList.add("is-active");
          const M = window.Motion;
          if (M?.animate) {
            M.animate(frame, { scale: 1.03 }, { type: "spring", stiffness: 280, damping: 22 });
            M.animate(img, { scale: 1.06 }, { type: "spring", stiffness: 220, damping: 20 });
          } else {
            gsap.to(frame, { scale: 1.03, duration: 0.45, ease: "power2.out" });
            gsap.to(img, { scale: 1.06, duration: 0.5, ease: "power2.out" });
          }
          if (anime) {
            anime.remove(frame.querySelectorAll(".tech-frame__corner"));
            anime({
              targets: frame.querySelectorAll(".tech-frame__corner"),
              scale: [1, 1.15, 1],
              duration: 600,
              easing: "easeOutQuad",
            });
          }
        });

        frame.addEventListener("pointerleave", () => {
          frame.classList.remove("is-active");
          const M = window.Motion;
          if (M?.animate) {
            M.animate(frame, { scale: 1 }, { type: "spring", stiffness: 300, damping: 24 });
            M.animate(img, { scale: 1 }, { type: "spring", stiffness: 260, damping: 22 });
          } else {
            gsap.to(frame, { scale: 1, duration: 0.4 });
            gsap.to(img, { scale: 1, duration: 0.45 });
          }
        });

        frame.addEventListener("pointermove", (e) => {
          const r = frame.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(frame, {
            rotateY: px * 5,
            rotateX: -py * 4,
            transformPerspective: 900,
            duration: 0.35,
            overwrite: true,
          });
        });

        frame.addEventListener("pointerleave", () => {
          gsap.to(frame, { rotateY: 0, rotateX: 0, duration: 0.5 });
        });
      }

      // Soft parallax on scroll
      if (desktop()) {
        gsap.to(frame, {
          y: reverse ? 40 : -40,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(info, {
          y: reverse ? -24 : 24,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });
  };
})();
