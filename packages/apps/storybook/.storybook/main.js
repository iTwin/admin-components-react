const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "storybook-dark-mode/register",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@itwin/storybook-auth-addon",
    "../src/addon/register.js",
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
    });

    config.resolve.mainFields = ["storybookSource", "module", "main"];

    // Return the altered config
    return config;
  },
};
