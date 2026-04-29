/** @type {import('tailwindcss').Config} */
export default {
  content: ["./frontend/index.html", "./frontend/src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#2563eb",
      },
      keyframes: {
        "caret-soft": {
          "0%, 100%": { opacity: "0.28" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "caret-soft": "caret-soft 1.15s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
