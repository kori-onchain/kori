/**
 * Kori Design System — tokens.
 * Mirrors the tailwind.config.js theme.extend spec so the DS stays portable
 * if/when NativeWind is wired up later. Use these instead of magic literals.
 */

export const THEMES = {
  dark: {
    bg: "#0a0a0a",
    bg2: "#16161a",
    bgElev: "#202026",
    artBg: "#0e0e11",
    ink: "#fafafa",
    inkDim: "#9a9a9e",
    inkMute: "#5a5a5e",
    inkFaint: "#2f2f33",
    orange: "#ff6b3d",
    orangeDark: "#d94d20",
    green: "#4ade80",
    sol: "#9945ff",
    line: "rgba(255,255,255,0.06)",
    line2: "rgba(255,255,255,0.10)",
    glossy: ["#1e1e23", "#16161a"],
    hairline: "rgba(255,255,255,0.06)",
    cardBorder: "rgba(255,255,255,0.05)",
    cardElev: 4,
    cardElevStrong: 8,
    bnavBg: "rgba(10,10,10,0.92)",
    btnPrimaryBg: "#fafafa",
    btnPrimaryFg: "#0a0a0a",
    statusBar: "light-content",
  },
  light: {
    bg: "#f3f3f6",
    bg2: "#ffffff",
    bgElev: "#ffffff",
    artBg: "#eeeef1",
    ink: "#0a0a0a",
    inkDim: "#5e5e64",
    inkMute: "#9a9aa0",
    inkFaint: "#c4c4c8",
    orange: "#e85a2c",
    orangeDark: "#c4471d",
    green: "#16a34a",
    sol: "#9945ff",
    line: "rgba(0,0,0,0.07)",
    line2: "rgba(0,0,0,0.10)",
    glossy: ["#ffffff", "#f8f8fa"],
    hairline: "rgba(255,255,255,0.9)",
    cardBorder: "rgba(0,0,0,0.06)",
    cardElev: 3,
    cardElevStrong: 6,
    bnavBg: "rgba(255,255,255,0.92)",
    btnPrimaryBg: "#0a0a0a",
    btnPrimaryFg: "#fafafa",
    statusBar: "dark-content",
  },
} as const;

export type ThemeScheme = keyof typeof THEMES;
export type ThemeTokens = (typeof THEMES)[ThemeScheme];

export const colors = THEMES.dark;

export const radii = {
  pill: 999,
  btn: 15,
  card: 16,
  cardSm: 13,
} as const;

export const fonts = {
  sans: {
    regular: "Geist_400Regular",
    medium: "Geist_500Medium",
    semibold: "Geist_600SemiBold",
    bold: "Geist_700Bold",
  },
  mono: {
    regular: "GeistMono_400Regular",
    medium: "GeistMono_500Medium",
    semibold: "GeistMono_600SemiBold",
  },
} as const;

export const elevation = {
  card: 4,
  pill: 2,
  navIndicator: 6,
} as const;
