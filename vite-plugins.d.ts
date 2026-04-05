/**
 * Type declaration for @rolldown/plugin-babel.
 * The package does not yet ship its own typings; this stub provides just enough
 * to use it in vite.config.ts without a @ts-expect-error suppression.
 */
declare module "@rolldown/plugin-babel" {
  import type { Plugin } from "vite";

  interface BabelPluginOptions {
    presets?: unknown[];
    plugins?: unknown[];
    [key: string]: unknown;
  }

  export default function babel(options?: BabelPluginOptions): Plugin;
}
