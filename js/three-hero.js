/**
 * Hero — Three.js particle field
 * Soft connected points with mouse parallax. Never competes with content.
 */
(function () {
  const reduceMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => window.innerWidth < 768;

  function brandColor() {
    return 0x2ea8e6;
  }

  function inkColor() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? 0xd8d8d4
      : 0x2a2a2a;
  }

  window.initThreeHero = function initThreeHero() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas || !window.THREE || reduceMotion()) return;

    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.25 : 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0.15, 0.05, 8.2);

    const count = isMobile() ? 55 : 140;
    const positions = new Float32Array(count * 3);
    const seeds = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.28) * 11;
      const y = (Math.random() - 0.5) * 6.5;
      const z = (Math.random() - 0.5) * 5.5;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      seeds.push({
        ox: x,
        oy: y,
        oz: z,
        speed: 0.12 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        amp: 0.06 + Math.random() * 0.1,
      });
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: brandColor(),
      size: isMobile() ? 0.028 : 0.022,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    const maxLinks = isMobile() ? 70 : 180;
    const linePos = new Float32Array(maxLinks * 6);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    const lMat = new THREE.LineBasicMaterial({
      color: inkColor(),
      transparent: true,
      opacity: 0.09,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lGeo, lMat);
    scene.add(lines);

    // Extremely subtle depth ring — almost invisible
    const ringGeo = new THREE.TorusGeometry(2.1, 0.006, 8, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: brandColor(),
      transparent: true,
      opacity: 0.12,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.48;
    ring.position.set(2.1, 0.05, -0.4);
    scene.add(ring);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent.clientWidth;
      const h = parent.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    new MutationObserver(() => {
      lMat.color.setHex(inkColor());
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let t = 0;
    let frame = 0;
    let visible = true;
    let scrollFactor = 1;

    new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0.02 }
    ).observe(canvas.closest(".hero") || canvas);

    if (window.ScrollTrigger) {
      window.ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          scrollFactor = 1 - self.progress * 0.65;
        },
      });
    }

    window.__heroParticles = {
      setMouseBoost(nx, ny) {
        mouse.tx = nx;
        mouse.ty = ny;
      },
    };

    const tick = () => {
      requestAnimationFrame(tick);
      if (!visible) return;
      frame++;
      t += 0.008 * Math.max(scrollFactor, 0.25);
      mouse.x += (mouse.tx - mouse.x) * 0.035;
      mouse.y += (mouse.ty - mouse.y) * 0.035;

      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const s = seeds[i];
        pos[i * 3] = s.ox + Math.sin(t * s.speed + s.phase) * s.amp;
        pos[i * 3 + 1] = s.oy + Math.cos(t * s.speed * 0.85 + s.phase) * s.amp * 0.9;
        pos[i * 3 + 2] = s.oz + Math.sin(t * 0.35 + s.phase) * s.amp * 0.7;
      }
      pGeo.attributes.position.needsUpdate = true;

      if (frame % 2 === 0) {
        let ptr = 0;
        const limit = isMobile() ? 1.05 : 1.18;
        const limit2 = limit * limit;
        for (let i = 0; i < count && ptr < maxLinks; i++) {
          for (let j = i + 1; j < count && ptr < maxLinks; j++) {
            const dx = pos[i * 3] - pos[j * 3];
            const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
            const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
            if (dx * dx + dy * dy + dz * dz < limit2) {
              const p = ptr * 6;
              linePos[p] = pos[i * 3];
              linePos[p + 1] = pos[i * 3 + 1];
              linePos[p + 2] = pos[i * 3 + 2];
              linePos[p + 3] = pos[j * 3];
              linePos[p + 4] = pos[j * 3 + 1];
              linePos[p + 5] = pos[j * 3 + 2];
              ptr++;
            }
          }
        }
        lGeo.setDrawRange(0, ptr * 2);
        lGeo.attributes.position.needsUpdate = true;
      }

      ring.rotation.z = t * 0.18;
      ring.position.x = 2.1 + mouse.x * 0.25;

      points.rotation.y = mouse.x * 0.1;
      points.rotation.x = mouse.y * 0.06;
      lines.rotation.copy(points.rotation);

      camera.position.x += (0.15 + mouse.x * 0.55 - camera.position.x) * 0.035;
      camera.position.y += (0.05 + mouse.y * 0.28 - camera.position.y) * 0.035;
      camera.lookAt(1.4, 0, 0);

      pMat.opacity = 0.55 * Math.max(scrollFactor, 0.3);
      lMat.opacity = 0.09 * Math.max(scrollFactor, 0.3);

      renderer.render(scene, camera);
    };
    tick();
  };
})();
