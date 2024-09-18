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
          "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
      },
      colors: {
        block: "var(--cube-color)",
        "block-brown": "#A07353",
      },
      animation: {
        wobble: "wobble 1s ease-in-out both infinite",
        place: "place 0.3s ease-out forwards",
        locked: "locked 0.3s ease-in-out forwards",
        fadeIn: "fadeIn 1s ease-in-out forwards",
        popInOut: "popInOut 3s ease-in-out forwards",
        rotate: "rotate 2s linear infinite",
        flyTopLeft:
          "flyTopLeft 3s ease-in-out forwards, rotate 4s linear infinite, scale 3s ease-in-out infinite",
        flyTopRight:
          "flyTopRight 3s ease-in-out forwards, rotate 3s linear infinite, scale 2s ease-in-out infinite",
        flyBottomLeft:
          "flyBottomLeft 3s ease-in-out forwards, rotate 4s linear infinite, scale 2s ease-in-out infinite",
        flyBottomRight:
          "flyBottomRight 3s ease-in-out forwards, rotate 3s linear infinite, scale 3s ease-in-out infinite",
      },
      keyframes: {
        rotate: {
          "0%": { rotate: "0deg" },
          "100%": { rotate: "360deg" },
        },
        scale: {
          "0%": { scale: "0.2" },
          "20%": { scale: "0.9" },
          "50%": { scale: "0.7" },
          "80%": { scale: "0.9" },
          "100%": { scale: "0.2" },
        },
        flyTopLeft: {
          "0%": { translate: "0 0" },
          "30%": { translate: "-11rem -0.5rem" },
          "40%": { translate: "-10rem -2.5rem" },
          "90%": { translate: "-9rem -2.5rem", opacity: "1" },
          "100%": { translate: "0 0", opacity: "0" },
        },
        flyTopRight: {
          "0%": { translate: "0rem 0rem" },
          "30%": { translate: "7rem -4.5rem" },
          "40%": { translate: "6rem -3.5rem" },
          "90%": { translate: "7rem -3.5rem", opacity: "1" },
          "100%": { translate: "0rem 0rem", opacity: "0" },
        },
        flyBottomRight: {
          "0%": { translate: "0rem 0rem" },
          "30%": { translate: "7rem 4.5rem" },
          "40%": { translate: "6rem 3.5rem" },
          "90%": { translate: "7rem 3.5rem", opacity: "1" },
          "100%": { translate: "0rem 0rem", opacity: "0" },
        },
        flyBottomLeft: {
          "0%": { translate: "0rem 0rem" },
          "30%": { translate: "-11rem 4.5rem" },
          "40%": { translate: "-10rem 3.5rem" },
          "90%": { translate: "-9rem 3.5rem", opacity: "1" },
          "100%": { translate: "0rem 0rem", opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        place: {
          "0%": { transform: "translateY(-3rem)" },
          "70%": { transform: "translateY(1.4rem)" },
          "90%": { transform: "translateY(0.8rem)" },
          "100%": { transform: "translateY(1rem)" },
        },
        locked: {
          "0%": { transform: "translateY(1rem)" },
          "20%": { transform: "translateY(1rem)" },
          "100%": {
            transform: "translateY(0rem)",
          },
        },
        popInOut: {
          "0%": { scale: "0.3" },
          "25%": { scale: "1.1" },
          "30%": { scale: "1", rotate: "0deg" },

          "50%": { scale: "1.1", rotate: "10deg" },

          "75%": { scale: "1", rotate: "0deg" },
          "85%": { scale: "1.1", opacity: "1" },
          "100%": { scale: "0.3", opacity: "0" },
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
