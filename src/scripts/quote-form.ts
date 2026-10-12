/* Formulario de presupuesto: validación con mensaje por campo y envío por mailto
   mientras no haya backend (ver el comentario de QuoteForm.astro para Formspree). */
const EMAIL = 'hola@tomatierraingenieria.com';

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const MESSAGES: Record<string, { missing: string; invalid?: string }> = {
  nombre: { missing: 'Escribe tu nombre para saber a quién responder.' },
  email: {
    missing: 'Escribe tu email: ahí te enviamos el presupuesto.',
    invalid: 'Revisa el email: falta la @ o el dominio (p. ej. nombre@correo.com).',
  },
  municipio: { missing: 'Indica el municipio del inmueble.' },
  servicio: { missing: 'Elige el servicio que necesitas.' },
  mensaje: { missing: 'Cuéntanos en una frase qué necesitas.' },
  rgpd: { missing: 'Necesitamos tu permiso para usar estos datos y responderte.' },
};

function errorFor(field: Field): HTMLElement | null {
  return document.getElementById(`${field.id}-error`);
}

function clearError(field: Field): void {
  field.removeAttribute('aria-invalid');
  const error = errorFor(field);
  if (error) error.textContent = '';
}

function validateField(field: Field): boolean {
  if (field.validity.valid) {
    clearError(field);
    return true;
  }
  const texts = MESSAGES[field.name];
  const message = field.validity.valueMissing ? texts?.missing : (texts?.invalid ?? texts?.missing);
  field.setAttribute('aria-invalid', 'true');
  const error = errorFor(field);
  if (error) error.textContent = message ?? 'Revisa este campo.';
  return false;
}

/* Preselección de servicio (CTA de la sección CAE con data-service) */
export function setupServiceLinks(): void {
  const select = document.querySelector<HTMLSelectElement>('#servicio');
  if (!select) return;
  document.querySelectorAll<HTMLAnchorElement>('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      select.value = link.dataset.service ?? '';
      clearError(select);
    });
  });
}

export function setupForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
  const status = document.querySelector<HTMLElement>('[data-form-status]');
  const copyButton = document.querySelector<HTMLButtonElement>('[data-copy-request]');
  const copyStatus = document.querySelector<HTMLElement>('[data-copy-status]');
  if (!form || !status) return;

  const fields = Array.from(form.querySelectorAll<Field>('[required]'));
  let request = '';

  // Corrige el error en cuanto el campo pasa a ser válido
  fields.forEach((field) => {
    const recheck = (): void => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    };
    field.addEventListener('input', recheck);
    field.addEventListener('change', recheck);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = fields.filter((field) => !validateField(field));
    if (invalid.length > 0) {
      status.textContent =
        invalid.length === 1
          ? 'Falta 1 campo por completar. Revísalo para poder enviar la solicitud.'
          : `Faltan ${invalid.length} campos por completar. Revísalos para poder enviar la solicitud.`;
      invalid[0].focus();
      return;
    }

    const data = new FormData(form);
    const value = (key: string): string => String(data.get(key) ?? '').trim();
    const select = form.querySelector<HTMLSelectElement>('#servicio');
    const serviceLabel = select?.selectedOptions[0]?.textContent?.trim() ?? value('servicio');

    const subject = `Presupuesto · ${serviceLabel} · ${value('municipio')}`;
    const body = [
      `Nombre: ${value('nombre')}`,
      `Email: ${value('email')}`,
      `Teléfono: ${value('telefono') || '—'}`,
      `Servicio: ${serviceLabel}`,
      `Municipio: ${value('municipio')}`,
      '',
      value('mensaje'),
    ].join('\n');
    request = `Asunto: ${subject}\n\n${body}`;

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // No sabemos si el correo se abrió: lo decimos tal cual y damos alternativas
    const link = document.createElement('a');
    link.className = 'link-light';
    link.href = `mailto:${EMAIL}`;
    link.textContent = EMAIL;
    status.replaceChildren(
      'Hemos intentado abrir tu correo con la solicitud preparada. Si no se ha abierto tu correo, escríbenos a ',
      link,
      ' o copia la solicitud y pégala en tu mensaje.',
    );
    if (copyButton) copyButton.hidden = false;
    if (copyStatus) copyStatus.textContent = '';
  });

  copyButton?.addEventListener('click', async () => {
    if (!copyStatus) return;
    try {
      await navigator.clipboard.writeText(request);
      copyStatus.textContent = `Solicitud copiada. Pégala en un email a ${EMAIL}.`;
    } catch {
      copyStatus.textContent = `No hemos podido copiarla. Escribe tus datos en un email a ${EMAIL}.`;
    }
  });
}
