/* ==========================================================================
   SOLUTIONS CONSULTING SCL - CONTACTO EJECUTIVO & BOTONES 1-CLIC
   Lógica interactiva rápida: vCard, Copiar al portapapeles, Código QR Real, WhatsApp Callback
   ========================================================================== */

// Official Contact Info
const SCL_CONTACT = {
  name: "Solutions Consulting",
  workPhone: "444 813 6987",
  workPhoneRaw: "+524448136987",
  homePhone: "444 688 7449",
  homePhoneRaw: "+524446887449",
  cellPhone: "444 130 5773",
  cellPhoneRaw: "+524441305773",
  email: "marketing2@solutionsconsultingslp.com",
  website: "https://www.solutionsconsultingslp.com",
  address: "Anahuac 414, 78250 San Luis Potosí San Luis Potosí, Mexico"
};

// 1. Download Official vCard (.vcf)
function downloadOfficialVCard() {
  const link = document.createElement("a");
  link.href = "assets/Solutions_Consulting.vcf";
  link.download = "Solutions_Consulting.vcf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("✓ Tarjeta Solutions Consulting descargada a tu agenda.");
}

// 2. Copy Text with Toast
function copyText(text, label, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`✓ ${label} copiado al portapapeles: ${text}`);
    }).catch(() => fallbackCopy(text, label));
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text, label) {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  showToast(`✓ ${label} copiado: ${text}`);
}

// 3. Toast Notifications
let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById("siteToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "siteToast";
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// 4. QR Code Modal & Real Generator
let qrCodeInstance = null;

function getCardTargetUrl() {
  // If running on a live website (GitHub Pages, custom domain, or local web server)
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    return window.location.href.split("#")[0];
  }
  // Fallback for file:// protocol
  return "https://www.solutionsconsultingslp.com";
}

function showQRModal() {
  const modal = document.getElementById("qrModal");
  const container = document.querySelector(".modal-qr-canvas-box");
  if (!modal || !container) return;

  container.innerHTML = ""; // Clear existing content

  const targetUrl = getCardTargetUrl();

  if (typeof QRCode !== "undefined") {
    qrCodeInstance = new QRCode(container, {
      text: targetUrl,
      width: 210,
      height: 210,
      colorDark: "#27160c",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    container.innerHTML = `<p style="color: #eeddcc; font-size: 0.85rem; padding: 20px;">${targetUrl}</p>`;
  }

  modal.classList.add("active");
}

function closeQRModal() {
  const modal = document.getElementById("qrModal");
  if (modal) modal.classList.remove("active");
}

function downloadQRImage() {
  const container = document.querySelector(".modal-qr-canvas-box");
  if (!container) return;

  const canvas = container.querySelector("canvas");
  const img = container.querySelector("img");
  let dataUrl = "";

  if (canvas) {
    dataUrl = canvas.toDataURL("image/png");
  } else if (img && img.src) {
    dataUrl = img.src;
  }

  if (!dataUrl) {
    showToast("⚠️ Generando imagen de código QR...");
    return;
  }

  const a = document.createElement("a");
  a.download = "QR_Oficial_Solutions_Consulting.png";
  a.href = dataUrl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("✓ Imagen de Código QR oficial descargada.");
}

// 5. Quick Callback Request (Envío directo sin requerir servidor backend)
function handleCallbackSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("callbackPhone");
  if (!input) return;

  const phone = input.value.replace(/[^0-9]/g, "").trim();
  if (phone.length !== 10) {
    showToast("⚠️ Ingresa un número válido a 10 dígitos (ej. 4441234567)");
    return;
  }

  const btn = e.target.querySelector("button");
  const origText = btn.innerHTML;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Conectando...`;
  btn.disabled = true;

  // Mensaje oficial hacia el WhatsApp corporativo (+52 444 130 5773)
  const message = `¡Hola Solutions Consulting! 👋 Solicito que un consultor se comunique conmigo al teléfono: ${phone}. Vi su tarjeta digital de contactos.`;
  const whatsappUrl = `https://wa.me/524441305773?text=${encodeURIComponent(message)}`;

  showToast(`Abriendo WhatsApp para solicitar llamada al ${phone}...`);

  setTimeout(() => {
    window.open(whatsappUrl, "_blank");
    btn.innerHTML = `<i class="fas fa-check"></i> ¡Listo!`;
    btn.style.background = "#10b981";
    input.value = "";

    setTimeout(() => {
      btn.innerHTML = origText;
      btn.style.background = "";
      btn.disabled = false;
    }, 3500);
  }, 600);
}

// Modal Click Out
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("qrModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeQRModal();
    });
  }
});

// Window bindings
window.downloadOfficialVCard = downloadOfficialVCard;
window.copyText = copyText;
window.showQRModal = showQRModal;
window.closeQRModal = closeQRModal;
window.downloadQRImage = downloadQRImage;
window.handleCallbackSubmit = handleCallbackSubmit;
window.showToast = showToast;
