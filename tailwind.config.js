/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "block-red": "#ff0000",
        "block-white": "#eeeeee",
      },
    },
  },
  plugins: [],
};
