/** Mirrors the web app's tailwind.config.ts brand palette so the mobile UI
 * matches the site and the mockup exactly. Brand + category colors stay
 * fixed across themes; surface/ink/highlight invert for dark mode. */

export interface Colors {
  brand: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  surface: {
    default: string;
    warm: string;
    muted: string;
  };
  ink: {
    default: string;
    soft: string;
    faint: string;
  };
  danger: string;
  categoryDot: {
    worship: string;
    teaching: string;
    prayer: string;
    talk: string;
    special: string;
  };
  /** Tinted background used to call out the "live now" row/card — a fixed
   * brand[50]/brand[200] pair reads as a near-white block in dark mode, so
   * this gets its own per-theme values instead of reusing the brand scale. */
  liveHighlight: {
    bg: string;
    border: string;
  };
}

const brand: Colors['brand'] = {
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
};

const categoryDot: Colors['categoryDot'] = {
  worship: '#a855f7',
  teaching: '#3b82f6',
  prayer: '#f59e0b',
  talk: '#14b8a6',
  special: '#ec4899',
};

export const lightColors: Colors = {
  brand,
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
  categoryDot,
  liveHighlight: {
    bg: brand[50],
    border: brand[200],
  },
};

export const darkColors: Colors = {
  brand,
  surface: {
    default: '#1a1f1c',
    warm: '#141815',
    muted: '#242b26',
  },
  ink: {
    default: '#f2f4f1',
    soft: '#c2c9c3',
    faint: '#8b948e',
  },
  danger: '#f87171',
  categoryDot,
  liveHighlight: {
    bg: '#16321c',
    border: brand[700],
  },
};

/** @deprecated Use `useTheme().colors` so screens react to the active
 * theme. Kept only for any leftover static imports. */
export const colors = lightColors;
