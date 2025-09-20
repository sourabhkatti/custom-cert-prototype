/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chainguard-dark': '#1C0C3E',
        'chainguard-darker': '#110033',
        'chainguard-teal': '#7AF0FE',
        'chainguard-text-secondary': 'rgba(255, 255, 255, 0.7)',
      },
      fontFamily: {
        'bw-fusiona': ['Bw_Fusiona', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'space-mono': ['Space_Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}