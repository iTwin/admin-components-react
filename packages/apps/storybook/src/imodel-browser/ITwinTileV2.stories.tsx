/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  ITwinTileV2,
  ITwinTileV2Props,
} from "../../../../modules/imodel-browser/src/containers/ITwinGrid/ITwinTileV2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { Icon } from "@stratakit/mui";
import svgPlaceholder from "@stratakit/icons/placeholder.svg";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import bridgeThumbnail from "./bridge.jpg";

const InConstrainedContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => <Box sx={{ maxWidth: "28rem", width: "100%" }}>{children}</Box>;

export const ITwinTileV2Story = (props: ITwinTileV2Props) => (
  <InConstrainedContainer>
    <ITwinTileV2 {...props} />
  </InConstrainedContainer>
);

export default {
  title: "imodel-browser/ITwinTileV2",
  component: ITwinTileV2Story,
  excludeStories: ["ITwinTileV2Story"],
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
    iTwin: { control: false },
    contextMenuItems: { control: false },
    onThumbnailClick: { control: false },
    thumbnailBottomLeft: { control: false },
    thumbnail: { control: false },
    buttons: { control: false },
    leftIcon: { control: false },
    rightIcon: { control: false },
    badge: { control: false },
    children: { control: false },
    stringsOverrides: { control: false },
  },
} as Meta;

const Template: Story<ITwinTileV2Props> = (args) => (
  <ITwinTileV2Story {...args} />
);

const baseArgs: ITwinTileV2Props = {
  iTwin: {
    id: "1",
    displayName: "iTwin Name",
    number: "12345",
    status: "Trial",
    lastModifiedDateTime: "2024-01-01T12:00:00Z",
  },
  contextMenuItems: [
    {
      key: "option-1",
      children: "Option 1",
      onClick: (iTwin) => action("iTwin option 1 clicked")(iTwin),
    },
    {
      key: "option-2",
      children: "Option 2",
      onClick: (iTwin) => action("iTwin option 2 clicked")(iTwin),
    },
  ],
  thumbnail: bridgeThumbnail,
  onThumbnailClick: action("iTwin thumbnail/name clicked"),
  addToFavorites: async (iTwinId) => {
    action("iTwin add to favorites")(iTwinId);
  },
  removeFromFavorites: async (iTwinId) => {
    action("iTwin remove from favorites")(iTwinId);
  },
};

export const Default = Template.bind({});
Default.args = {
  ...baseArgs,
  status: "positive",
  isFavorite: false,
  description: "Example iTwin description",

  disabled: false,
  loading: false,
  selected: false,
  buttons: (
    <>
      <Button key="button-1" onClick={action("iTwin button 1 clicked")}>
        Button 1
      </Button>
      <Button key="button-2" onClick={action("iTwin button 2 clicked")}>
        Button 2
      </Button>
    </>
  ),
};

export const MoreOptions = Template.bind({});
MoreOptions.args = {
  ...baseArgs,
  status: "warning",
  isFavorite: false,

  disabled: false,
  loading: false,
  selected: false,
  leftIcon: <Icon href={svgPlaceholder} size="regular" />,
  rightIcon: <Icon href={svgPlaceholder} size="regular" />,
  thumbnailBottomLeft: <Chip size="small" label="Featured" color="default" />,
  badge: <Chip size="small" label="Trial" color="primary" />,
  description: "Example iTwin description",
  buttons: (
    <>
      <Button key="button-1" onClick={action("iTwin button 1 clicked")}>
        Button 1
      </Button>
      <Button key="button-2" onClick={action("iTwin button 2 clicked")}>
        Button 2
      </Button>
    </>
  ),

  children: (
    <Typography variant="body2" color="text.secondary">
      Additional child content rendered below the fineprint.
    </Typography>
  ),
};
