/**
 * Kora Design System — tokens.
 * Mirrors the tailwind.config.js theme.extend spec so the DS stays portable
 * if/when NativeWind is wired up later. Use these instead of magic literals.
 */

export const colors = {
  bg: '#0a0a0a',
  bg2: '#16161a',
  bgElev: '#202026',
  artBg: '#0e0e11',

  ink: '#fafafa',
  inkDim: '#9a9a9e',
  inkMute: '#5a5a5e',
  inkFaint: '#2f2f33',

  orange: '#ff6b3d',
  orangeDark: '#d94d20',

  green: '#4ade80',
  sol: '#9945ff',

  line: 'rgba(255,255,255,0.06)',
  line2: 'rgba(255,255,255,0.10)',

  // SoftCard gradient stops
  softTop: '#1e1e23',
  softBottom: '#16161a',
} as const;

export const radii = {
  pill: 999,
  btn: 15,
  card: 16,
  cardSm: 13,
} as const;

export const fonts = {
  sans: {
    regular: 'Geist_400Regular',
    medium: 'Geist_500Medium',
    semibold: 'Geist_600SemiBold',
    bold: 'Geist_700Bold',
  },
  mono: {
    regular: 'GeistMono_400Regular',
    medium: 'GeistMono_500Medium',
    semibold: 'GeistMono_600SemiBold',
  },
} as const;

export const elevation = {
  card: 4,
  pill: 2,
  navIndicator: 6,
} as const;
