/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelGhostTileMUI } from "../../../../modules/imodel-browser/src/containers/iModelTiles/IModelGhostTileMUI";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export default {
  title: "imodel-browser/IModelGhostTileMUI",
  component: IModelGhostTileMUI,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
} as Meta;

const Template: Story = (args) => <IModelGhostTileMUI {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
