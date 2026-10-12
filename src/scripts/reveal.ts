import { prefersReducedMotion } from './ui-state';

/* Apariciones al hacer scroll.
   .reveal: aparece con fundido; los hermanos (mismo parentElement) se escalonan con --stagger.
   [data-play]: dispara una animación propia una sola vez (línea de pasos, diagrama CAE). */
export function setupReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal, [data-play]');
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    const siblings = Array.from(el.parentElement?.children ?? []).filter((n) => n.classList.contains('reveal'));
    el.style.setProperty('--stagger', String(Math.min(siblings.indexOf(el), 4)));
  });
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  items.forEach((el) => observer.observe(el));
}
