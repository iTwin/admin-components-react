/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelGhostTile } from "@itwin/imodel-browser-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export default {
  title: "imodel-browser/IModelGhostTile",
  component: IModelGhostTile,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
} as Meta;

const Template: Story = (args) => <IModelGhostTile {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
