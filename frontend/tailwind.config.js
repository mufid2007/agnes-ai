/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agnes: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        brand: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          accent: '#38bdf8',
          purple: '#818cf8',
          amber: '#fbbf24',
          rose: '#f43f5e'
        }
      }
    },
  },
  plugins: [],
}
