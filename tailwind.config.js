/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        'navy-800': '#1E293B',
        'navy-700': '#334155',
        'navy-600': '#475569',
        'navy-500': '#64748B',
        'green-accent': '#22C55E',
        'green-hover': '#16A34A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

