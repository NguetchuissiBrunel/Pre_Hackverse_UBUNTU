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
        neon: {
          cyan: "#00f3ff",
          magenta: "#ff00ff",
          orange: "#ffaa00",
        },
        oled: {
          black: "#050510",
        },
        glass: {
          dark: "rgba(5, 5, 16, 0.7)",
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 30px #00f3ff',
        'neon-magenta': '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
        'neon-orange': '0 0 10px #ffaa00, 0 0 20px #ffaa00, 0 0 30px #ffaa00',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;
