const form = document.querySelector("#quote-form");
const service = document.querySelector("#service");
const locationField = document.querySelector("#location");
const details = document.querySelector("#details");
const result = document.querySelector("#result");
const message = document.querySelector("#message");
const status = document.querySelector("#status");

function clearResult() {
  result.hidden = true;
  message.value = "";
  status.textContent = "";
}

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    service.value = link.dataset.service;
    clearResult();
  });
});

form.addEventListener("input", (event) => {
  if (event.target === message) return;
  event.target.setCustomValidity("");
  clearResult();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  for (const field of [locationField, details]) {
    field.setCustomValidity(field.value.trim() ? "" : "Preencha este campo.");
  }
  if (!form.reportValidity()) return;

  message.value = [
    "Olá, JM Jardinagem! Gostaria de pedir um orçamento.",
    "Serviço: " + service.value,
    "Cidade ou bairro: " + locationField.value.trim(),
    "Detalhes: " + details.value.trim(),
  ].join("\n");
  result.hidden = false;
  message.focus();
});

document.querySelector("#copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(message.value);
    status.textContent = "Pedido copiado.";
  } catch {
    message.focus();
    message.select();
    status.textContent = "Texto selecionado. Use a opção de copiar do seu dispositivo.";
  }
});
