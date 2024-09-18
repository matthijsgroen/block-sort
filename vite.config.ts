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
        theme_color: "#1d0f06",
        background_color: "#1d0f06",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,mp3}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
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
