/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "storybook-dark-mode/register",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "../../../modules/storybook-auth-addon/register.js",
    "../src/addon/register.js",
  ],
  reactOptions: { fastRefresh: true },
  core: {
    builder: "webpack5",
  },
  typescript: {
    reactDocgen: false, // Storybook 6 does not support react-docgen-typescript with Typescript 6 - once we update Storybook this can be restored
  },
  features: {
    babelModeV7: true,
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.resolve.mainFields = ["browser", "module", "main"];
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // Ensure StrataKit icon SVGs are emitted with stable URLs so <Icon href="...#icon" />
    // resolves correctly in Storybook (pnpm paths can otherwise leak into URLs).
    config.module.rules.push({
      test: /\.svg$/i,
      include: (resourcePath) => {
        if (!resourcePath) {
          return false;
        }
        const normalized = resourcePath.replace(/\\/g, "/");
        return (
          normalized.includes("/node_modules/@stratakit/icons/") ||
          normalized.includes("/.pnpm/@stratakit+icons@")
        );
      },
      type: "asset/resource",
      generator: {
        filename: "static/media/[name].[contenthash:8][ext]",
        publicPath: "/",
      },
    });

    const packagePaths = {
      "@itwin/imodel-browser-react/mui": path.resolve(
        __dirname,
        "../../../modules/imodel-browser/src/mui"
      ),
      "@itwin/imodel-browser-react": path.resolve(
        __dirname,
        "../../../modules/imodel-browser/src"
      ),
      "@itwin/create-imodel-react": path.resolve(
        __dirname,
        "../../../modules/create-imodel/src"
      ),
      "@itwin/delete-imodel-react": path.resolve(
        __dirname,
        "../../../modules/delete-imodel/src"
      ),
      "@itwin/delete-itwin-react": path.resolve(
        __dirname,
        "../../../modules/delete-itwin/src"
      ),
      "@itwin/manage-versions-react": path.resolve(
        __dirname,
        "../../../modules/manage-versions/src"
      ),
    };
    // Ensure TypeScript files from source directories are processed
    // (needed for both dev and production since some stories use relative imports to source)
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: Object.values(packagePaths),
      use: [
        {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              require.resolve("@babel/preset-env"),
              require.resolve("@babel/preset-react"),
              require.resolve("@babel/preset-typescript"),
            ],
          },
        },
      ],
    });

    // Handle SCSS files from source directories
    config.module.rules.push({
      test: /\.scss$/,
      include: Object.values(packagePaths),
      use: ["style-loader", "css-loader", "sass-loader"],
    });

    // Enable HMR for local packages in development by aliasing to source directories
    if (configType === "DEVELOPMENT") {
      // Use full source maps to allow VS Code Chrome debugger to map back to TS/TSX sources
      config.devtool = "source-map";
      config.output = config.output || {};
      config.output.devtoolModuleFilenameTemplate = (info) => {
        // Derive repo root (four levels up from .storybook: ../../../../)
        const repoRoot = path.resolve(__dirname, "../../../../");
        let relPath = path
          .relative(repoRoot, info.absoluteResourcePath)
          .replace(/\\/g, "/");
        return `webpack:///${relPath}`;
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        ...packagePaths,
      };
    }

    return config;
  },
  staticDirs: ["../../../modules/storybook-auth-addon/build"],
};
