/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/components/auth/**/*.{js,jsx,ts,tsx}',
    './src/components/onboarding/**/*.{js,jsx,ts,tsx}',
    './src/screens/Onboarding/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0a',
          1: '#111114',
          2: '#16161a',
          elev: '#202026',
        },
        ink: {
          DEFAULT: '#fafafa',
          dim: '#9a9a9e',
          mute: '#5a5a5e',
          faint: '#2f2f33',
        },
        orange: {
          DEFAULT: '#ff6b3d',
          dark: '#d94d20',
        },
        green: '#4ade80',
        sol: '#9945ff',
        line: 'rgba(255,255,255,0.06)',
        line2: 'rgba(255,255,255,0.10)',
      },
      borderRadius: {
        btn: '15px',
        card: '16px',
        cardSm: '13px',
      },
      fontFamily: {
        sans: ['Geist_400Regular'],
        'sans-medium': ['Geist_500Medium'],
        'sans-semibold': ['Geist_600SemiBold'],
        'sans-bold': ['Geist_700Bold'],
        mono: ['GeistMono_400Regular'],
        'mono-medium': ['GeistMono_500Medium'],
        'mono-semibold': ['GeistMono_600SemiBold'],
      },
    },
  },
  plugins: [],
};
