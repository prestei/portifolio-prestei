(function(){const s=window.PRESTEI_DATA;if(!s)return;const l=`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(s.whatsappMessage)}`;function h(){document.querySelectorAll("[data-whatsapp]").forEach(t=>{t.setAttribute("href",l)})}function p(){const t=document.querySelector("[data-services]");t&&(t.innerHTML=s.services.map(e=>`
      <article class="card service-card">
        <div class="icon-badge icon-badge--lg"><i data-lucide="${e.icon}"></i></div>
        <div class="service-card__body">
          <h3>${e.title}</h3>
          <p>${e.description}</p>
        </div>
        <a class="btn btn--soft btn--sm" data-whatsapp data-magnetic target="_blank" rel="noopener noreferrer">
          Saiba mais <i data-lucide="arrow-up-right"></i>
        </a>
      </article>`).join(""))}function u(){const t=document.querySelector("[data-showcase]");!t||!s.projects.length||(t.innerHTML=s.projects.map((e,a)=>`
      <article class="showcase-item${a%2===1?" showcase-item--reverse":""}" data-showcase-item>
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
                src="${e.image}"
                alt="${e.title}"
                loading="${a<2?"eager":"lazy"}"
                decoding="async"
                fetchpriority="${a===0?"high":"low"}"
                width="960"
                height="660"
              />
            </div>
          </div>
        </div>
        <div class="showcase-item__info">
          <span class="showcase-item__cat">${e.category}</span>
          <div class="showcase-item__meta-line" aria-hidden="true"></div>
          <h3 class="showcase-item__title">${e.title}</h3>
          <p class="showcase-item__desc">${e.description}</p>
        </div>
      </article>`).join(""))}function m(){const t=document.querySelector("[data-skills]"),e=document.querySelector("[data-tech-stage]"),a=s.stack,r=s.skills||[];if(t){const i=a?.mid?.map(c=>c.name)||[],d=i.length?i:r;t.innerHTML=d.map(c=>`<span class="badge"><span class="badge__dot"></span>${c}</span>`).join("")}if(!e||!a)return;const n=(i,d)=>{const c=i.length||1,b=i.map((o,$)=>`
          <div class="tech-sat" style="--a:${360/c*$-90}deg">
            <button
              type="button"
              class="tech-chip"
              data-tech="${o.name}"
              aria-label="${o.name}: ${o.tip}"
            >
              <span class="tech-chip__face">
                <span class="tech-chip__body">
                  <span class="tech-chip__label">${o.name}</span>
                </span>
                <span class="tech-chip__tip" role="tooltip">${o.tip}</span>
              </span>
            </button>
          </div>`).join("");return`
        <div class="tech-orbit tech-orbit--${d}" data-orbit="${d}">
          <div class="tech-orbit__spin">
            <div class="tech-orbit__ring" aria-hidden="true"></div>
            <span class="tech-orbit__pulse" aria-hidden="true"></span>
            <span class="tech-orbit__pulse tech-orbit__pulse--b" aria-hidden="true"></span>
            ${b}
          </div>
        </div>`};e.innerHTML=`
      <div class="tech-stage__glow" aria-hidden="true"></div>
      ${n(a.outer,"outer")}
      ${n(a.mid,"mid")}
      ${n(a.inner,"inner")}
      <div class="tech-stage__core" aria-hidden="true">Prestei</div>
    `}function w(){document.querySelectorAll("[data-cnpj]").forEach(t=>{t.textContent=`CNPJ ${s.cnpj}`})}function _(){const t=document.getElementById("nav"),e=document.querySelector("[data-nav-toggle]"),a=document.getElementById("mobile-menu"),r=()=>t?.classList.toggle("is-scrolled",window.scrollY>8);if(r(),window.addEventListener("scroll",r,{passive:!0}),e&&a){const n=i=>{a.hidden=!i,a.classList.toggle("is-open",i),e.setAttribute("aria-expanded",String(i)),document.body.style.overflow=i?"hidden":"",window.lucide&&(e.innerHTML=i?'<i data-lucide="x" aria-hidden="true"></i>':'<i data-lucide="menu" aria-hidden="true"></i>',window.lucide.createIcons({nodes:[e]}))};e.addEventListener("click",()=>n(e.getAttribute("aria-expanded")!=="true")),a.querySelectorAll("a").forEach(i=>i.addEventListener("click",()=>n(!1)))}}function v(){document.querySelectorAll('a[href^="#"]').forEach(t=>{t.addEventListener("click",e=>{const a=t.getAttribute("href"),r=a&&document.querySelector(a);r&&(e.preventDefault(),window.scrollTo({top:r.getBoundingClientRect().top+window.scrollY-72,behavior:"smooth"}))})})}function f(){const t=document.querySelector("[data-marquee-track]");if(!t||!s.capabilities?.length)return;const e=(n,i)=>`
      <span class="marquee__item" data-marquee-item data-id="${n.id}" data-key="${i}">
        <i data-lucide="${n.icon}" aria-hidden="true"></i>
        <span class="marquee__item-label">${n.name}</span>
      </span>`,a=s.capabilities.map((n,i)=>e(n,`a-${i}`)).join(""),r=s.capabilities.map((n,i)=>e(n,`b-${i}`)).join("");t.innerHTML=a+r}function g(){f(),p(),u(),m(),w(),h(),_(),v(),document.querySelectorAll("[data-year]").forEach(t=>{t.textContent=String(new Date().getFullYear())}),window.lucide&&window.lucide.createIcons(),requestAnimationFrame(()=>{window.initHeroExperience&&window.initHeroExperience(),window.initMotion&&window.initMotion(),window.initShowcaseMotion&&window.initShowcaseMotion();const t=()=>{window.initThreeHero&&(window.initThreeHero(),document.body.dataset.hero3d="ready"),window.initShowcaseBg&&window.initShowcaseBg()};if(window.initThreeHero&&window.THREE)requestAnimationFrame(t);else{document.body.dataset.hero3d="pending";const e=setInterval(()=>{!window.THREE||!window.initThreeHero||(clearInterval(e),t())},40);setTimeout(()=>clearInterval(e),8e3)}})}window.initPresteiApp=g})();
