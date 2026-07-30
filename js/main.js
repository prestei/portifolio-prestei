(function () {
  const data = window.PRESTEI_DATA;
  if (!data) return;

  const waBase = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(data.whatsappMessage)}`;

  function waLinks() {
    document.querySelectorAll("[data-whatsapp]").forEach((el) => {
      el.setAttribute("href", waBase);
    });
  }

  function renderServices() {
    const grid = document.querySelector("[data-services]");
    if (!grid) return;
    grid.innerHTML = data.services
      .map(
        (s) => `
      <article class="card service-card">
        <div class="icon-badge icon-badge--lg"><i data-lucide="${s.icon}"></i></div>
        <div class="service-card__body">
          <h3>${s.title}</h3>
          <p>${s.description}</p>
        </div>
        <a class="btn btn--soft btn--sm" data-whatsapp data-magnetic target="_blank" rel="noopener noreferrer">
          Saiba mais <i data-lucide="arrow-up-right"></i>
        </a>
      </article>`
      )
      .join("");
  }

  function projectWa(title) {
    const msg = `Olá! Vim através do site da Prestei e gostaria de saber mais sobre o projeto "${title}".`;
    return `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  function renderProjects() {
    const root = document.querySelector("[data-showcase]");
    if (!root || !data.projects.length) return;

    const pad = (n) => String(n).padStart(2, "0");
    const total = data.projects.length;

    root.innerHTML = data.projects
      .map((p, i) => {
        const reverse = i % 2 === 1 ? " showcase-item--reverse" : "";
        const tech = p.tech.map((t) => `<span>${t}</span>`).join("");
        return `
      <article class="showcase-item${reverse}" data-showcase-item>
        <div class="showcase-item__media">
          <div class="tech-frame">
            <span class="tech-frame__corner tech-frame__corner--tl" aria-hidden="true"></span>
            <span class="tech-frame__corner tech-frame__corner--tr" aria-hidden="true"></span>
            <span class="tech-frame__corner tech-frame__corner--bl" aria-hidden="true"></span>
            <span class="tech-frame__corner tech-frame__corner--br" aria-hidden="true"></span>
            <div class="tech-frame__ticks" aria-hidden="true">
              <span></span><span></span><span></span><span></span>
            </div>
            <svg class="tech-frame__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path class="tech-frame__path" d="M 3,3 H 97 V 97 H 3 Z" />
              <path class="tech-frame__glow-path" d="M 3,3 H 97 V 97 H 3 Z" />
            </svg>
            <div class="tech-frame__viewport">
              <div class="tech-frame__loader" aria-hidden="true"><span></span></div>
              <img src="${p.image}" alt="${p.title}" loading="eager" decoding="async" width="960" height="660" />
            </div>
          </div>
        </div>
        <div class="showcase-item__info">
          <span class="showcase-item__index">${pad(i + 1)} — ${pad(total)}</span>
          <span class="showcase-item__cat">${p.category}</span>
          <div class="showcase-item__meta-line" aria-hidden="true"></div>
          <h3 class="showcase-item__title">${p.title}</h3>
          <p class="showcase-item__desc">${p.description}</p>
          <div class="showcase-item__tech">${tech}</div>
          <a class="btn btn--primary" href="${projectWa(p.title)}" target="_blank" rel="noopener noreferrer" data-magnetic>
            Ver Projeto <i data-lucide="arrow-up-right"></i>
          </a>
        </div>
      </article>`;
      })
      .join("");
  }

  function renderSkills() {
    const cloud = document.querySelector("[data-skills]");
    const stage = document.querySelector("[data-tech-stage]");
    if (cloud) {
      cloud.innerHTML = data.skills
        .map((s) => `<span class="badge"><span class="badge__dot"></span>${s}</span>`)
        .join("");
    }
    if (!stage) return;

    const half = Math.ceil(data.skills.length / 2);
    const outer = data.skills.slice(0, half);
    const inner = data.skills.slice(half);

    const place = (items, radiusPx) =>
      items
        .map((label, i) => {
          const angle = (360 / items.length) * i;
          return `<div class="tech-sat" style="--a:${angle}deg; --r:${radiusPx}px"><span class="tech-chip">${label}</span></div>`;
        })
        .join("");

    stage.innerHTML = `
      <div class="tech-stage__ring tech-stage__ring--1" aria-hidden="true"></div>
      <div class="tech-stage__ring tech-stage__ring--2" aria-hidden="true"></div>
      <div class="tech-stage__core">Prestei</div>
      <div class="tech-orbit tech-orbit--reverse">${place(inner, 118)}</div>
      <div class="tech-orbit">${place(outer, 178)}</div>
    `;
  }

  function renderCnpj() {
    document.querySelectorAll("[data-cnpj]").forEach((el) => {
      el.textContent = `CNPJ ${data.cnpj}`;
    });
  }

  function initTheme() {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cur = document.documentElement.getAttribute("data-theme") || "light";
        const next = cur === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("prestei-theme", next);
      });
    });
  }

  function initNav() {
    const nav = document.getElementById("nav");
    const toggle = document.querySelector("[data-nav-toggle]");
    const mobile = document.getElementById("mobile-menu");
    const onScroll = () => nav?.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && mobile) {
      const setOpen = (open) => {
        mobile.hidden = !open;
        mobile.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
        if (window.lucide) {
          toggle.innerHTML = open
            ? '<i data-lucide="x" aria-hidden="true"></i>'
            : '<i data-lucide="menu" aria-hidden="true"></i>';
          window.lucide.createIcons({ nodes: [toggle] });
        }
      };
      toggle.addEventListener("click", () =>
        setOpen(toggle.getAttribute("aria-expanded") !== "true")
      );
      mobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    }
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const target = id && document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 72,
          behavior: "smooth",
        });
      });
    });
  }

  function bootApp() {
    renderServices();
    renderProjects();
    renderSkills();
    renderCnpj();
    waLinks();
    initTheme();
    initNav();
    initAnchors();

    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });

    if (window.lucide) window.lucide.createIcons();
    // Hero text first; Three.js / showcase when lib ready
    requestAnimationFrame(() => {
      if (window.initHeroExperience) window.initHeroExperience();
      if (window.initMotion) window.initMotion();

      const startHeavy = () => {
        if (window.initThreeHero) {
          window.initThreeHero();
          document.body.dataset.hero3d = "ready";
        }
        if (window.initShowcaseBg) window.initShowcaseBg();
        if (window.initShowcaseMotion) window.initShowcaseMotion();
      };

      if (window.initThreeHero && window.THREE) {
        requestAnimationFrame(startHeavy);
      } else {
        document.body.dataset.hero3d = "pending";
        const wait = setInterval(() => {
          if (!window.THREE || !window.initThreeHero) return;
          clearInterval(wait);
          startHeavy();
        }, 40);
        setTimeout(() => clearInterval(wait), 8000);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootApp);
  } else {
    bootApp();
  }
})();
