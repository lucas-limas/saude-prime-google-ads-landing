const WHATSAPP_NUMBER = "5561995585240";
const form = document.getElementById("leadForm");
const steps = [...document.querySelectorAll(".step")];
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const progressBar = document.getElementById("progressBar");
const stepLabel = document.getElementById("stepLabel");
const progressPercent = document.getElementById("progressPercent");
const toast = document.getElementById("toast");
let currentStep = 1;

const params = new URLSearchParams(window.location.search);
const tracking = {
  utm_source: params.get("utm_source") || "",
  utm_medium: params.get("utm_medium") || "",
  utm_campaign: params.get("utm_campaign") || "",
  utm_term: params.get("utm_term") || "",
  utm_content: params.get("utm_content") || "",
  gclid: params.get("gclid") || ""
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

function track(eventName, params = {}) {
  if (typeof window.gtag === "function") window.gtag("event", eventName, params);
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({event: eventName, ...params});
  console.log("[tracking]", eventName, params);
}

function setChoice(button) {
  const name = button.dataset.name;
  document.querySelectorAll(`[data-name="${name}"]`).forEach(el => el.classList.remove("selected"));
  button.classList.add("selected");
  const input = form.querySelector(`[name="${name}"]`);
  if (input) input.value = button.dataset.value;
  track("lead_step_selection", {step: currentStep, field: name, value: button.dataset.value});
  setTimeout(() => {
    if (currentStep < steps.length) nextStep();
  }, 180);
}

document.querySelectorAll(".choice").forEach(button => {
  button.addEventListener("click", () => setChoice(button));
});

function validateCurrentStep() {
  const active = steps[currentStep - 1];
  const required = [...active.querySelectorAll("[required]")];
  for (const field of required) {
    if (field.type === "checkbox" && !field.checked) {
      showToast("Marque a autorização para continuar.");
      field.focus();
      return false;
    }
    if (!field.value) {
      showToast("Escolha uma opção para continuar.");
      return false;
    }
  }
  return true;
}

function renderStep() {
  steps.forEach((step, i) => step.classList.toggle("active", i === currentStep - 1));
  const percent = Math.round((currentStep / steps.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
  stepLabel.textContent = `Etapa ${currentStep} de ${steps.length}`;
  backBtn.disabled = currentStep === 1;
  nextBtn.style.display = currentStep === steps.length ? "none" : "block";
}

function nextStep() {
  if (!validateCurrentStep()) return;
  if (currentStep < steps.length) {
    currentStep++;
    renderStep();
    track("lead_step_view", {step: currentStep});
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    renderStep();
  }
}

nextBtn.addEventListener("click", nextStep);
backBtn.addEventListener("click", previousStep);

function cleanPhone(value) {
  return value.replace(/\D/g, "");
}

function createMessage(data) {
  return [
    "Olá! Vim pelo site da Saúde Prime e gostaria de cotar o plano de saúde MedSênior.",
    "",
    `Nome: ${data.nome}`,
    `Perfil: ${data.perfil}`,
    `Faixa etária: ${data.idade}`,
    `Prioridade: ${data.prioridade}`,
    `Cidade/região: ${data.cidade}`,
    "",
    "Origem da campanha:",
    `utm_source=${tracking.utm_source || "direto"}`,
    `utm_campaign=${tracking.utm_campaign || "não informado"}`,
    `utm_term=${tracking.utm_term || "não informado"}`
  ].join("\n");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;

  const data = Object.fromEntries(new FormData(form).entries());
  const phone = cleanPhone(data.telefone);

  if (phone.length < 10 || phone.length > 13) {
    showToast("Confira o número do WhatsApp.");
    document.getElementById("telefone").focus();
    return;
  }

  track("generate_lead", {
    method: "whatsapp",
    campaign: tracking.utm_campaign,
    source: tracking.utm_source
  });

  // Se usar conversão offline/importação no Google Ads, envie também tracking.gclid ao seu CRM.
  const message = encodeURIComponent(createMessage(data));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  showToast("Abrindo seu atendimento no WhatsApp…");
});

document.getElementById("telefone").addEventListener("input", (event) => {
  let value = cleanPhone(event.target.value).slice(0, 11);
  if (value.length > 6) value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
  else if (value.length > 2) value = `(${value.slice(0,2)}) ${value.slice(2)}`;
  event.target.value = value;
});

document.querySelectorAll('a[href="#simulador"]').forEach(link => {
  link.addEventListener("click", () => track("cta_click", {location: link.closest("section")?.className || "unknown"}));
});

track("landing_view", {
  source: tracking.utm_source || "direct",
  campaign: tracking.utm_campaign || "none"
});

renderStep();
