/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  BaseCard,
  BaseCardProps,
} from "../../../../modules/imodel-browser/src/components/baseCard/BaseCard";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import svgMore from "@stratakit/icons/more-vertical.svg";
import svgStar from "@stratakit/icons/star.svg";
import svgStatusSuccess from "@stratakit/icons/status-success.svg";
import svgStatusWarning from "@stratakit/icons/status-warning.svg";
import svgStatusError from "@stratakit/icons/status-error.svg";
import bridgeThumbnail from "./bridge.jpg";
import { Icon } from "@stratakit/mui";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export const BaseCardStory = (props: BaseCardProps) => <BaseCard {...props} />;

export default {
  title: "imodel-browser/BaseCard",
  component: BaseCardStory,
  excludeStories: ["BaseCardStory"],
  argTypes: {
    slotProps: { control: false },
    thumbnail: { control: false },
    thumbnailTopLeft: { control: false },
    thumbnailTopRight: { control: false },
    thumbnailBottomRight: { control: false },
    headerRight: { control: false },
    statusIcon: { control: false },
    cardInfo: { control: false },
    actions: { control: false },
  },
} as Meta;

const Template: Story<BaseCardProps> = (args) => <BaseCardStory {...args} />;

// ── Stories ──────────────────────────────────────────────────────────────────

export const Default = Template.bind({});
Default.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: bridgeThumbnail,
};

export const WithoutThumbnail = Template.bind({});
WithoutThumbnail.storyName = "Without thumbnail";
WithoutThumbnail.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: undefined,
};

export const WithThumbnailActions = Template.bind({});
WithThumbnailActions.storyName = "With thumbnail actions";
WithThumbnailActions.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: bridgeThumbnail,
  thumbnailTopRight: (
    <>
      <IconButton
        size="small"
        color="secondary"
        aria-label="Add to favorites"
        onClick={action("thumbnail favorite clicked")}
      >
        <Icon href={svgStar} size="regular" />
      </IconButton>
      <IconButton
        size="small"
        color="secondary"
        aria-label="More options"
        onClick={action("thumbnail more-options clicked")}
      >
        <Icon href={svgMore} size="regular" />
      </IconButton>
    </>
  ),
};

export const WithImageThumbnail = Template.bind({});
WithImageThumbnail.storyName = "With image thumbnail";
WithImageThumbnail.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: bridgeThumbnail,
  thumbnailTopRight: (
    <>
      <IconButton
        size="small"
        color="secondary"
        aria-label="Add to favorites"
        onClick={action("image thumbnail favorite clicked")}
      >
        <Icon href={svgStar} size="regular" />
      </IconButton>
      <IconButton
        size="small"
        color="secondary"
        aria-label="More options"
        onClick={action("image thumbnail more-options clicked")}
      >
        <Icon href={svgMore} size="regular" />
      </IconButton>
    </>
  ),
};

export const WithAvatarGroup = Template.bind({});
WithAvatarGroup.storyName = "With AvatarGroup";
WithAvatarGroup.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: bridgeThumbnail,
  headerRight: (
    <AvatarGroup
      max={3}
      sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 12 } }}
    >
      <Avatar alt="User 1" src="https://i.pravatar.cc/150?img=1" />
      <Avatar alt="User 2" src="https://i.pravatar.cc/150?img=2" />
      <Avatar alt="User 3" src="https://i.pravatar.cc/150?img=3" />
    </AvatarGroup>
  ),
};

export const WithStatusIcon = Template.bind({});
WithStatusIcon.storyName = "With status icon";
WithStatusIcon.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: bridgeThumbnail,
  statusIcon: <Icon href={svgStatusSuccess} />,
};

export const WithBadge = Template.bind({});
WithBadge.storyName = "With thumbnail badge";
WithBadge.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: bridgeThumbnail,
  thumbnailBottomRight: <Chip size="small" label="Trial" color="primary" />,
};

export const WithActions = Template.bind({});
WithActions.storyName = "With footer actions";
WithActions.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: bridgeThumbnail,
  actions: (
    <>
      <Button size="small" onClick={action("actions open clicked")}>
        Open
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={action("actions share clicked")}
      >
        Share
      </Button>
    </>
  ),
};

export const WithClickableName = Template.bind({});
WithClickableName.storyName = "With clickable name";
WithClickableName.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: bridgeThumbnail,
  onNameClick: action("name-clicked"),
};

export const WithSlotProps = Template.bind({});
WithSlotProps.storyName = "With slot props";
WithSlotProps.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: bridgeThumbnail,
  actions: (
    <>
      <Button size="small" onClick={action("slot props open clicked")}>
        Open
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={action("slot props share clicked")}
      >
        Share
      </Button>
    </>
  ),
  slotProps: {
    thumbnail: {
      sx: { height: 160, bgcolor: "grey.100" },
    },
    content: {
      sx: { p: 2.5, pt: 2, gap: 1.5 },
    },
    divider: {
      sx: { mx: 2 },
    },
    actions: {
      sx: { px: 2.5, pb: 2 },
    },
  },
};

export const Statuses = () => (
  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
    {(
      [
        { label: "Positive", icon: svgStatusSuccess, color: "success.main" },
        { label: "Warning", icon: svgStatusWarning, color: "warning.main" },
        { label: "Negative", icon: svgStatusError, color: "error.main" },
      ] as const
    ).map(({ label, icon, color }) => (
      <BaseCard
        key={label}
        name="Main Street Bridge"
        description="3D model of the Main Street bridge structure."
        metadata="Edited 1/16/2024"
        thumbnail={bridgeThumbnail}
        statusIcon={
          <Box component="span" sx={{ lineHeight: 0, color }}>
            <Icon href={icon} size="regular" />
          </Box>
        }
      />
    ))}
  </Box>
);

export const FullWidth = Template.bind({});
FullWidth.storyName = "Full width";
FullWidth.args = {
  fullWidth: true,
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: bridgeThumbnail,
};

export const Kitchen = Template.bind({});
Kitchen.storyName = "Kitchen sink";
Kitchen.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnail: bridgeThumbnail,
  statusIcon: (
    <Box component="span" sx={{ lineHeight: 0, color: "warning.main" }}>
      <Icon href={svgStatusWarning} size="regular" />
    </Box>
  ),
  headerRight: (
    <AvatarGroup
      max={3}
      sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 12 } }}
    >
      <Avatar alt="User 1" src="https://i.pravatar.cc/150?img=1" />
      <Avatar alt="User 2" src="https://i.pravatar.cc/150?img=2" />
      <Avatar alt="User 3" src="https://i.pravatar.cc/150?img=3" />
    </AvatarGroup>
  ),
  thumbnailTopRight: (
    <>
      <IconButton
        size="small"
        color="secondary"
        aria-label="Add to favorites"
        onClick={action("kitchen thumbnail favorite clicked")}
      >
        <Icon href={svgStar} size="regular" />
      </IconButton>
      <IconButton
        size="small"
        color="secondary"
        aria-label="More options"
        onClick={action("kitchen thumbnail more-options clicked")}
      >
        <Icon href={svgMore} size="regular" />
      </IconButton>
    </>
  ),
  thumbnailBottomRight: <Chip size="small" label="Trial" color="primary" />,
  actions: (
    <>
      <Button size="small" onClick={action("kitchen open clicked")}>
        Open
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={action("kitchen share clicked")}
      >
        Share
      </Button>
    </>
  ),
};
