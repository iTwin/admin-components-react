/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ITwinTile as C, ITwinTileProps } from "@itwin/imodel-browser-react";
import { ThemeProvider } from "@itwin/itwinui-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export const ITwinTile = (props: ITwinTileProps) => <C {...props} />;

export default {
  title: "imodel-browser/ITwinTile",
  component: ITwinTile,
  excludeStories: ["ITwinTile"],
} as Meta;

const Template: Story<ITwinTileProps> = (args) => (
  <ThemeProvider>
    <ITwinTile {...args} />
  </ThemeProvider>
);

export const Primary = Template.bind({});
Primary.args = {};
