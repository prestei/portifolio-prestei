/**
 * Vite entry — libs locais (sem CDN) + boot da aplicação
 * Globals são definidos ANTES de carregar os módulos do app (imports estáticos
 * de ./main.js rodariam cedo demais e o Lucide não renderizaria ícones).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import anime from "animejs";
import { animate, stagger, inView, scroll } from "motion";
import { createIcons } from "lucide";
import {
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Brain,
  Cable,
  ClipboardList,
  Cloud,
  Code2,
  Database,
  Gauge,
  Github,
  GitBranch,
  Globe,
  Headset,
  Instagram,
  KeyRound,
  Layers,
  LayoutTemplate,
  LineChart,
  Linkedin,
  Link2,
  Mail,
  Menu,
  MessageCircle,
  MessagesSquare,
  Monitor,
  Moon,
  Palette,
  PanelsTopLeft,
  PenTool,
  RefreshCw,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Sun,
  TrendingUp,
  Waypoints,
  Workflow,
  Wrench,
  X,
} from "lucide";

gsap.registerPlugin(ScrollTrigger);

const icons = {
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Brain,
  Cable,
  ClipboardList,
  Cloud,
  Code2,
  Database,
  Gauge,
  Github,
  GitBranch,
  Globe,
  Headset,
  Instagram,
  KeyRound,
  Layers,
  LayoutTemplate,
  LineChart,
  Linkedin,
  Link2,
  Mail,
  Menu,
  MessageCircle,
  MessagesSquare,
  Monitor,
  Moon,
  Palette,
  PanelsTopLeft,
  PenTool,
  RefreshCw,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Sun,
  TrendingUp,
  Waypoints,
  Workflow,
  Wrench,
  X,
};

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.anime = anime;
window.Motion = { animate, stagger, inView, scroll };
window.lucide = {
  createIcons: (opts) => createIcons({ icons, ...(opts || {}) }),
};
window.dispatchEvent(new CustomEvent("motion:ready"));

async function boot() {
  await import("./data.js");
  await import("./hero-experience.js");
  await import("./showcase.js");
  await import("./motion.js");
  await import("./main.js");

  if (typeof window.initPresteiApp === "function") {
    window.initPresteiApp();
  }

  // Three.js sob demanda — não bloqueia a primeira pintura
  const THREE = await import("three");
  window.THREE = THREE;
  await import("./three-hero.js");
  if (document.body.dataset.hero3d === "pending" && window.initThreeHero) {
    window.initThreeHero();
    if (window.initShowcaseBg) window.initShowcaseBg();
    document.body.dataset.hero3d = "ready";
  }
}

boot().catch((err) => console.error("[Prestei] boot failed", err));
