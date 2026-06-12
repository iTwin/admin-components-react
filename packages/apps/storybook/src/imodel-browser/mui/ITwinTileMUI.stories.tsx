/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  type ITwinFull,
  type ITwinTileProps,
  ITwinTile,
} from "@itwin/imodel-browser-react/mui";
import { SvgThumbnail } from "@itwin/imodel-browser-react/mui";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import svgMagnet from "@stratakit/icons/magnet.svg";
import React from "react";

import { DefaultThumbnail } from "../../../../../modules/imodel-browser/src/mui/containers/ITwinGrid/ITwinTileMUI";
import bridgeThumbnail from "../../utils/bridge.jpg";
import powerThumbnail from "../../utils/power.jpg";

const InConstrainedContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => <Box sx={{ maxWidth: "28rem", width: "100%" }}>{children}</Box>;

export const ITwinTileMUIStory = (props: ITwinTileProps) => (
  <InConstrainedContainer>
    <ITwinTile {...props} />
  </InConstrainedContainer>
);

const baseITwin: ITwinFull = {
  id: "1",
  displayName: "iTwin Name",
  number: "aaaa-bbbb-cccc-dddd",
  status: "Trial",
  lastModifiedDateTime: "2024-01-01T12:00:00Z",
  image: bridgeThumbnail,
};

const baseArgs: ITwinTileProps = {
  iTwin: {
    ...baseITwin,
  },
  actions: [
    {
      key: "open",
      label: "Open",
      onClick: action("default iTwin tile action"),
    },
  ],
  moreActions: [
    {
      key: "option-1",
      label: "Option 1",
      icon: svgMagnet,
      onClick: (iTwin) => action("iTwin option 1 clicked")(iTwin),
    },
    {
      key: "option-2",
      label: "Option 2",
      onClick: (iTwin) => action("iTwin option 2 clicked")(iTwin),
    },
  ],
  thumbnail: bridgeThumbnail,
  addToFavorites: async (iTwinId) => {
    action("iTwin add to favorites")(iTwinId);
  },
  removeFromFavorites: async (iTwinId) => {
    action("iTwin remove from favorites")(iTwinId);
  },
};

export default {
  title: "imodel-browser/ITwinTileMUI",
  component: ITwinTileMUIStory,
  excludeStories: ["ITwinTileMUIStory"],
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
    iTwin: {
      options: ["Active", "Inactive", "Trial"],
      mapping: {
        Active: { ...baseITwin, status: "Active", displayName: "Active iTwin" },
        Inactive: {
          ...baseITwin,
          status: "Inactive",
          displayName: "Inactive iTwin",
        },
        Trial: { ...baseITwin, status: "Trial", displayName: "Trial iTwin" },
      },
      control: {
        type: "select",
      },
    },
    moreActions: { control: false },
    onSelect: { control: false },
    thumbnailBottomLeft: { control: false },
    thumbnail: { control: false },
    actions: { control: false },
    thumbnailTopLeft: { control: false },
    thumbnailTopRight: { control: false },
    children: { control: false },
    stringsOverrides: { control: false },
  },
} as Meta;

const Template: Story<ITwinTileProps> = (args) => (
  <ITwinTileMUIStory {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ...baseArgs,
  isFavorite: false,
  disabled: false,
  loading: false,
};

export const Extensive = Template.bind({});
Extensive.args = {
  ...baseArgs,
  status: "warning",
  isFavorite: true,
  title: "Overridden Title",
  description: "Overriden description",
  disabled: false,
  loading: false,
  thumbnail: powerThumbnail,
  thumbnailBottomRight: <Chip size="small" label="Thumbnail Bottom Right" />,
  thumbnailTopLeft: <Chip size="small" label="Thumbnail Top Left" />,
  thumbnailBottomLeft: <Chip size="small" label="Thumbnail Bottom Left" />,
  actions: [
    { key: "open", label: "Open", onClick: action("iTwin open clicked") },
    { key: "share", label: "Share", onClick: action("iTwin share clicked") },
  ],
};

export const DefaultThumbnailStory = Template.bind({});
DefaultThumbnailStory.args = {
  ...baseArgs,
  thumbnail: <DefaultThumbnail />,
};
DefaultThumbnailStory.storyName = "Default Thumbnail";

export const CustomSvgThumbnail = Template.bind({});
CustomSvgThumbnail.args = {
  ...baseArgs,
  thumbnail: <SvgThumbnail src={svgMagnet} />,
};
