export function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobile = document.getElementById("mobile-menu");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };

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

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    mobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) setOpen(false);
    });
  }
}
