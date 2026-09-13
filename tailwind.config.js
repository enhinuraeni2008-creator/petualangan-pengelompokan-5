/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
      colors: {
        sky: {
          light: '#CDEFFF',
          DEFAULT: '#8FD9FF',
          deep: '#3FA9E0',
        },
        sun: {
          light: '#FFE49B',
          DEFAULT: '#FFC93C',
          dark: '#F2A900',
        },
        coral: {
          light: '#FFB4A8',
          DEFAULT: '#FF6B5B',
          dark: '#E24C3D',
        },
        leaf: {
          light: '#C9F2D6',
          DEFAULT: '#4ECD8B',
          dark: '#2FA76B',
        },
        ink: '#2B3A55',
        cloud: '#FBF9F3',
      },
      boxShadow: {
        pop: '0 6px 0 rgba(43, 58, 85, 0.18)',
        popSmall: '0 4px 0 rgba(43, 58, 85, 0.18)',
      },
      borderRadius: {
        blob: '2rem',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateY(320px) rotate(360deg)', opacity: 0 },
        },
      },
      animation: {
        pop: 'pop 0.25s ease-out',
        wiggle: 'wiggle 1.2s ease-in-out infinite',
        floaty: 'floaty 3s ease-in-out infinite',
        confetti: 'confetti 1.8s ease-in forwards',
      },
    },
  },
  plugins: [],
}
