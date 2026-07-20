/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          900: '#881337',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      // YAHAN SE NAYA ANIMATION CODE ADD HUA HAI
      keyframes: {
  'bounce-once': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-12px)' },
  },
  'fade-in': {
    '0%': { opacity: '0', transform: 'translateY(4px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '20%, 60%': { transform: 'translateX(-6px)' },
    '40%, 80%': { transform: 'translateX(6px)' },
  },
  'pop-in': {
    '0%':   { transform: 'scale(0.6)', opacity: '0' },
    '60%':  { transform: 'scale(1.08)', opacity: '1' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  'ping-slow': {
    '0%':   { transform: 'scale(1)', opacity: '0.6' },
    '100%': { transform: 'scale(1.8)', opacity: '0' },
  },
  'ping-slower': {
    '0%':   { transform: 'scale(1)', opacity: '0.4' },
    '100%': { transform: 'scale(2.3)', opacity: '0' },
  },
  'slide-up': {
    '0%':   { transform: 'translateY(16px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  'draw-circle': {
    to: { strokeDashoffset: '0' },
  },
  'draw-check': {
    to: { strokeDashoffset: '0' },
  },
},
animation: {
  'bounce-once':  'bounce-once 0.6s ease-in-out',
  'fade-in':      'fade-in 0.3s ease-out',
  shake:          'shake 0.4s ease-in-out',
  'pop-in':       'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1)',
  'ping-slow':    'ping-slow 1.6s cubic-bezier(0,0,0.2,1) infinite',
  'ping-slower':  'ping-slower 1.6s cubic-bezier(0,0,0.2,1) 0.3s infinite',
  'slide-up':     'slide-up 0.5s ease-out forwards',
},
    },
  },
  plugins: [],
}