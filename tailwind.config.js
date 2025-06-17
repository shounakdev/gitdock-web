/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    colors: {
      neon: {
        pink: '#ff00ff',
        blue: '#00ffff',
      },
    },
  },
},