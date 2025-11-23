/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/preline/preline.js', // <-- Ini bagian penting agar Preline terbaca
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('preline/plugin'), // <-- Ini mengaktifkan fitur Preline
  ],
}