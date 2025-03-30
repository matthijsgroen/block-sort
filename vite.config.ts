import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import info from "./package.json";

const ReactCompilerConfig = {
  /* ... */
};

const htmlPlugin = () => {
  return {
    name: "html-transform",
    transformIndexHtml(html: string) {
      return html.replace(/APP_VERSION/, info.version);
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...(mdx({
        /* jsxImportSource: …, otherOptions… */
      }) as Plugin)
    },
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]]
      }
    }),
    htmlPlugin(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true
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
        display: "fullscreen",
        categories: [
          "puzzle",
          "game",
          "offline",
          "single-player",
          "user-friendly"
        ],
        dir: "ltr"
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,mp3,aac,ttf,otf}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 6_000_000
      },
      includeAssets: ["/og-image.png"],

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module"
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  base: "/block-sort/",
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext"
    }
  },
  build: {
    target: "esnext"
  }
});
