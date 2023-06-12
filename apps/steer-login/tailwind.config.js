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
        background: {
          primary: '#0E1015',
          secondary: '#989AA0',
        },
        content: {
          primary: '#E3E4E8',
          secondary: '#989AA0',
          inverse: '#0E1015',
        }
      }
    },
  },
  plugins: [],
}
