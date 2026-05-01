/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelGhostTileV2 } from "../../../../modules/imodel-browser/src/containers/iModelTiles/IModelGhostTileV2";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export default {
  title: "imodel-browser/IModelGhostTileV2",
  component: IModelGhostTileV2,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
} as Meta;

const Template: Story = (args) => <IModelGhostTileV2 {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
