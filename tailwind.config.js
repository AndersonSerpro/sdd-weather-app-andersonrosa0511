/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          900: '#0b1020',
          800: '#111a2b',
          700: '#1a2940',
        },
        ink: {
          900: '#f5f7fb',
          700: '#dce4ef',
          500: '#b0bfd1',
          400: '#91a2b8',
        },
        accent: {
          100: '#1b2a40',
          400: '#8ecbd6',
          500: '#306f7d',
          600: '#285764',
        },
        sun: '#f5b942',
        coral: '#f28a82',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};
