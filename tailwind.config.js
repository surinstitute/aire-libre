/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bird-blue': '#5eb3c7',
        'bird-dark': '#2c5761',
      },
    },
  },
  plugins: [],
}