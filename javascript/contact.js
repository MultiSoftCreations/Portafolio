import { db, collection, addDoc, serverTimestamp } from "./firebase.js";

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("form-submit");
const medioSelect = form?.elements?.medio;
const phoneWrap = document.getElementById("phone-wrap");
const emailField = form?.elements?.email;

function setStatus(msg, type) {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.className = "form-status " + (type || "");
  statusEl.hidden = !msg;
}

function syncMedio() {
  if (!medioSelect || !phoneWrap) return;
  const v = medioSelect.value;
  phoneWrap.hidden = v !== "whatsapp";
  const phone = form.elements.telefono;
  if (phone) phone.required = v === "whatsapp";
  if (emailField) {
    emailField.required = v === "email" || v === "whatsapp";
  }
}

if (medioSelect) {
  medioSelect.addEventListener("change", syncMedio);
  syncMedio();
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");

    const nombre = (form.nombre.value || "").trim();
    const email = (form.email.value || "").trim();
    const telefono = (form.telefono?.value || "").trim();
    const medio = (form.medio.value || "").trim();
    const motivo = (form.motivo.value || "").trim();
    const mensaje = (form.mensaje.value || "").trim();
    const consentimiento = form.consentimiento?.checked;

    if (!nombre || nombre.length > 100) {
      setStatus("Nombre inválido.", "error");
      return;
    }
    if (!mensaje || mensaje.length < 10 || mensaje.length > 4000) {
      setStatus("Mensaje entre 10 y 4000 caracteres.", "error");
      return;
    }
    if (medio === "whatsapp") {
      const digits = telefono.replace(/\D/g, "");
      if (digits.length < 10) {
        setStatus("Indica un número de WhatsApp válido (con lada, mín. 10 dígitos).", "error");
        return;
      }
    }
    if ((medio === "email" || medio === "whatsapp") && email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus("Correo no válido.", "error");
        return;
      }
    }
    if (medio === "email" && !email) {
      setStatus("Indica un correo para responderte.", "error");
      return;
    }
    if (!consentimiento) {
      setStatus("Debes aceptar el aviso de privacidad.", "error");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando…";
    }

    try {
      await addDoc(collection(db, "solicitudes"), {
        nombre,
        email: email || null,
        telefono: telefono || null,
        medio: medio || "no indicado",
        motivo: motivo || "consulta",
        mensaje,
        createdAt: serverTimestamp(),
        leido: false,
        likes: 0,
        respuestas: [],
      });
      form.reset();
      syncMedio();
      setStatus("Mensaje enviado. Gracias, te responderé pronto.", "ok");
    } catch (err) {
      console.error(err);
      setStatus("No se pudo enviar. Prueba por WhatsApp: +52 56 2494 4382", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensaje";
      }
    }
  });
}
