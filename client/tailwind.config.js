/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7e0',
          100: '#fdebb1',
          200: '#fbd980',
          300: '#f9c74f',
          400: '#f7b51e',
          500: '#e69c00',
          600: '#b37a00',
          700: '#805800',
          800: '#4d3600',
          900: '#1a1400',
        },
        gold: {
          50: '#fffbf0',
          100: '#fff4cc',
          200: '#ffe999',
          300: '#ffdd66',
          400: '#ffd233',
          500: '#ffc700',
          600: '#cc9f00',
          700: '#997700',
          800: '#664f00',
          900: '#332700',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
} 