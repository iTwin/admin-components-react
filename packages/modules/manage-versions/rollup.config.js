/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

import * as packageJson from "./package.json";

const rollupConfig = {
  input: "src/index.ts",
  external: Object.keys(packageJson.dependencies).map(
    (dep) => new RegExp(`${dep}(/.*)?`, "g")
  ),
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
  plugins: [
    peerDepsExternal(),
    commonjs(),
    typescript(),
    postcss({
      use: {
        sass: { outputStyle: "compressed" },
      },
    }),
    image(),
    terser(),
  ],
};

export default rollupConfig;
