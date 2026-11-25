/**
 * ==============================================================================
 * PORTAFOLIO PERSONAL - LÓGICA DE CONTACTO (js/contact.js)
 * Cargado exclusivamente en contact.html.
 * Funcionalidades:
 * 1. Copiar dirección de correo al portapapeles con confirmación visual.
 * 2. Validación de campos del formulario en tiempo real / previo al envío.
 * 3. Envío directo sin backend vía cliente de correo (mailto:) o WhatsApp (wa.me).
 * ==============================================================================
 */

// CONFIGURACIÓN OFICIAL - MARÍA JOSÉ ZÚÑIGA ALVAREZ
const CONTACT_CONFIG = {
  email: "Mariajosezuniga10@outlook.com",
  phoneInternational: "593963311940", // Guayaquil, Ecuador (+593 963311940)
  fullName: "María José Zúñiga Alvarez"
};

document.addEventListener("DOMContentLoaded", () => {
  initCopyEmailButton();
  initContactForm();
});

/**
 * 1. Funcionalidad: Copiar Correo al Portapapeles
 */
function initCopyEmailButton() {
  const copyBtn = document.getElementById("copy-email-btn");
  if (!copyBtn) return;

  const originalText = copyBtn.textContent;

  copyBtn.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(CONTACT_CONFIG.email);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = CONTACT_CONFIG.email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      // Feedback visual temporal
      copyBtn.textContent = "¡Correo copiado!";
      copyBtn.classList.add("btn-primary");
      copyBtn.classList.remove("btn-outline");

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove("btn-primary");
        copyBtn.classList.add("btn-outline");
      }, 2500);
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
      showFeedback("No se pudo copiar automáticamente. Correo: " + CONTACT_CONFIG.email, "error");
    }
  });
}

/**
 * 2. Funcionalidad: Formulario de Contacto (Validación y Envíos)
 */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const sendWhatsAppBtn = document.getElementById("send-whatsapp-btn");

  if (!form) return;

  // Acción 1: Envío por Correo (Evento Submit del formulario)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = getFormData();
    const validation = validateFormData(data);

    if (!validation.isValid) {
      showFeedback(validation.message, "error");
      return;
    }

    // Construcción del enlace mailto:
    const mailSubject = encodeURIComponent(`[Contacto Portafolio] ${data.subject} - De: ${data.name}`);
    const mailBody = encodeURIComponent(
      `Estimada ${CONTACT_CONFIG.fullName},\n\n` +
      `Has recibido una nueva consulta desde tu Portafolio Web:\n\n` +
      `• Remitente: ${data.name}\n` +
      `• Correo electrónico: ${data.email}\n` +
      `• Asunto: ${data.subject}\n\n` +
      `Mensaje:\n${data.message}\n`
    );

    const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${mailSubject}&body=${mailBody}`;

    showFeedback("¡Validación exitosa! Abriendo tu aplicación de correo para enviar...", "success");
    window.location.href = mailtoUrl;
  });

  // Acción 2: Envío por WhatsApp (Clic en botón específico)
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener("click", () => {
      const data = getFormData();
      const validation = validateFormData(data);

      if (!validation.isValid) {
        showFeedback(validation.message, "error");
        return;
      }

      // Construcción del mensaje formateado para WhatsApp
      const waText = encodeURIComponent(
        `*¡Hola María José! Te contacto desde tu Portafolio Web*\n\n` +
        `👤 *Nombre:* ${data.name}\n` +
        `📧 *Correo:* ${data.email}\n` +
        `📌 *Asunto:* ${data.subject}\n\n` +
        `💬 *Mensaje:*\n${data.message}`
      );

      const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.phoneInternational}?text=${waText}`;

      showFeedback("¡Validación exitosa! Abriendo WhatsApp en una nueva pestaña...", "success");
      window.open(whatsappUrl, "_blank");
    });
  }
}

/**
 * Obtiene los valores limpios de cada campo del formulario
 */
function getFormData() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  return {
    name: nameInput ? nameInput.value.trim() : "",
    email: emailInput ? emailInput.value.trim() : "",
    subject: subjectInput ? subjectInput.value.trim() : "",
    message: messageInput ? messageInput.value.trim() : "",
  };
}

/**
 * Valida que los datos sean coherentes y no contengan campos vacíos
 */
function validateFormData(data) {
  if (!data.name) {
    return { isValid: false, message: "Por favor, ingresa tu nombre completo." };
  }

  if (!data.email) {
    return { isValid: false, message: "Por favor, ingresa tu dirección de correo electrónico." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { isValid: false, message: "El formato de correo electrónico no es válido." };
  }

  if (!data.subject) {
    return { isValid: false, message: "Por favor, especifica el asunto de tu mensaje." };
  }

  if (!data.message) {
    return { isValid: false, message: "Por favor, redacta el contenido de tu mensaje." };
  }

  if (data.message.length < 10) {
    return { isValid: false, message: "El mensaje debe contener al menos 10 caracteres." };
  }

  return { isValid: true, message: "" };
}

/**
 * Muestra alertas visuales de éxito o error en el contenedor #form-feedback
 */
function showFeedback(message, type) {
  const feedback = document.getElementById("form-feedback");
  if (!feedback) return;

  feedback.textContent = message;
  feedback.className = `form-feedback ${type}`;
  feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
