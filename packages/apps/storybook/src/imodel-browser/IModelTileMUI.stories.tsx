/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  IModelTileMUI,
  IModelTileMUIProps,
} from "../../../../modules/imodel-browser/src/containers/iModelTiles/IModelTileMUI";
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

export const IModelTileMUIStory = (props: IModelTileMUIProps) => (
  <InConstrainedContainer>
    <IModelTileMUI {...props} />
  </InConstrainedContainer>
);

export default {
  title: "imodel-browser/IModelTileMUI",
  component: IModelTileMUIStory,
  excludeStories: ["IModelTileMUIStory"],
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
    onTitleClick: { control: false },
    thumbnail: { control: false },
    actions: { control: false },
    contextMenuContent: { control: false },
    contextMenuItems: { control: false },
    thumbnailTopLeft: { control: false },
    thumbnailBottomRight: { control: false },
    accessToken: { control: false },
    stringOverrides: { control: false },
  },
} as Meta;

const Template: Story<IModelTileMUIProps> = (args) => (
  <IModelTileMUIStory {...args} />
);

const baseArgs: IModelTileMUIProps = {
  iModel: {
    id: "1",
    displayName: "iModel Name",
    description: "iModel Description from iModel Hub",
    lastChangesetPushDateTime: "2024-01-01T12:00:00Z",
  },

  thumbnail: bridgeThumbnail,

  onThumbnailClick: action("iModel thumbnail/name clicked"),
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
  contextMenuItems: [
    {
      key: "option-1",
      children: "Context Menu Option 1",
      onClick: (iModel) => action("iModel option 1 clicked")(iModel),
    },
    {
      key: "option-2",
      children: "Context Menu Option 2",
      onClick: (iModel) => action("iModel option 2 clicked")(iModel),
    },
  ],
};

export const Default = Template.bind({});
Default.args = {
  ...baseArgs,
};

export const MoreOptions = Template.bind({});
MoreOptions.args = {
  ...baseArgs,
  title: "Overridden Title",
  description: "Overriden description",
  isFavorite: true,
  addToFavorites: async (iModelId) => {
    action("iModel add to favorites")(iModelId);
  },
  removeFromFavorites: async (iModelId) => {
    action("iModel remove from favorites")(iModelId);
  },
  thumbnailBottomRight: <Chip size="small" label="Badge" />,
  thumbnailTopLeft: <Icon href={svgPlaceholder} size="regular" />,
  actions: [
    {
      key: "button-1",
      label: "Open in Viewer",
      onClick: action("iModel button 1 clicked"),
    },
    {
      key: "button-2",
      label: "Open in VR Headset",
      onClick: action("iModel button 2 clicked"),
    },
  ],
};
