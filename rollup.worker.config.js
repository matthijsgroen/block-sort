import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

const plugins = [resolve({ preferBuiltins: true }), commonjs(), typescript()];

export default [
  {
    input: "src/workers/generateSeedWorker.ts",
    output: {
      file: "src/workers/generate-worker.js",
      format: "esm"
    },
    plugins
  },
  {
    input: "src/workers/verifySeedWorker.ts",
    output: {
      file: "src/workers/verify-worker.js",
      format: "esm"
    },
    plugins
  }
];
