import react from "@vitejs/plugin-react";
import * as path from "node:path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "Block Sort",
        short_name: "Block Sort",
        description: "Sort the stacks of blocks",
        theme_color: "#63462d",
        background_color: "#63462d",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,mp3,ttf}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 7_521_024,
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/block-sort/",
});
