/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ITwinTile as C, ITwinTileProps } from "@itwin/imodel-browser-react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import React from "react";

export const ITwinTile = (props: ITwinTileProps) => <C {...props} />;

export default {
  title: "imodel-browser/ITwinTile",
  component: ITwinTile,
  excludeStories: ["ITwinTile"],
} as Meta;

export const Primary: StoryObj<typeof ITwinTile> = {
  args: {
    iTwin: {
      id: "1",
      displayName: "iTwin Name",
    },
  },
};
