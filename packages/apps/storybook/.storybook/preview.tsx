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
import { addons } from "storybook/preview-api";

const ITWIN_ID_EVENT = "project/toolbar/set-itwin-id";
const ACCESS_TOKEN_EVENT = "auth/toolbar/set-access-token";
let _currentITwinId = "";
let _currentAccessToken = "";

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

export const initialGlobals = {};

export const globalTypes = {};

export const decorators = [
  (
    Story: React.ComponentType,
    context: {
      globals: Record<string, string>;
      args: Record<string, unknown>;
      argTypes: Record<string, unknown>;
    }
  ) => {
    const isDark = useDarkMode();
    const theme = isDark ? "dark" : "light";
    const [iTwinId, setITwinId] = React.useState(_currentITwinId);
    const [accessToken, setAccessToken] = React.useState(_currentAccessToken);

    React.useEffect(() => {
      const channel = addons.getChannel();
      const handleITwinId = (id: string) => {
        _currentITwinId = id;
        setITwinId(id);
      };
      const handleAccessToken = (token: string) => {
        _currentAccessToken = token;
        setAccessToken(token);
      };
      channel.on(ITWIN_ID_EVENT, handleITwinId);
      channel.on(ACCESS_TOKEN_EVENT, handleAccessToken);
      return () => {
        channel.off(ITWIN_ID_EVENT, handleITwinId);
        channel.off(ACCESS_TOKEN_EVENT, handleAccessToken);
      };
    }, []);

    // Inject globals into args for components that accept them
    if ("accessToken" in context.argTypes && accessToken) {
      context.args.accessToken = accessToken;
    }
    if ("iTwinId" in context.argTypes && iTwinId) {
      context.args.iTwinId = iTwinId;
    }

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
