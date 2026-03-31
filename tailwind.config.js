/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Override the teal palette with CSS variables so every teal-* class
        // responds to the freshwater/saltwater mode switch automatically.
        teal: {
          50:  'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          300: 'var(--color-accent-300)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent)',
          700: 'var(--color-accent-dark)',
        },
      },
    },
  },
  plugins: [],
}
