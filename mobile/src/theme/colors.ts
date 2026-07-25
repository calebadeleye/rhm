/** Mirrors the web app's tailwind.config.ts brand palette so the mobile UI
 * matches the site and the mockup exactly. */
export const colors = {
  brand: {
    50: '#f0faf1',
    100: '#dcf3de',
    200: '#b9e6bd',
    300: '#8bd394',
    400: '#5bba68',
    500: '#3a9e48',
    600: '#2c8438',
    700: '#25682e',
    800: '#215329',
    900: '#1c4423',
    950: '#0c2510',
  },
  surface: {
    default: '#ffffff',
    warm: '#faf9f5',
    muted: '#f4f5f2',
  },
  ink: {
    default: '#1f2422',
    soft: '#4a524d',
    faint: '#767f79',
  },
  danger: '#dc2626',
  categoryDot: {
    worship: '#a855f7',
    teaching: '#3b82f6',
    prayer: '#f59e0b',
    talk: '#14b8a6',
    special: '#ec4899',
  },
} as const;
