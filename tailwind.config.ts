import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",     // stays as-is
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f0f",
        foreground: "#fafafa",
        card: "#1a1a1a",
        border: "#2a2a2a",
        input: "#1e1e1e",
        muted: "#262626",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 8px 20px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
