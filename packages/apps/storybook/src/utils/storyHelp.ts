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
  T extends { accessToken: string | undefined }
>(
  story: Story<T>
) => Story<T> = (Story) => (args, context) =>
  Story({ ...args, accessToken: context.globals.accessToken }, context);

/** HOC that will override the "projectId" prop with the Addon projectId */
export const withProjectIdOverride: <
  T extends { projectId: string | undefined }
>(
  story: Story<T>
) => Story<T> = (Story) => (args, context) =>
  Story(
    { ...args, projectId: args.projectId || context.globals.projectId },
    context
  );
