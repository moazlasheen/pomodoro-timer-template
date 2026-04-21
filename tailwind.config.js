/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        parchment: '#F0EBE3',
        sand: '#E6DFD3',
        terracotta: '#C4553A',
        'terracotta-dark': '#A8432C',
        'terracotta-light': '#E8886F',
        charcoal: '#2C2825',
        'warm-gray': '#6B6560',
        'soft-gray': '#9E9891',
        sage: '#7A8B6F',
        'sage-light': '#A3B396',
        ocean: '#4A7B8C',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
