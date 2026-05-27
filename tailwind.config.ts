import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest:        "#0B1F12",
        emerald:       "#14321E",
        moss:          "#1C4A2A",
        fern:          "#2D6B40",
        "green-glow":  "#4CAF7D",
        gold:          "#C9A96E",
        "gold-light":  "#E8D5A3",
        "gold-dark":   "#8B6914",
        cream:         "#F5F0E8",
        "cream-muted": "#B8B0A0",
        parchment:     "#F0EAD8",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        label:   ["var(--font-label)", "system-ui", "sans-serif"],
        body:    ["var(--font-body)", "Georgia", "serif"],
      },
      letterSpacing: {
        "ultra":   "0.45em",
        "wide-xl": "0.35em",
        "wide-lg": "0.3em",
        "wide-md": "0.2em",
      },
      boxShadow: {
        "gold-glow":    "0 0 40px rgba(201,169,110,0.06)",
        "gold-glow-lg": "0 0 60px rgba(201,169,110,0.12)",
        "green-glow":   "0 0 30px rgba(76,175,125,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
