/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // --------------------------------------------------------------
      // COLOR SYSTEM
      // Two brand colors only: "ink" (deep navy — authority, gravitas)
      // and "bronze" (muted gold — used sparingly as the single accent).
      // Every desk, badge, and highlight across the app draws from
      // this same pair. No per-category rainbow coding.
      // --------------------------------------------------------------
      colors: {
        ink: {
          50:  '#f4f6f8',
          100: '#e5e9ed',
          200: '#c9d1da',
          300: '#a3b0bd',
          400: '#76889a',
          500: '#566a7d',
          600: '#445465',
          700: '#384553',
          800: '#232c37', // primary heading / nav surface
          900: '#141a22', // near-black navy, deepest surface
          950: '#0b0e13',
        },
        bronze: {
          50:  '#faf6ee',
          100: '#f1e6cd',
          200: '#e2cb9c',
          300: '#d2ab68',
          400: '#c2924a', // accent — hover states, active tab underline
          500: '#a97a38', // primary accent — CTAs, links, dividers
          600: '#8a6130',
          700: '#6c4b28',
          800: '#523a22',
          900: '#3c2b1b',
        },
        paper: '#faf9f6', // warm off-white background, not pure #fff
      },

      // --------------------------------------------------------------
      // TYPOGRAPHY
      // Serif for headings/editorial voice, sans for UI/body copy.
      // --------------------------------------------------------------
      fontFamily: {
        serif: ['"Playfair Display"', '"Iowan Old Style"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
        'headline': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },

      // --------------------------------------------------------------
      // LAYOUT
      // --------------------------------------------------------------
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 26, 34, 0.06), 0 8px 24px -12px rgba(20, 26, 34, 0.12)',
      },
      borderColor: {
        DEFAULT: '#e5e9ed',
      },
    },
  },
  plugins: [],
};
