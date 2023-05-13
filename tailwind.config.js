/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{svelte, html, js}',
  ],
  theme: {
    
    extend: {
      colors: {
        'grey': 'D9D9D9',
        'light_blue': 'B8E8FC',
      },
    },
  },
  darkMode: "class",
  plugins: [require("tw-elements/dist/plugin.cjs")]
}

