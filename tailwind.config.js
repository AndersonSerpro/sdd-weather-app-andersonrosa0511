/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#273a3b',
          700: '#4c6261',
          500: '#5d716e',
          400: '#667875',
        },
        accent: {
          100: '#e5f0ec',
          400: '#6c9692',
          500: '#4d7977',
          600: '#3e6665',
        },
        sun: '#d8a85f',
        coral: '#a85f57',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 14px 36px rgba(59, 83, 79, 0.10)',
      },
    },
  },
  plugins: [],
};
