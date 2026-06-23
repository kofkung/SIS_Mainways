const routes = new Set(["home", "about", "services", "careers", "contact"]);
const root = document.documentElement;
const body = document.body;
const header = document.querySelector("[data-header]");
const navPanel = document.querySelector("[data-nav-panel]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const transitionMs = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 360;

let currentRoute = "home";
let isRouting = false;
let ticking = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function routeFromHash() {
  const route = window.location.hash.replace("#", "").trim();
  return routes.has(route) ? route : "home";
}

function setTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "default";
  root.dataset.theme = nextTheme;
  localStorage.setItem("sis-theme", nextTheme);
  themeLabel.textContent = nextTheme === "dark" ? "Dark" : "Default";
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    nextTheme === "dark" ? "#06101e" : "#ffffff",
  );
}

function updateActiveNav(route) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === route);
  });
}

function closeMenu() {
  body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

function resetReveals(page) {
  page.querySelectorAll(".reveal").forEach((element) => {
    element.classList.remove("is-visible");
    revealObserver.observe(element);
  });
}

async function showRoute(route, options = {}) {
  if (!routes.has(route)) {
    route = "home";
  }

  const targetPage = document.querySelector(`[data-page="${route}"]`);
  const activePage = document.querySelector(".page.is-active");

  closeMenu();

  if (!targetPage || isRouting) {
    return;
  }

  if (route === currentRoute) {
    updateActiveNav(route);
    scrollToFocusedSection(options.focusSection);
    return;
  }

  isRouting = true;
  body.classList.add("is-transitioning");

  await delay(transitionMs * 0.72);

  activePage?.classList.remove("is-active");
  activePage?.setAttribute("hidden", "");
  targetPage.removeAttribute("hidden");
  targetPage.classList.add("is-active");
  currentRoute = route;
  updateActiveNav(route);
  resetReveals(targetPage);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  updateScrollEffects();

  if (options.focusSection) {
    await delay(80);
    scrollToFocusedSection(options.focusSection);
  }

  await delay(transitionMs);
  body.classList.remove("is-transitioning");
  isRouting = false;
}

function scrollToFocusedSection(sectionId) {
  if (!sectionId) {
    return;
  }

  const section = document.getElementById(sectionId);
  section?.scrollIntoView({ behavior: transitionMs ? "smooth" : "auto", block: "start" });
}

function handleRouteClick(event) {
  const target = event.target.closest("[data-route]");
  if (!target) {
    return;
  }

  const route = target.dataset.route;
  if (!routes.has(route)) {
    return;
  }

  event.preventDefault();
  const focusSection = target.dataset.focusSection;
  const nextHash = `#${route}`;

  if (window.location.hash !== nextHash) {
    history.pushState(null, "", nextHash);
  }

  showRoute(route, { focusSection });
}

function updateScrollEffects() {
  const y = window.scrollY;
  header?.classList.toggle("is-compact", y > 18);

  document.querySelectorAll(".page.is-active .zoom-media").forEach((element) => {
    const rect = element.getBoundingClientRect();
    const viewport = window.innerHeight || 1;

    if (element.classList.contains("hero-media")) {
      const progress = clamp(y / viewport, 0, 1);
      element.style.setProperty("--zoom", (1.06 + progress * 0.13).toFixed(3));
      element.style.setProperty("--shift", `${(progress * 54).toFixed(1)}px`);
      return;
    }

    const centerDistance = Math.abs(rect.top + rect.height / 2 - viewport / 2);
    const visibility = 1 - clamp(centerDistance / viewport, 0, 1);
    element.style.setProperty("--zoom", (1 + visibility * 0.045).toFixed(3));
  });
}

function requestScrollTick() {
  if (ticking) {
    return;
  }

  ticking = true;
  requestAnimationFrame(() => {
    updateScrollEffects();
    ticking = false;
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12,
  },
);

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "รับข้อมูลเรียบร้อยแล้ว กรุณาเชื่อมต่อระบบส่งอีเมลหรือ backend ในขั้นตอน production";
    form.reset();
  });
}

function setupInteractions() {
  document.addEventListener("click", handleRouteClick);

  menuToggle?.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "default" : "dark");
  });

  document.querySelector("[data-scroll-next]")?.addEventListener("click", () => {
    document.querySelector('[data-section="home-services"]')?.scrollIntoView({
      behavior: transitionMs ? "smooth" : "auto",
      block: "start",
    });
  });

  window.addEventListener("scroll", requestScrollTick, { passive: true });
  window.addEventListener("resize", requestScrollTick);
  window.addEventListener("popstate", () => showRoute(routeFromHash()));
  window.addEventListener("hashchange", () => showRoute(routeFromHash()));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function boot() {
  setTheme(localStorage.getItem("sis-theme") || "default");
  setupInteractions();
  setupContactForm();

  currentRoute = routeFromHash();
  document.querySelectorAll(".page").forEach((page) => {
    const isActive = page.dataset.page === currentRoute;
    page.classList.toggle("is-active", isActive);
    page.toggleAttribute("hidden", !isActive);
  });
  updateActiveNav(currentRoute);
  resetReveals(document.querySelector(`[data-page="${currentRoute}"]`));
  updateScrollEffects();
}

boot();
