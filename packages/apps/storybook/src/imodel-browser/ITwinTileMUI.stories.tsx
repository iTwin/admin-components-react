/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  ITwinTileMUI,
  ITwinTileMUIProps,
} from "../../../../modules/imodel-browser/src/containers/ITwinGrid/ITwinTileMUI";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { Icon } from "@stratakit/mui";
import svgPlaceholder from "@stratakit/icons/placeholder.svg";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import bridgeThumbnail from "./bridge.jpg";
import { ITwinFull } from "@itwin/imodel-browser-react/src";

const InConstrainedContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => <Box sx={{ maxWidth: "28rem", width: "100%" }}>{children}</Box>;

export const ITwinTileMUIStory = (props: ITwinTileMUIProps) => (
  <InConstrainedContainer>
    <ITwinTileMUI {...props} />
  </InConstrainedContainer>
);

const baseITwin: ITwinFull = {
  id: "1",
  displayName: "iTwin Name",
  number: "aaaa-bbbb-cccc-dddd",
  status: "Trial",
  lastModifiedDateTime: "2024-01-01T12:00:00Z",
};

const baseArgs: ITwinTileMUIProps = {
  iTwin: {
    ...baseITwin,
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
  onOpen: action("iTwin opened"),
  onSelect: action("iTwin selected"),
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

    contextMenuItems: { control: false },
    onSelect: { control: false },
    onOpen: { control: false },
    thumbnailBottomLeft: { control: false },
    thumbnail: { control: false },
    actions: { control: false },
    thumbnailTopLeft: { control: false },
    thumbnailTopRight: { control: false },
    children: { control: false },
    stringsOverrides: { control: false },
  },
} as Meta;

const Template: Story<ITwinTileMUIProps> = (args) => (
  <ITwinTileMUIStory {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ...baseArgs,
  isFavorite: false,
  disabled: false,
  loading: false,
  selected: false,
};

export const MoreOptions = Template.bind({});
MoreOptions.args = {
  ...baseArgs,
  status: "warning",
  isFavorite: false,
  title: "Overridden Title",
  description: "Overriden description",
  disabled: false,
  loading: false,
  selected: false,
  thumbnailTopLeft: <Icon href={svgPlaceholder} size="regular" />,
  thumbnailBottomLeft: <Chip size="small" label="Featured" color="default" />,
  badge: <Chip size="small" label="Badge override" color="primary" />,
  actions: [
    { key: "open", label: "Open", onClick: action("iTwin open clicked") },
    { key: "share", label: "Share", onClick: action("iTwin share clicked") },
  ],
};
