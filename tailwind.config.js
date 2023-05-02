/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  content: [
    './src/**/*.{svelte, html, js}',
  ],
  theme: {
    colors: {
      'grey': 'D9D9D9',
    },
    extend: {},
  },
  plugins: [],
}

