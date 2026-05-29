/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        afn: {
          50: "#f0f7f1",
          100: "#dbecdd",
          200: "#b8d9bd",
          300: "#8cbf94",
          400: "#5fa169",
          500: "#3f8549",
          600: "#2f6b39",
          700: "#27562f",
          800: "#1f4426",
          900: "#16321c",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
