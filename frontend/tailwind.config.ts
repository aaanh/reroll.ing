import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      boxShadow: {
        glow: '0 0 10px 3px rgba(37, 147, 183, 0.604)',
      },
    },
  },
  plugins: [],
} satisfies Config;
