/* Estado compartido entre el menú y la barra fija móvil.
   La barra solo se ve cuando el CTA del hero ha salido de pantalla, el formulario
   no está a la vista y el menú está cerrado. */
export const stickyState = { heroCtaVisible: true, formVisible: false, menuOpen: false };

export function updateStickyCta(): void {
  const bar = document.querySelector<HTMLElement>('[data-sticky-cta]');
  if (!bar) return;
  const hidden = stickyState.heroCtaVisible || stickyState.formVisible || stickyState.menuOpen;
  bar.dataset.hidden = String(hidden);
  bar.inert = hidden;
}

export const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
