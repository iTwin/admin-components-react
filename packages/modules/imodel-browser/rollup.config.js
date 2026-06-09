/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";
import svgr from "@svgr/rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
// import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

import * as packageJson from "./package.json";

const baseConfig = {
  external: Object.keys(packageJson.dependencies).map(
    (dep) => new RegExp(`${dep}(/.*)?`, "g")
  ),
};

function createPlugins({ declaration = true } = {}) {
  return [
    peerDepsExternal(),
    commonjs(),
    typescript({
      tsconfigOverride: declaration
        ? {}
        : { compilerOptions: { declaration: false, declarationMap: false } },
    }),
    svgr(),
    postcss({
      use: {
        sass: { outputStyle: "compressed" },
      },
    }),
    // terser(),
    url({
      limit: 10 * 1024, // Adjust the limit as needed (e.g., 10 KB)
      include: ["**/*.png"], // Include file extensions you want to handle (e.g., PNG)
      emitFiles: true, // Emit the files to the output directory
    }),
  ];
}

const rollupConfig = [
  // Default/itwinui barrel — emits JS + declarations for the entire project
  {
    ...baseConfig,
    plugins: createPlugins(),
    input: "src/index.ts",
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
  },
  // MUI barrel — JS only, declarations already emitted by the first entry
  {
    ...baseConfig,
    plugins: createPlugins({ declaration: false }),
    input: "src/mui/index.ts",
    output: [
      {
        file: "cjs/mui/index.js",
        format: "cjs",
      },
      {
        file: "esm/mui/index.js",
        format: "esm",
      },
    ],
  },
];

export default rollupConfig;
