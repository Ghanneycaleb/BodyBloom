/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector', // This enables dark mode based on .dark class on html element
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'oklch(96.2% 0.018 272.314)',
          100: 'oklch(93% 0.034 272.788)',
          200: 'oklch(87% 0.065 274.039)',
          300: 'oklch(78.5% 0.115 274.713)',
          400: 'oklch(67.3% 0.182 276.935)',
          500: 'oklch(58.5% 0.233 277.117)',
          600: 'oklch(51.1% 0.262 276.966)',
          700: 'oklch(45.7% 0.24 277.023)',
          800: 'oklch(39.8% 0.195 277.366)',
          900: 'oklch(35.9% 0.144 278.697)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}