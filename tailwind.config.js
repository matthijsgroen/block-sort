/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "block-sort": ["LuckiestGuy", "serif"]
      },
      spacing: {
        block: "2.5rem",
        "height-block": "3.5rem",
        "top-block": "1rem",
        22: "5.5rem"
      },
      backgroundImage: {
        "wood-texture": "url('./assets/wood-texture.png')"
      },
      height: {
        "safe-area":
          "calc(100% - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
      },
      padding: {
        safeLeft: "max(env(safe-area-inset-left, 0.5rem), 0.5rem)",
        safeRight: "max(env(safe-area-inset-right, 0.5rem), 0.5rem)"
      },
      colors: {
        block: "var(--cube-color)",
        "block-brown": "#a07353",
        wood: "#63462d",
        "light-wood": "#966f33"
      },
      animation: {
        wobble:
          "wobble 1s ease-in-out both infinite, smallBounce 1.3s ease-in-out both infinite",
        plantWiggle: "plantWiggle 527ms linear alternate infinite",
        plantWiggleSlow: "plantWiggle 5270ms linear alternate infinite",
        pulse: "pulse 1.5s ease-in-out infinite",
        rayShift: "rayShift 6s ease-in-out alternate infinite",
        rayShift2: "rayShift2 5.5s ease-in-out alternate infinite",
        place: "place 0.2s ease-out 2ms forwards",
        moveBlock: "moveBlock 1.4s ease-out 2ms forwards",
        locked: "locked 0.5s ease-in-out forwards",
        trayLocked: "trayLocked 0.3s ease-in-out forwards",
        fadeIn: "fadeIn 1s ease-in-out forwards",
        fadeOut: "fadeOut 1s ease-in-out forwards",
        popInOut: "popInOut 3s ease-in-out forwards",
        rotate: "rotate 2s linear infinite",
        flyTopLeft:
          "flyTopLeft 3s ease-in-out forwards, rotate 8s linear infinite, scale 3s ease-in-out infinite",
        flyTopRight:
          "flyTopRight 3s ease-in-out forwards, rotate 6s linear infinite, scale 2s ease-in-out infinite",
        flyBottomLeft:
          "flyBottomLeft 3s ease-in-out forwards, rotate 8s linear infinite, scale 2s ease-in-out infinite",
        flyBottomRight:
          "flyBottomRight 3s ease-in-out forwards, rotate 6s linear infinite, scale 3s ease-in-out infinite",
        lightning: "lightning 30s linear infinite"
      },
      keyframes: {
        rayShift: {
          "0%": { translate: "0rem 0" },
          "100%": { translate: "3rem 0" }
        },
        rayShift2: {
          "0%": { translate: "0rem 0" },
          "100%": { translate: "2rem 0" }
        },
        pulse: {
          "0%": { scale: "1" },
          "50%": { scale: "1.1" },
          "100%": { scale: "1" }
        },
        plantWiggle: {
          "0%": { scale: "1 1", rotate: "-2deg" },
          "50%": { scale: "1 1.05", rotate: "0deg" },
          "100%": { scale: "1 1", rotate: "2deg" }
        },
        rotate: {
          "0%": { rotate: "0deg" },
          "100%": { rotate: "360deg" }
        },
        scale: {
          "0%": { scale: "0.2" },
          "20%": { scale: "0.9" },
          "50%": { scale: "0.7" },
          "80%": { scale: "0.9" },
          "100%": { scale: "0.2" }
        },
        flyTopLeft: {
          "0%": { translate: "0 0" },
          "30%": { translate: "-11rem -0.5rem" },
          "40%": { translate: "-10rem -2.5rem" },
          "90%": { translate: "-9rem -2.5rem", opacity: "1" },
          "100%": { translate: "0 0", opacity: "0" }
        },
        flyTopRight: {
          "0%": { translate: "0rem 0rem" },
          "30%": { translate: "7rem -4.5rem" },
          "40%": { translate: "6rem -3.5rem" },
          "90%": { translate: "7rem -3.5rem", opacity: "1" },
          "100%": { translate: "0rem 0rem", opacity: "0" }
        },
        flyBottomRight: {
          "0%": { translate: "0rem 0rem" },
          "30%": { translate: "7rem 4.5rem" },
          "40%": { translate: "6rem 3.5rem" },
          "90%": { translate: "7rem 3.5rem", opacity: "1" },
          "100%": { translate: "0rem 0rem", opacity: "0" }
        },
        flyBottomLeft: {
          "0%": { translate: "0rem 0rem" },
          "30%": { translate: "-11rem 4.5rem" },
          "40%": { translate: "-10rem 3.5rem" },
          "90%": { translate: "-9rem 3.5rem", opacity: "1" },
          "100%": { translate: "0rem 0rem", opacity: "0" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" }
        },
        moveBlock: {
          "0%": { translate: "0 -2rem" },
          "60%": { translate: "0 -2rem" },
          "85%": { translate: "0 1.2rem" },
          "95%": { translate: "0 0.9rem" },
          "100%": { translate: "0 1rem" }
        },
        place: {
          "0%": { translate: "0 0rem" },
          "40%": { translate: "0 1.2rem" },
          "70%": { translate: "0 0.9rem" },
          "100%": { translate: "0 1rem" }
        },
        trayLocked: {
          "0%": { translate: "0 0.75rem" },
          "20%": { translate: "0 0.75rem" },
          "100%": {
            translate: "0 0rem"
          }
        },
        locked: {
          "0%": { translate: "0 1rem" },
          "20%": { translate: "0 1rem" },
          "100%": {
            translate: "0 0rem"
          }
        },
        popInOut: {
          "0%": { scale: "0.3" },
          "25%": { scale: "1.1" },
          "30%": { scale: "1", rotate: "0deg" },

          "50%": { scale: "1.1", rotate: "10deg" },

          "75%": { scale: "1", rotate: "0deg" },
          "85%": { scale: "1.1", opacity: "1" },
          "100%": { scale: "0.3", opacity: "0" }
        },
        wobble: {
          "0%": { rotate: "5deg", translate: "0 -5px" },
          "50%": { rotate: "-5deg", translate: "0 5px" },
          "100%": { rotate: "5deg", translate: "0 -5px" }
        },
        smallBounce: {
          "0%": { translate: "0 -5px" },
          "50%": { translate: "0 5px" },
          "100%": { translate: "0 -5px" }
        },
        lightning: {
          "0%": { opacity: "0" },
          "9%": { opacity: "0" },
          "10%": { opacity: "4%" },
          "11%": { opacity: "0" },
          "19%": { opacity: "0" },
          "20%": { opacity: "3%" },
          "21%": { opacity: "0" },
          "100%": { opacity: "0" }
        }
      },
      gridTemplateRows: {
        16: "grid-template-rows: repeat(16, minmax(0, 1fr));"
      },
      gridRow: {
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16"
      }
    }
  },
  plugins: []
};
