/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelGhostTile } from "@itwin/imodel-browser-react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

export default {
  title: "imodel-browser/IModelGhostTile",
  component: IModelGhostTile,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
} as Meta;

export const Primary: StoryObj<typeof IModelGhostTile> = {};
