/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import commonjs from "@rollup/plugin-commonjs";
import svgr from "@svgr/rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

import * as packageJson from "./package.json";

const rollupConfig = {
  input: "src/index.ts",
  external: [
    /@itwin\/itwinui-react(\/.*)?/,
    /classnames/,
    /@bentley\/icons-generic-webfont/,
    /react-intersection-observer/,
  ],
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
    svgr(),
    postcss({
      use: {
        sass: { outputStyle: "compressed" },
      },
    }),
    terser(),
  ],
};

export default rollupConfig;
