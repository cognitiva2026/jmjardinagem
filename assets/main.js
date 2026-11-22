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

const comparison = document.querySelector(".comparison");
const comparisonRange = comparison.querySelector("input");
comparisonRange.hidden = false;
comparisonRange.addEventListener("input", () => {
  comparison.style.setProperty("--position", comparisonRange.value + "%");
});

const lightbox = document.querySelector(".gallery-dialog");
const lightboxImage = lightbox.querySelector("img");

if (typeof lightbox.showModal === "function") {
  document.querySelectorAll("[data-gallery-image]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      lightboxImage.src = link.href;
      lightboxImage.alt = link.querySelector("img").alt;
      lightbox.showModal();
    });
  });
  lightbox.querySelector("button").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}

function trackConversion(event, location) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, cta_location: location });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-whatsapp]");
  if (link) trackConversion("whatsapp_click", link.dataset.whatsapp);
});

const quoteForm = document.querySelector("#quote-form");
const quotePhone = quoteForm.elements.phone;

quoteForm.noValidate = true;
quoteForm.querySelector("button").disabled = false;

function formatPhone(value) {
  let digits = value.replace(/\D/g, "");
  if ((digits.length > 11 || value.trim().startsWith("+55")) && digits.startsWith("55")) {
    digits = digits.slice(2);
  }
  digits = digits.slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return "(" + digits;
  const local = digits.slice(2);
  const prefixLength = local.length > 8 ? 5 : 4;
  const prefix = local.slice(0, prefixLength);
  const suffix = local.slice(prefixLength);
  return "(" + digits.slice(0, 2) + ") " + prefix + (suffix ? "-" + suffix : "");
}

function showFieldError(field, message) {
  const error = document.getElementById(field.getAttribute("aria-describedby"));
  error.textContent = message;
  error.hidden = !message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
}

quoteForm.addEventListener("input", (event) => {
  const field = event.target;
  if (field === quotePhone) {
    const start = field.selectionStart;
    const previous = field.value;
    const formatted = formatPhone(previous);
    if (previous !== formatted) {
      const digitsAhead = previous.slice(start).replace(/\D/g, "").length;
      field.value = formatted;
      let caret = formatted.length;
      for (let remaining = digitsAhead; caret > 0 && remaining > 0; caret--) {
        if (/\d/.test(formatted[caret - 1])) remaining--;
      }
      field.setSelectionRange(caret, caret);
    }
  }
  showFieldError(field, "");
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const { name, phone, service, location } = quoteForm.elements;
  phone.value = formatPhone(phone.value);
  const fields = [
    [name, name.value.trim(), "Informe seu nome."],
    [phone, phone.validity.valid, "Informe um telefone brasileiro com DDD."],
    [service, service.value, "Selecione um serviço."],
    [location, location.value.trim(), "Informe seu bairro ou cidade."],
  ];
  for (const [field, valid, message] of fields) showFieldError(field, valid ? "" : message);
  const firstError = quoteForm.querySelector('[aria-invalid="true"]');
  if (firstError) {
    firstError.focus();
    return;
  }

  const message = [
    "Olá! Gostaria de solicitar um orçamento.",
    "",
    "Nome: " + name.value.trim(),
    "WhatsApp: " + phone.value,
    "Serviço desejado: " + service.value,
    "Localização: " + location.value.trim(),
    "",
    "Aguardo o retorno. Obrigado!",
  ].join("\n");
  trackConversion("quote_request", "formulario");
  window.location.assign("https://wa.me/5561994283830?text=" + encodeURIComponent(message));
});

const reviews = [];
const reviewFacts = [];
const reviewCredentials = [];
const reviewSection = document.querySelector("#avaliacoes");
const reviewTrack = reviewSection.querySelector("[data-review-track]");

function appendText(parent, tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  parent.append(element);
  return element;
}

function appendReviewImage(parent, image) {
  const element = document.createElement("img");
  element.src = image.src;
  element.alt = image.alt;
  element.loading = "lazy";
  parent.append(element);
}

if (reviews.length) {
  let index = 0;

  function renderReview() {
    const { name, service, rating, quote, portrait, photos = [] } = reviews[index];
    reviewTrack.replaceChildren();
    const card = document.createElement("article");
    if (portrait) appendReviewImage(card, portrait);
    appendText(card, "h3", name);
    appendText(card, "p", service);
    const stars = appendText(card, "p", "★".repeat(rating) + "☆".repeat(5 - rating));
    stars.setAttribute("aria-label", rating + " de 5 estrelas");
    appendText(card, "blockquote", quote);
    photos.forEach((photo) => appendReviewImage(card, photo));
    reviewTrack.append(card);
  }

  renderReview();
  const controls = reviewSection.querySelector(".review-controls");
  controls.hidden = reviews.length < 2;
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-review-direction]");
    if (!button) return;
    index = (index + Number(button.dataset.reviewDirection) + reviews.length) % reviews.length;
    renderReview();
  });
}

const facts = reviewSection.querySelector(".review-facts");
for (const { label, value } of reviewFacts) {
  appendText(facts, "dt", label);
  appendText(facts, "dd", value);
}
facts.hidden = !reviewFacts.length;
const credentials = reviewSection.querySelector(".review-credentials");
reviewCredentials.forEach((name) => appendText(credentials, "li", name));
credentials.hidden = !reviewCredentials.length;
reviewSection.hidden = !reviews.length && !reviewFacts.length && !reviewCredentials.length;
document.querySelectorAll("[data-review-link]").forEach((link) => {
  link.hidden = reviewSection.hidden;
});
