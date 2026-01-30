/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF', // Pure White
        secondary: '#F2F4F7', // Light Gray
        action: '#4238B7', // Electric Purple
        success: '#10B981', // Emerald Green
        warning: '#EF4444', // Crimson Red
        functional: '#BCC3DA', // Blue-Gray
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
