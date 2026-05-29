/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

const ACCESS_TOKEN_DEFAULT_VALUE =
  "In this storybook, this is provided by clicking on the key in the toolbar";
export const accessTokenArgTypes = {
  accessToken: {
    defaultValue: ACCESS_TOKEN_DEFAULT_VALUE,
    control: { type: "text" },
  },
};

const ITWIN_ID_DEFAULT_VALUE =
  "In this storybook, this is provided by selecting an iTwin in the toolbar";
export const iTwinIdArgTypes = {
  iTwinId: {
    description: "iTwin ID to load data from",
    defaultValue: ITWIN_ID_DEFAULT_VALUE,
    control: { type: "text" },
  },
};

/** Combined helper for stories that need both access token (auth toolbar)
 * and iTwin ID (project selector toolbar). */
export const iTwinAndAccessTokenArgTypes = {
  ...accessTokenArgTypes,
  ...iTwinIdArgTypes,
};
