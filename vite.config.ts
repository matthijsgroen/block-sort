import react from "@vitejs/plugin-react";
import markdownIt from "markdown-it";
import * as path from "node:path";
import { defineConfig } from "vite";
import { Mode, plugin as markDown } from "vite-plugin-markdown";
import { VitePWA } from "vite-plugin-pwa";

const md = markdownIt();
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // Add a new `target` attribute, or replace the value of the existing one.
  tokens[idx].attrSet("target", "_blank");
  // Pass the token to the default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    markDown({ mode: [Mode.REACT], markdownIt: md }),
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
        id: "com.matthijsgroen.blocksort",
        description:
          "Sort stacks of blocks to the same color. No ads, no tracking, no payments. Make sure you don't get blocked!",
        theme_color: "#63462d",
        background_color: "#63462d",
        orientation: "portrait",
        categories: [
          "puzzle",
          "game",
          "offline",
          "single-player",
          "user-friendly",
        ],
        dir: "ltr",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,mp3,aac,ttf}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 6_000_000,
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
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    target: "esnext",
  },
});
