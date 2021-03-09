import { UiCore } from "@bentley/ui-core";
import addons from "@storybook/addons";
import { themes } from "@storybook/theming";

import { darkTheme, lightTheme } from "./uicoreTheme";

// get an instance to the communication channel for the manager and preview
const channel = addons.getChannel();

//This is ONLY there so UiCore registers the css theme colors;
UiCore.length;
// switch body class for story along with interface theme
channel.on("DARK_MODE", (isDark) => {
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: { disable: true },
  darkMode: {
    dark: { ...themes.dark, ...darkTheme },
    light: { ...themes.light, ...lightTheme },
  },
  docs: {
    theme: { ...themes.light, ...lightTheme },
  },
};
