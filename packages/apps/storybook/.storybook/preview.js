/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import addons from "@storybook/addons";
import { themes } from "@storybook/theming";

import { darkTheme, lightTheme } from "./itwinTheme";

// get an instance to the communication channel for the manager and preview
const channel = addons.getChannel();

// switch body class for story along with interface theme
channel.on("DARK_MODE", (isDark) => {
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
  document.documentElement.classList.add(
    `iui-theme-${isDark ? "dark" : "light"}`
  );
  document.documentElement.classList.remove(
    `iui-theme-${!isDark ? "dark" : "light"}`
  );
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: { disable: true },
  controls: { expanded: true },
  darkMode: {
    dark: { ...themes.dark, ...darkTheme },
    light: { ...themes.light, ...lightTheme },
  },
  docs: {
    theme: { ...themes.light, ...lightTheme },
  },
  authClientConfig: {
    clientId: process.env.STORYBOOK_AUTH_CLIENT_ID,
    scope: ["imodels:read", "imodels:modify", "itwins:modify", "itwins:read"].join(" "),
    authority: "https://qa-ims.bentley.com",
  },
};
