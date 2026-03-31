/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Override teal with CSS variables → every teal-* class responds to
        // the freshwater/saltwater mode switch with no component changes.
        teal: {
          50:  'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          300: 'var(--color-accent-300)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent)',
          700: 'var(--color-accent-dark)',
        },
        // Override gray with CSS variables → text colors, borders, and
        // backgrounds all flip to dark-navy equivalents in saltwater mode.
        gray: {
          50:  'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
      },
    },
  },
  plugins: [],
}
