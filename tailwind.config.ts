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
        border: "#E8E4DD",
        primary: "#407076",
        "primary-hover": "#345C61",
        dark: "#14110F",
        terracotta: "#A53F2B",
        subtle: "var(--subtle)",
        // Legacy aliases for existing CSS variable-based references
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
        display: ["'Sora'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(20, 17, 15, 0.08), 0 4px 14px rgba(20, 17, 15, 0.06)",
        "card-hover":
          "0 4px 12px rgba(20, 17, 15, 0.10), 0 10px 28px rgba(20, 17, 15, 0.08)",
        "card-lg":
          "0 8px 30px rgba(0, 0, 0, 0.08)",
        "card-lift":
          "0 12px 40px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
