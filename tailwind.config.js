/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1F5C4A',
        'primary-dark': '#255849',
        beige: '#E5D8C7',
        mint: '#E6ECEA',
        cream: '#EFE7DA',
        'cream-light': '#EFEAE1',
        white: '#FFFFFF',
        black: '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(31,92,74,0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(31,92,74,0.8)' },
        },
      },
    },
  },
  plugins: [],
};
