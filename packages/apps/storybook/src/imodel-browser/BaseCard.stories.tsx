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
};

export const WithThumbnailActions = Template.bind({});
WithThumbnailActions.storyName = "With thumbnail actions";
WithThumbnailActions.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnailTopRight: (
    <>
      <IconButton size="small" color="secondary" aria-label="Add to favorites">
        <Icon href={svgStar} size="regular" />
      </IconButton>
      <IconButton size="small" color="secondary" aria-label="More options">
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
  thumbnailMediaSrc: "https://picsum.photos/640/360?random=42",
  thumbnailMediaAlt: "Bridge thumbnail",
  thumbnailTopRight: (
    <>
      <IconButton size="small" color="secondary" aria-label="Add to favorites">
        <Icon href={svgStar} size="regular" />
      </IconButton>
      <IconButton size="small" color="secondary" aria-label="More options">
        <Icon href={svgMore} size="regular" />
      </IconButton>
    </>
  ),
};

export const WithAvatarGroup = Template.bind({});
WithAvatarGroup.storyName = "With collaborators (AvatarGroup)";
WithAvatarGroup.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
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
  statusIcon: <Icon href={svgStatusSuccess} />,
};

export const WithBadge = Template.bind({});
WithBadge.storyName = "With thumbnail badge";
WithBadge.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnailBottomRight: <Chip size="small" label="Trial" color="primary" />,
};

export const WithActions = Template.bind({});
WithActions.storyName = "With footer actions";
WithActions.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  actions: (
    <>
      <Button size="small">Open</Button>
      <Button size="small" variant="outlined">
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
  onNameClick: action("name-clicked"),
};

export const WithSlotProps = Template.bind({});
WithSlotProps.storyName = "With slot props";
WithSlotProps.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
  thumbnailMediaSrc: "https://picsum.photos/640/360?random=7",
  thumbnailMediaAlt: "Bridge thumbnail",
  actions: (
    <>
      <Button size="small">Open</Button>
      <Button size="small" variant="outlined">
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
};

export const Kitchen = Template.bind({});
Kitchen.storyName = "Kitchen sink";
Kitchen.args = {
  name: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  metadata: "Edited 1/16/2024",
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
      <IconButton size="small" color="secondary" aria-label="Add to favorites">
        <Icon href={svgStar} size="regular" />
      </IconButton>
      <IconButton size="small" color="secondary" aria-label="More options">
        <Icon href={svgMore} size="regular" />
      </IconButton>
    </>
  ),
  thumbnailBottomRight: <Chip size="small" label="Trial" color="primary" />,
  actions: (
    <>
      <Button size="small">Open</Button>
      <Button size="small" variant="outlined">
        Share
      </Button>
    </>
  ),
};
