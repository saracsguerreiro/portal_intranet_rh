/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tis: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#c3d1ff',
          300: '#9cb1ff',
          400: '#7088ff',
          500: '#4c62f8',
          600: '#3a47ed',
          700: '#2e37d2',
          800: '#2830aa',
          900: '#262e86',
          950: '#181c50',
        },
      },
    },
  },
  plugins: [],
}

