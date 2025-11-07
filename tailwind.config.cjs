/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7ff",
          100: "#e6effe",
          200: "#c0d5fd",
          300: "#9abafa",
          400: "#5e8ff6",
          500: "#2a66f2",
          600: "#1f4fbe",
          700: "#173c90",
          800: "#102a63",
          900: "#0a1b3f"
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
