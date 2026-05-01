/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  ITwinTileV2,
  ITwinTileV2Props,
} from "../../../../modules/imodel-browser/src/containers/ITwinGrid/ITwinTileV2";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export const ITwinTileV2Story = (props: ITwinTileV2Props) => (
  <ITwinTileV2 {...props} />
);

export default {
  title: "imodel-browser/ITwinTileV2",
  component: ITwinTileV2Story,
  excludeStories: ["ITwinTileV2Story"],
} as Meta;

const Template: Story<ITwinTileV2Props> = (args) => (
  <ITwinTileV2Story {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  iTwin: {
    id: "1",
    displayName: "iTwin Name",
  },
};
