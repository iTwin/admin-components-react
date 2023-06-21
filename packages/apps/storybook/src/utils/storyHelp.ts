/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Story } from "@storybook/react/types-6-0";

const ACCESS_TOKEN_DEFAULT_VALUE =
  "In this storybook, this is provided by clicking on the key in the toolbar";
export const accessTokenArgTypes = {
  accessToken: {
    defaultValue: ACCESS_TOKEN_DEFAULT_VALUE,
  },
};

/** HOC that will override the "accessToken" prop with the Addon token */
export const withAccessTokenOverride: <
  T extends { accessToken?: string | undefined }
>(
  story: Story<T>
) => Story<T> = (Story) => (args, context) =>
  Story({ ...args, accessToken: context.globals.accessToken }, context);

/** HOC that will override the "iTwinId" prop with the Addon iTwinId */
export const withITwinIdOverride: <T extends { iTwinId?: string | undefined }>(
  story: Story<T>
) => Story<T> = (Story) => (args, context) =>
  Story({ ...args, iTwinId: args.iTwinId || context.globals.iTwinId }, context);
