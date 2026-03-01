/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        army: {
          dark: '#1a2e1a',
          DEFAULT: '#2d4a2d',
          light: '#3d5c3d',
          accent: '#4a7c4a',
        },
        brown: {
          dark: '#2c2416',
          DEFAULT: '#4a3f2f',
          light: '#6b5b4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
