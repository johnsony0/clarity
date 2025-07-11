import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  safelist: [
    'text-gray-800',
    'bg-gray-300',
    'opacity-50',
    'text-blue-600',
    'bg-yellow-500',
    'bg-red-600',
    'accent-blue-500',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        font: 'var(--font-color)',
        bg: 'var(--bg-color)',
        heading: 'var(--heading-color)',
      },
      fontSize: {
        base: 'var(--font-size)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
} as Omit<Config, 'content'>;
