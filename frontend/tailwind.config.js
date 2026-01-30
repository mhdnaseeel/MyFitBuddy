/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED', // Electric Purple (Core Brand)
        secondary: '#C084FC', // Light Purple (Accents)
        dark: '#1F2937', // Dark Gray (Text)
        light: '#F3F4F6', // Light Gray (Backgrounds)
        success: '#10B981', // Emerald Green
        warning: '#EF4444', // Red
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}
