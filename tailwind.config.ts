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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "card-bg": "var(--card-bg)",
        "card-border": "var(--card-border)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        secondary: "var(--secondary)",
        "secondary-hover": "var(--secondary-hover)",
        success: "var(--success)",
        danger: "var(--danger)",
        muted: "var(--muted)",
        "muted-light": "var(--muted-light)",
        subtle: "var(--subtle)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(20, 17, 15, 0.08), 0 4px 14px rgba(20, 17, 15, 0.06)",
        "card-hover":
          "0 4px 12px rgba(20, 17, 15, 0.10), 0 10px 28px rgba(20, 17, 15, 0.08)",
        "card-lg":
          "0 6px 20px rgba(20, 17, 15, 0.10), 0 16px 40px rgba(20, 17, 15, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
