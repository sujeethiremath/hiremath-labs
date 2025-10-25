/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  // We use the content array to tell Tailwind where to look for utility classes
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Add custom theme extensions here if needed
      // e.g., colors, fonts, spacing
    },
  },

  // *** CRITICAL FIX: Register the typography plugin here ***
  // This is the correct, universal way to load plugins for utility generation.
  plugins: [
    // This is the package that generates the .prose styles.
    // Ensure you have run: npm install -D @tailwindcss/typography
    require("@tailwindcss/typography"),
  ],
};

export default config;
