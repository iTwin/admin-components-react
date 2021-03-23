import { create } from "@storybook/theming/create";

export const lightTheme = create({
  base: "light",
  brandTitle: "iTwin Admin Components",

  colorPrimary: "#008BE1",
  colorSecondary: "#008BE1",

  // UI
  appBg: "#EEF0F3",
  appContentBg: "#F8F9FB",
  appBorderColor: "#C7CCD1",
  appBorderRadius: 9,

  // Typography
  fontBase:
    'BlinkMacSystemFont, -apple-system, "Open Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  fontCode:
    '"SF Mono", SFMono-Regular, ui-monospace, "DejaVu Sans Mono", Menlo, Consolas, monospace',

  // Text colors
  textColor: "rgba(000,000,000,0.8)",

  // Toolbar default and active colors
  barTextColor: "rgba(000,000,000,0.8)",
  barSelectedColor: "#008BE1",
  barBg: "#F8F9FB",

  // Form colors
  inputBg: "#FFFFFF",
  inputBorder: "rgba(000,000,000,0.4)",
  inputTextColor: "rgba(000,000,000,0.8)",
  inputBorderRadius: 3,
});

export const darkTheme = create({
  base: "dark",
  brandTitle: "iTwin Admin Components",

  colorPrimary: "#A5D7F5",
  colorSecondary: "#A5D7F5",

  // UI
  appBg: "#2D373C",
  appContentBg: "#4F5D65",
  appBorderColor: "#2D373C",
  appBorderRadius: 9,

  // Typography
  fontBase:
    'BlinkMacSystemFont, -apple-system, "Open Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  fontCode:
    '"SF Mono", SFMono-Regular, ui-monospace, "DejaVu Sans Mono", Menlo, Consolas, monospace',

  // Text colors
  textColor: "rgba(255,255,255,0.85)",

  // Toolbar default and active colors
  barTextColor: "rgba(255,255,255,0.85)",
  barSelectedColor: "#A5D7F5",
  barBg: "#4F5D65",

  // Form colors
  inputBg: "#5A6973",
  inputBorder: "rgba(255,255,255,0.45)",
  inputTextColor: "rgba(255,255,255,0.85)",
  inputBorderRadius: 3,
  textInverseColor: "rgba(255,255,255,0.85)",
  textMutedColor: "rgba(255,255,255,0.40)",
});
