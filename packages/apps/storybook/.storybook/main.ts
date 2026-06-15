/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "storybook-dark-mode",
    "../../../modules/storybook-auth-addon",
    "../src/addon",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  staticDirs: ["../../../modules/storybook-auth-addon/build"],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.resolve = config.resolve || {};
    config.resolve.mainFields = ["module", "main"];

    const packagePaths: Record<string, string> = {
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

    // Alias local packages to source directories for both dev and production builds
    config.resolve.alias = {
      ...config.resolve.alias,
      ...packagePaths,
    };

    // Enable HMR for local packages in development by aliasing to source directories
    if (configType === "DEVELOPMENT") {
      // Use full source maps to allow VS Code Chrome debugger to map back to TS/TSX sources
      config.devtool = "source-map";
      config.output = config.output || {};
      config.output.devtoolModuleFilenameTemplate = (info: {
        absoluteResourcePath: string;
      }) => {
        // Derive repo root (four levels up from .storybook: ../../../../)
        const repoRoot = path.resolve(__dirname, "../../../../");
        const relPath = path
          .relative(repoRoot, info.absoluteResourcePath)
          .replace(/\\/g, "/");
        return `webpack:///${relPath}`;
      };
    }

    // Handle SCSS files from source directories
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.scss$/,
      include: Object.values(packagePaths),
      use: ["style-loader", "css-loader", "sass-loader"],
    });

    // Ensure StrataKit icon SVGs are emitted with stable URLs so <Icon href="...#icon" />
    // resolves correctly in Storybook (pnpm paths can otherwise leak into URLs).
    config.module.rules.push({
      test: /\.svg$/i,
      include: (resourcePath: string) => {
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

    return config;
  },
};

export default config;
