/** Iconos disponibles en el sprite (IconSprite.astro): cada nombre corresponde a un <symbol id="i-…">. */
export const iconNames = [
  'shield',
  'pin',
  'file-check',
  'mail',
  'home',
  'factory',
  'plug',
  'chat',
  'clipboard',
  'trend',
  'user',
  'rain',
  'leaf',
  'tool',
  'zap',
  'badge',
  'euro',
  'sparkle',
  'pen',
  'clock',
] as const;

export type IconName = (typeof iconNames)[number];
