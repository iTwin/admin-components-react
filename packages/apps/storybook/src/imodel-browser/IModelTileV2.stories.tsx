/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  IModelTileV2,
  IModelTileV2Props,
} from "../../../../modules/imodel-browser/src/containers/iModelTiles/IModelTileV2";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { Icon } from "@stratakit/mui";
import svgImodel from "@stratakit/icons/model.svg";
import svgPlaceholder from "@stratakit/icons/placeholder.svg";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export const IModelTileV2Story = (props: IModelTileV2Props) => (
  <IModelTileV2 {...props} />
);

export default {
  title: "imodel-browser/IModelTileV2",
  component: IModelTileV2Story,
  excludeStories: ["IModelTileV2Story"],
} as Meta;

const Template: Story<IModelTileV2Props> = (args) => (
  <IModelTileV2Story {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  iModel: {
    id: "1",
    displayName: "iModel Name",
    description: "iModel Description",
  },
  iModelOptions: [
    { key: "option-1", children: "Option 1" },
    { key: "option-2", children: "Option 2" },
  ],
  status: "positive",
  isDisabled: false,
  isLoading: false,
  isSelected: false,
  isNew: false,
  badge: <Chip size="small" label="Badge" />,
  leftIcon: <Icon svg={svgPlaceholder} />,
  rightIcon: <Icon svg={svgPlaceholder} />,
  buttons: (
    <>
      <Button key="button-1">Button 1</Button>
      <Button key="button-2">Button 2</Button>
    </>
  ),
  thumbnail: <Icon svg={svgImodel} sx={{ fontSize: 48 }} />,
};
