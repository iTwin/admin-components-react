/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const { buildSync } = require("esbuild");
const fs = require("fs");
const path = require("path");

const outdir = path.resolve(__dirname, "../build");

// Clean and recreate output directory
fs.rmSync(outdir, { recursive: true, force: true });
fs.mkdirSync(outdir, { recursive: true });

// Bundle the OIDC callback handler
buildSync({
  entryPoints: [path.resolve(__dirname, "../src/index.js")],
  bundle: true,
  minify: true,
  outfile: path.join(outdir, "signin-oidc.js"),
  format: "iife",
  target: "es2020",
});

// Write the HTML redirect page
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Storybook authentication page</title>
  </head>
  <body>
    <script src="./signin-oidc.js"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(outdir, "signin-oidc.html"), html);
