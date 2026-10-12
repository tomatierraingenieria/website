/* Punto de entrada único (BaseLayout lo carga como <script> de Astro: módulo diferido,
   el DOM ya existe). Mismo orden de arranque que la landing original. */
import { setupYear } from './year';
import { setupStickyCta } from './sticky-cta';
import { setupMenu } from './menu';
import { setupEnergyLabel } from './energy-label';
import { setupReveal } from './reveal';
import { setupServiceLinks, setupForm } from './quote-form';

setupYear();
setupStickyCta();
setupMenu();
setupEnergyLabel();
setupReveal();
setupServiceLinks();
setupForm();
