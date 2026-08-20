/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F1111',
          800: '#131921',
          700: '#232F3E',
          600: '#37475A',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        orange: {
          500: '#FF9900',
          600: '#E68A00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
