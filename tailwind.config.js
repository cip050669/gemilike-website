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
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          alt: 'hsl(var(--surface-alt))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          strong: 'hsl(var(--primary-strong))',
          press: 'hsl(var(--primary-press))',
          soft: 'hsl(var(--primary-soft))',
          focus: 'hsl(var(--primary-focus))',
        },
        'primary-soft': 'hsl(var(--primary-soft))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          strong: 'hsl(var(--secondary-strong))',
          press: 'hsl(var(--secondary-press))',
          soft: 'hsl(var(--secondary-soft))',
          focus: 'hsl(var(--secondary-focus))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          soft: 'hsl(var(--accent-soft))',
        },
        link: {
          DEFAULT: 'hsl(var(--link))',
          hover: 'hsl(var(--link-hover))',
          soft: 'hsl(var(--link-soft))',
          focus: 'hsl(var(--link-focus))',
        },
        // GemILike Logo Colors
        'gem-light': '#00BCD4',
        'gem-medium': '#0097A7',
        'gem-dark': '#006064',
      },
      backgroundImage: {
        'gem-gradient': 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 45%, #00BCD4 100%)',
      },
      boxShadow: {
        'primary-glow': '0 8px 18px rgba(255, 107, 53, 0.35)',
        'secondary-glow': '0 6px 20px rgba(0, 188, 212, 0.28)',
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
      fontFamily: {
        'impact': ['Impact', 'Arial Black', 'sans-serif'],
      },
      fontWeight: {
        'impact': '900',
      },
    },
  },
  plugins: [],
}
