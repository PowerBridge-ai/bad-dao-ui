/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0e12',
          secondary: '#121920',
          tertiary: '#1a2530',
        },
        neon: {
          green: '#00ff9d',
          green2: '#a3ffcc',
          blue: '#00e5ff',
          purple: '#bf00ff',
          red: '#ff3d5e',
          yellow: '#ffcb00',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a3ffcc',
          muted: '#528f72',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Rajdhani"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 15px #00ff9d',
        'neon-sm': '0 0 5px #00ff9d',
        'neon-blue': '0 0 15px #00e5ff',
        'neon-red': '0 0 15px #ff3d5e',
        'neon-yellow': '0 0 15px #ffcb00',
      },
      animation: {
        pulse: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff9d' },
          '100%': { boxShadow: '0 0 20px #00ff9d, 0 0 30px #00ff9d' },
        },
      },
    },
  },
  plugins: [],
};