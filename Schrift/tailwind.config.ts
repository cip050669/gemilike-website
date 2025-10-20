import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}","./pages/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gem: {
          light:  "#00E5FF",
          primary:"#00BCD4",
          mid:    "#00A884",
          dark:   "#006064",
          purple: "#6A1B9A",
          iRed:   "#FF7B7B",
        },
      },
      keyframes: {
        "gem-shift": {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: { "gem-shift": "gem-shift 10s ease-in-out infinite" },
    },
  },
  plugins: [function({addUtilities}:any){
    addUtilities({
      ".bg-gem-gradient":{
        background:"linear-gradient(90deg,#00E5FF 0%,#00D4B0 25%,#00A884 50%,#006064 75%,#6A1B9A 100%)"
      }
    })
  }],
};
export default config;
