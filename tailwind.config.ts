import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0faf1",
          100: "#dcf3de",
          200: "#b9e6bd",
          300: "#8bd394",
          400: "#5bba68",
          500: "#3a9e48",
          600: "#2c8438", // vivid RHM green (primary)
          700: "#25682e",
          800: "#215329",
          900: "#1c4423",
          950: "#0c2510",
        },
        surface: {
          DEFAULT: "#ffffff",
          warm: "#faf9f5",
          muted: "#f4f5f2",
        },
        ink: {
          DEFAULT: "#1f2422",
          soft: "#4a524d",
          faint: "#767f79",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(28, 68, 35, 0.04), 0 4px 16px rgba(28, 68, 35, 0.06)",
        "card-hover": "0 2px 4px rgba(28, 68, 35, 0.06), 0 8px 24px rgba(28, 68, 35, 0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        wave: "wave 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
