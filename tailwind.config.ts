import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        poppins: "var(--font-poppins)",
        cormorant: "var(--font-cormorant)",
      },
      colors: {
        primary: "#F0F0F2",
        complementary: "#0D0D0D",
        accent: "#A67C58",
      },
      screens: {
        ms: "320px",
        mm: "375px",
        ml: "425px",
        t: "768px",
        ls: "1024px",
        ll: "1440px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(-1rem)" },
          "50%": { transform: "translateY(1rem)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
