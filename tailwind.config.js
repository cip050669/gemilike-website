/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        // GemILike Logo Colors
        'gem-light': '#00BCD4',
        'gem-medium': '#0097A7',
        'gem-dark': '#006064',
      },
      backgroundImage: {
        'gem-gradient': 'linear-gradient(135deg, #00BCD4 0%, #0097A7 50%, #006064 100%)',
      },
      animation: {
        'gem-shift': 'gem-shift 3s ease-in-out infinite',
      },
      keyframes: {
        'gem-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
