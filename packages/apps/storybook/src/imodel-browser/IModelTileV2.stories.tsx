/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  IModelTileV2,
  IModelTileV2Props,
} from "../../../../modules/imodel-browser/src/containers/iModelTiles/IModelTileV2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { Icon } from "@stratakit/mui";
import svgPlaceholder from "@stratakit/icons/placeholder.svg";
import bridgeThumbnail from "./bridge.jpg";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

const InConstrainedContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => <Box sx={{ maxWidth: "28rem", width: "100%" }}>{children}</Box>;

export const IModelTileV2Story = (props: IModelTileV2Props) => (
  <InConstrainedContainer>
    <IModelTileV2 {...props} />
  </InConstrainedContainer>
);

export default {
  title: "imodel-browser/IModelTileV2",
  component: IModelTileV2Story,
  excludeStories: ["IModelTileV2Story"],
  argTypes: {
    status: {
      options: ["undefined", "positive", "warning", "negative"],
      mapping: {
        undefined: undefined,
        positive: "positive",
        warning: "warning",
        negative: "negative",
      },
      control: {
        type: "radio",
      },
    },
    iModel: { control: false },
    onThumbnailClick: { control: false },
    thumbnail: { control: false },
    buttons: { control: false },
    iModelOptions: { control: false },
    leftIcon: { control: false },
    badge: { control: false },
    accessToken: { control: false },
    stringOverrides: { control: false },
  },
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
    {
      key: "option-1",
      children: "Option 1",
      onClick: (iModel) => action("iModel option 1 clicked")(iModel),
    },
    {
      key: "option-2",
      children: "Option 2",
      onClick: (iModel) => action("iModel option 2 clicked")(iModel),
    },
  ],
  onThumbnailClick: action("iModel thumbnail/name clicked"),
  status: "positive",
  isFavorite: false,
  addToFavorites: async (iModelId) => {
    action("iModel add to favorites")(iModelId);
  },
  removeFromFavorites: async (iModelId) => {
    action("iModel remove from favorites")(iModelId);
  },
  disabled: false,
  loading: false,
  selected: false,
  badge: <Chip size="small" label="Badge" />,
  leftIcon: <Icon href={svgPlaceholder} size="regular" />,
  buttons: (
    <>
      <Button key="button-1" onClick={action("iModel button 1 clicked")}>
        Button 1
      </Button>
      <Button key="button-2" onClick={action("iModel button 2 clicked")}>
        Button 2
      </Button>
    </>
  ),
  thumbnail: bridgeThumbnail,
};
