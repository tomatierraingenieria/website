import { stickyState, updateStickyCta } from './ui-state';

/* Barra inferior móvil: observa el CTA del hero y el formulario. */
export function setupStickyCta(): void {
  const heroCta = document.querySelector<HTMLElement>('#inicio .btn-primary');
  const form = document.querySelector<HTMLElement>('#presupuesto');
  if (!heroCta || !form || !('IntersectionObserver' in window)) {
    // Sin observer no sabemos dónde está el usuario: la barra se queda visible
    stickyState.heroCtaVisible = false;
    updateStickyCta();
    return;
  }

  updateStickyCta();
  new IntersectionObserver(([entry]) => {
    stickyState.heroCtaVisible = entry.isIntersecting;
    updateStickyCta();
  }).observe(heroCta);

  new IntersectionObserver(
    ([entry]) => {
      stickyState.formVisible = entry.isIntersecting;
      updateStickyCta();
    },
    { threshold: 0.15 },
  ).observe(form);
}
