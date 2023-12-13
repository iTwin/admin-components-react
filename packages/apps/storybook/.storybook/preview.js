/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";
import { ThemeProvider } from "@itwin/itwinui-react";
import addons from "@storybook/addons";
import { themes } from "@storybook/theming";
import "itwinui-react-v3/styles.css";

import { darkTheme, lightTheme } from "./itwinTheme";

// get an instance to the communication channel for the manager and preview
const channel = addons.getChannel();

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

export const decorators = [
  (Story) => {
    const [dark, setDark] = React.useState(false)
    
    React.useEffect(() => {
      channel.on("DARK_MODE", setDark);
    }, []);

    return <ThemeProvider style={{ background: "transparent" }} theme={dark ? "dark" : "light"} ><Story /></ThemeProvider>
  },
];
