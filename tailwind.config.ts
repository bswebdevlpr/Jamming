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
      },
      fontFamily: {
        'suit-body': ['SUIT-BODY', 'sans-serif'],
        'suit-title': ['SUIT-TITLE', 'sans-serif'],
        'sbaggio-l': ['SBAggroL', 'sans-serif'],
        'sbaggio-m': ['SBAggroM', 'sans-serif'],
        'sbaggio-b': ['SBAggroB', 'sans-serif'],
        'pretendard': ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
