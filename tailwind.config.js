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
        gem: {
          fire: '#FF9447',
          fireLight: '#FFD85E',
          fireDark: '#E53935',
          ice: '#00BCD4',
          iceLight: '#00E5FF',
          iceDark: '#006064',
          green: '#00B8A9',
          purple: '#6A1B9A',
          bgDark: '#0B0C10',
          bgLight: '#E0F7FA',
          text: '#F5F5F5',
          text2: '#607D8B',
          compOrange: '#478EFF',
          compYellow: '#5E8EFF',
          compCyan: '#D45E00',
          compPetrol: '#FFA66B',
          compGreen: '#B8000F',
        },
      },
      backgroundImage: {
        'gem-energy': 'linear-gradient(90deg, #FF9447 0%, #FFD85E 25%, #00B8A9 60%, #00BCD4 85%, #006064 100%)',
        'gem-ice': 'linear-gradient(135deg, #00E5FF 0%, #00BCD4 40%, #009688 70%, #6A1B9A 100%)',
        'gem-hero': 'linear-gradient(90deg, #6A1B9A 0%, #478EFF 40%, #FF9447 100%)',
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
