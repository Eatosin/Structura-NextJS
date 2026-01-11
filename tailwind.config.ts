import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Forces dark mode logic
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Broad coverage for src folder
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards", // Added 'forwards' to keep state
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      colors: {
        // Custom SaaS colors
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [], // Kept empty to rely on raw CSS for simplicity/reliability
};
export default config;
