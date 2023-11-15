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
  reactOptions: { fastRefresh: true },
  framework: '@storybook/react-webpack5',
  core: {
    builder: 'webpack5',
  },
  features: {
    babelModeV7: true,
  },
    "@storybook/addon-essentials",
    "@itwin/storybook-auth-addon",
    "../src/addon/register.js",
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.resolve.mainFields = ["module", "main"];
    // Add the Babel loader rule

    // Return the altered config
    return config;
  },
};
