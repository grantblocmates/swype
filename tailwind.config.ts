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
        bg: "#FBFAF1",
        surface: "#FFFFFF",
        card: "#FFFFFF",
        border: "rgba(0, 0, 0, 0.06)",
        "border-strong": "rgba(0, 0, 0, 0.08)",
        "border-hover": "rgba(0, 0, 0, 0.15)",
        primary: "#407076",
        "primary-hover": "#345C61",
        dark: "#14110F",
        terracotta: "#A53F2B",
        subtle: "var(--subtle)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        "card-bg": "var(--card-bg)",
        "card-border": "var(--card-border)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          yellow: "#FFB500",
          ocean: "#4E76D0",
          sky: "#8EBFE8",
          forest: "#01561D",
          emerald: "#00936D",
          lavender: "#4F467F",
          grape: "#8885D2",
          ruby: "#FC6E48",
          pink: "#FF9BA5",
        },
        wash: {
          green: "#C3DCA8",
          blue: "#2684FC",
          lilac: "#DAD4E2",
          cream: "#FBFAF1",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          hover: "var(--secondary-hover)",
        },
        success: "var(--success)",
        danger: "var(--danger)",
        muted: {
          DEFAULT: "var(--muted)",
          light: "var(--muted-light)",
        },
      },
      fontFamily: {
        display: ["'Outfit'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)",
        "card-hover":
          "0 2px 4px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.08)",
        "card-lg": "0 8px 30px rgba(0, 0, 0, 0.08)",
        "card-lift": "0 12px 40px rgba(0, 0, 0, 0.12)",
        btn: "0 2px 8px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
