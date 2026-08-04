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

  function renderProjects() {
    const root = document.querySelector("[data-showcase]");
    if (!root || !data.projects.length) return;

    root.innerHTML = data.projects
      .map((p, i) => {
        const reverse = i % 2 === 1 ? " showcase-item--reverse" : "";
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
              <img
                src="${p.image}"
                alt="${p.title}"
                loading="${i < 2 ? "eager" : "lazy"}"
                decoding="async"
                fetchpriority="${i === 0 ? "high" : "low"}"
                width="960"
                height="660"
              />
            </div>
          </div>
        </div>
        <div class="showcase-item__info">
          <span class="showcase-item__cat">${p.category}</span>
          <div class="showcase-item__meta-line" aria-hidden="true"></div>
          <h3 class="showcase-item__title">${p.title}</h3>
          <p class="showcase-item__desc">${p.description}</p>
          ${
            p.url
              ? `<a class="btn btn--primary btn--sm" href="${p.url}" target="_blank" rel="noopener noreferrer">${
                  p.cta || "Ver projeto"
                }</a>`
              : ""
          }
        </div>
      </article>`;
      })
      .join("");
  }

  function renderSkills() {
    const cloud = document.querySelector("[data-skills]");
    const stage = document.querySelector("[data-tech-stage]");
    const stack = data.stack;
    const skills = data.skills || [];

    if (cloud) {
      const midItems = stack?.mid?.map((t) => t.name) || [];
      const cloudItems = midItems.length ? midItems : skills;
      cloud.innerHTML = cloudItems
        .map((s) => `<span class="badge"><span class="badge__dot"></span>${s}</span>`)
        .join("");
    }

    if (!stage || !stack) return;

    const glyphs = {
      React: "Re",
      "Next.js": "Nx",
      Laravel: "La",
      "Node.js": "No",
      TypeScript: "TS",
      PHP: "Ph",
      Python: "Py",
      Git: "Git",
      Angular: "Ng",
      MongoDB: "Mo",
      MySQL: "My",
      CSS3: "Cs",
      HTML5: "Ht",
      JavaScript: "JS",
    };

    const placeOrbit = (items, orbitName) => {
      const n = items.length || 1;
      const sats = items
        .map((item, i) => {
          const angle = (360 / n) * i - 90;
          const glyph = glyphs[item.name] || item.name.slice(0, 2);
          return `
          <div class="tech-sat" style="--a:${angle}deg">
            <button
              type="button"
              class="tech-chip"
              data-tech="${item.name}"
              aria-label="${item.name}: ${item.tip}"
            >
              <span class="tech-chip__face">
                <span class="tech-chip__body">
                  <span class="tech-chip__glyph" aria-hidden="true">${glyph}</span>
                  <span class="tech-chip__label">${item.name}</span>
                </span>
                <span class="tech-chip__tip" role="tooltip">${item.tip}</span>
              </span>
            </button>
          </div>`;
        })
        .join("");

      return `
        <div class="tech-orbit tech-orbit--${orbitName}" data-orbit="${orbitName}">
          <div class="tech-orbit__spin">
            <div class="tech-orbit__ring" aria-hidden="true"></div>
            <span class="tech-orbit__pulse" aria-hidden="true"></span>
            <span class="tech-orbit__pulse tech-orbit__pulse--b" aria-hidden="true"></span>
            ${sats}
          </div>
        </div>`;
    };

    stage.innerHTML = `
      <div class="tech-stage__glow" aria-hidden="true"></div>
      ${placeOrbit(stack.outer, "outer")}
      ${placeOrbit(stack.mid, "mid")}
      ${placeOrbit(stack.inner, "inner")}
      <div class="tech-stage__core" aria-hidden="true">Prestei</div>
    `;
  }

  function renderCnpj() {
    document.querySelectorAll("[data-cnpj]").forEach((el) => {
      el.textContent = `CNPJ ${data.cnpj}`;
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

  function renderCapabilities() {
    const track = document.querySelector("[data-marquee-track]");
    if (!track || !data.capabilities?.length) return;

    const makeItem = (item, key) => `
      <span class="marquee__item" data-marquee-item data-id="${item.id}" data-key="${key}">
        <i data-lucide="${item.icon}" aria-hidden="true"></i>
        <span class="marquee__item-label">${item.name}</span>
      </span>`;

    // Two identical sets → seamless loop at xPercent -50
    const setA = data.capabilities.map((item, i) => makeItem(item, `a-${i}`)).join("");
    const setB = data.capabilities.map((item, i) => makeItem(item, `b-${i}`)).join("");
    track.innerHTML = setA + setB;
  }

  function bootApp() {
    renderCapabilities();
    renderServices();
    renderProjects();
    renderSkills();
    renderCnpj();
    waLinks();
    initNav();
    initAnchors();

    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });

    if (window.lucide) window.lucide.createIcons();

    requestAnimationFrame(() => {
      if (window.initHeroExperience) window.initHeroExperience();
      if (window.initMotion) window.initMotion();
      // Showcase motion ASAP — não esperar Three.js (evita spinner travado)
      if (window.initShowcaseMotion) window.initShowcaseMotion();

      const startHeavy = () => {
        if (window.initThreeHero) {
          window.initThreeHero();
          document.body.dataset.hero3d = "ready";
        }
        if (window.initShowcaseBg) window.initShowcaseBg();
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

  window.initPresteiApp = bootApp;
})();
