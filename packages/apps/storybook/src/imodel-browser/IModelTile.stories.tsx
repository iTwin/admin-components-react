/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelTile as C, IModelTileProps } from "@itwin/imodel-browser";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export const IModelTile = (props: IModelTileProps) => <C {...props} />;

export default {
  title: "imodel-browser/IModelTile",
  component: IModelTile,
  excludeStories: ["IModelTile"],
} as Meta;

const Template: Story<IModelTileProps> = (args) => <IModelTile {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
