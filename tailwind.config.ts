import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#08080B",
          panel: "#111116",
          panel2: "#17171F",
          line: "#26262F",
          text: "#F2F1F6",
          muted: "#8C8C99",
        },
        brand: {
          violet: "#8A5CF6",
          indigo: "#4B2AF0",
          magenta: "#D6299B",
          lilac: "#E9D8FD",
        },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #E9D8FD 0%, #8A5CF6 45%, #4B2AF0 75%, #6E1FA0 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(138,92,246,0.18) 0%, rgba(75,42,240,0.14) 50%, rgba(214,41,155,0.12) 100%)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
