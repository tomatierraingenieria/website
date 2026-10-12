/* Año del pie: Footer.astro lo pinta en build; esto lo corrige si la build se queda vieja. */
export function setupYear(): void {
  document.querySelectorAll<HTMLElement>('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}
