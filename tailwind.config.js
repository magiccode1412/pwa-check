/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        dark: '#1E293B',
        light: '#F8FAFC'
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'skeleton-loading': 'skeleton-loading 1.5s infinite',
        'progressive-fade-in': 'progressiveFadeIn 0.6s ease-out forwards',
        'dialog-fade-in': 'dialogFadeIn 0.3s ease-out',
        'image-slide-in': 'imageSlideIn 0.4s ease-out',
      },
      keyframes: {
        'skeleton-loading': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        progressiveFadeIn: {
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        dialogFadeIn: {
          'from': { opacity: '0', transform: 'scale(0.95) translateY(20px)' },
          'to': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        imageSlideIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
