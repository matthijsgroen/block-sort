/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "block-red": "#ff0000",
        "block-white": "#eeeeee",
        "block-brown": "#895129",
      },
      animation: {
        wobble: "wobble 1s ease-in-out both infinite",
      },
      keyframes: {
        wobble: {
          "0%": { rotate: "5deg" },
          "50%": { rotate: "-5deg" },
          "100%": { rotate: "5deg" },
        },
      },
    },
  },
  plugins: [],
};
