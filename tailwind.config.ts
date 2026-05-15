import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        surface: "var(--surface)",
        "surface-high": "var(--surface-elevated)",
        accent: "var(--accent)",
        "accent-muted": "var(--accent-muted)",
        border: "var(--border)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        instrument:
          "0 0 0 1px rgba(232, 234, 230, 0.08), 0 0 40px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
