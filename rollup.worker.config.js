import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/workers/generateSeedWorker.ts",
  output: {
    file: "src/workers/worker.js",
    format: "esm"
  },
  plugins: [resolve({ preferBuiltins: true }), commonjs(), typescript()]
};
