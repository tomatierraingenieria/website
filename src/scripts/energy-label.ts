import { prefersReducedMotion } from './ui-state';

/* Etiqueta energética: el indicador baja de G a A y se queda en A. */
export function setupEnergyLabel(): void {
  const pointer = document.querySelector<HTMLElement>('[data-energy-pointer]');
  const letter = pointer?.querySelector<HTMLElement>('[data-energy-letter]');
  if (!pointer || !letter) return;

  const levels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const show = (row: number): void => {
    pointer.style.setProperty('--row', String(row));
    letter.textContent = levels[row];
  };

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    show(0);
    return;
  }

  show(6);
  let row = 6;
  const run = (): void => {
    const timer = window.setInterval(() => {
      row -= 1;
      show(row);
      if (row === 0) {
        window.clearInterval(timer);
        pointer.classList.add('is-done');
      }
    }, 340);
  };

  // Arranca cuando la etiqueta está a la vista y no queda bajo la barra fija (80 px)
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      window.setTimeout(run, 400);
    },
    { threshold: 0.4, rootMargin: '0px 0px -80px 0px' },
  );
  observer.observe(pointer.closest('figcaption') ?? pointer);
}
