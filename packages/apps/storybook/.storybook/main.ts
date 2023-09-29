/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { StorybookConfig } from "@storybook/react-vite"
const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "storybook-dark-mode",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@itwin/storybook-auth-addon",
    "../src/addon/register.tsx",
  ],
  viteFinal: (config, options) => {
    const oldDefine = config.define
    config.define = {
      ...oldDefine,
      "process.env": {
        STORYBOOK_AUTH_CLIENT_ID: process.env.STORYBOOK_AUTH_CLIENT_ID
      }
    }
    return config
  },
  staticDirs: ['../node_modules/@itwin/storybook-auth-addon/build'],
};

export default config;
