import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const packageJson = require("./package.json");
export default {
  input: "src/index.ts",
  external: [/@bentley\/itwinui-react(\/.*)?/, /classnames/],
  output: [
    {
      file: packageJson.main,
      format: "cjs",
    },
    {
      file: packageJson.module,
      format: "esm",
    },
  ],
  plugins: [peerDepsExternal(), commonjs(), typescript(), postcss(), terser()],
};
