const header = document.querySelector(".header");
const menu = document.querySelector("#menu");
const toggle = document.querySelector(".menu-toggle");
const mobile = matchMedia("(max-width: 700px)");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("is-open", open);
}

header.classList.add("menu-ready");
toggle.hidden = false;
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
menu.addEventListener("click", (event) => {
  if (mobile.matches && event.target.closest("a")) setMenu(false);
});
header.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});
mobile.addEventListener("change", () => setMenu(false));

const motion = matchMedia("(prefers-reduced-motion: reduce)");
const heroImage = document.querySelector(".hero-image");
let frame = 0;

function updateParallax() {
  frame = 0;
  heroImage.style.setProperty("--parallax", Math.min(window.scrollY * 0.1, 48) + "px");
}

function scheduleParallax() {
  if (!frame && !motion.matches && !mobile.matches) frame = requestAnimationFrame(updateParallax);
}

window.addEventListener("scroll", scheduleParallax, { passive: true });
scheduleParallax();

if (!motion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      target.classList.remove("waiting");
      target.classList.add("revealed");
      observer.unobserve(target);
    }
  }, { threshold: 0.08 });

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    if (element.getBoundingClientRect().top < innerHeight) return;
    element.classList.add("waiting");
    observer.observe(element);
  });
}
