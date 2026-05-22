/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ThemeProvider } from "@itwin/itwinui-react";
import { themes } from "storybook/theming";
import { useDarkMode } from "storybook-dark-mode";
import { darkTheme, lightTheme } from "./itwinTheme";
import "@itwin/itwinui-react/styles.css";
import React from "react";

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
    scope: "itwin-platform",
    authority: "https://qa-ims.bentley.com",
  },
  layout: "fullscreen",
};

export const initialGlobals = {
  accessToken: "",
};

export const globalTypes = {
  accessToken: {
    description: "OAuth access token set by the auth toolbar addon",
  },
};

export const decorators = [
  (Story: React.ComponentType) => {
    const isDark = useDarkMode();
    const theme = isDark ? "dark" : "light";

    return (
      <ThemeProvider
        style={{
          background: "var(--iui-color-background)",
          padding: "1rem",
          minHeight: "100vh",
        }}
        theme={theme}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children={(<Story />) as any}
      />
    );
  },
];
