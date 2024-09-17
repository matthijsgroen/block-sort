/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        block: "2.5rem",
        "height-block": "3.5rem",
        "top-block": "1rem",
      },
      height: {
        "safe-screen":
          "calc(100vh - env(safe-area-inset-top, 2rem) - env(safe-area-inset-bottom, 2rem))",
      },
      colors: {
        block: "var(--cube-color)",
        "block-brown": "#A07353",
      },
      animation: {
        wobble: "wobble 1s ease-in-out both infinite",
        place: "place 0.2s ease-in-out forwards",
        locked: "locked 0.2s ease-in-out forwards",
      },
      keyframes: {
        place: {
          "0%": { transform: "translateY(-2rem)" },
          "80%": { transform: "translateY(1.2rem)" },
          "100%": { transform: "translateY(1rem)" },
        },
        locked: {
          "0%": { transform: "translateY(1rem)" },
          "100%": {
            transform: "translateY(0rem)",
          },
        },
        wobble: {
          "0%": { rotate: "5deg" },
          "50%": { rotate: "-5deg" },
          "100%": { rotate: "5deg" },
        },
      },
      gridTemplateRows: {
        16: "grid-template-rows: repeat(16, minmax(0, 1fr));",
      },
      gridRow: {
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16",
      },
    },
  },
  plugins: [],
};
