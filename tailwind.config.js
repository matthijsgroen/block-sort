/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "block-red": "#dd0000",
        "block-white": "#eeeeee",
        "block-brown": "#A07353",
      },
      animation: {
        wobble: "wobble 1s ease-in-out both infinite",
        place: "place 0.2s ease-in-out forwards",
      },
      keyframes: {
        place: {
          "0%": { transform: "translateY(-2rem)" },
          "80%": { transform: "translateY(0.2rem)" },
          "100%": { transform: "translateY(0)" },
        },
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
