import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/workers/generateSeedWorker.ts", // Your TypeScript worker file
  output: {
    file: "src/workers/worker.js", // Bundled output
    format: "esm" // Can also be 'cjs' for Node workers
  },
  plugins: [resolve({ preferBuiltins: true }), commonjs(), typescript()]
};
