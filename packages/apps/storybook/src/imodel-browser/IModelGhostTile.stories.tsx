/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelGhostTile } from "@itwin/imodel-browser-react";
import type { Meta, StoryFn } from "@storybook/react-webpack5";
import React from "react";

export default {
  title: "imodel-browser/IModelGhostTile",
  component: IModelGhostTile,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
} as Meta;

const Template: StoryFn = (args) => <IModelGhostTile {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
