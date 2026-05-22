/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ITwinTile as C, ITwinTileProps } from "@itwin/imodel-browser-react";
import type { Meta, StoryFn } from "storybook";
import React from "react";

export const ITwinTile = (props: ITwinTileProps) => <C {...props} />;

export default {
  title: "imodel-browser/ITwinTile",
  component: ITwinTile,
  excludeStories: ["ITwinTile"],
} as Meta;

const Template: StoryFn<ITwinTileProps> = (args) => <ITwinTile {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  iTwin: {
    id: "1",
    displayName: "iTwin Name",
  },
};
