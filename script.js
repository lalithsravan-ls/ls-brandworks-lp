document.documentElement.classList.add("js");

const header = document.querySelector("[data-site-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const year = document.querySelector("[data-year]");
const mobileNavigation = window.matchMedia("(max-width: 700px)");

function setMenu(open) {
  if (!navToggle || !navMenu) return;

  navToggle.setAttribute("aria-expanded", String(open));
  navMenu.classList.toggle("is-open", open);

  const label = navToggle.querySelector(".sr-only");
  if (label) label.textContent = open ? "Close navigation" : "Open navigation";
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) setMenu(false);
  });

  document.addEventListener("click", (event) => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (!isOpen || !mobileNavigation.matches) return;
    if (event.target instanceof Node && !header?.contains(event.target)) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      navToggle.focus();
    }
  });

  mobileNavigation.addEventListener("change", (event) => {
    if (!event.matches) setMenu(false);
  });
}

function updateHeader() {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealNodes = [...document.querySelectorAll("[data-reveal]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!("IntersectionObserver" in window) || reducedMotion.matches) {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8%" },
  );

  revealNodes.forEach((node) => observer.observe(node));
}

if (year) year.textContent = String(new Date().getFullYear());

const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)");

document.querySelectorAll(".faq-item").forEach((item) => {
  const summary = item.querySelector("summary");
  let pinnedOpen = false;

  item.addEventListener("pointerenter", (event) => {
    if (hoverCapable.matches && event.pointerType === "mouse") item.open = true;
  });

  item.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && !pinnedOpen) item.open = false;
  });

  summary?.addEventListener("click", (event) => {
    event.preventDefault();
    pinnedOpen = !pinnedOpen;
    item.open = pinnedOpen;
  });
});
