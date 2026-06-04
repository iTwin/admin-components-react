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
import Chip from "@mui/material/Chip";
import svgPin from "@stratakit/icons/pin.svg";
import svgStatusSuccess from "@stratakit/icons/status-success.svg";
import svgStatusWarning from "@stratakit/icons/status-warning.svg";
import svgStatusError from "@stratakit/icons/status-error.svg";
import svgGeo from "@stratakit/icons/geospatial-features.svg";
import bridgeThumbnail from "../utils/bridge.jpg";
import nightThumbnail from "../utils/night.jpg";
import { Icon } from "@stratakit/mui";
import { action, actions } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import Typography from "@mui/material/Typography";
import {
  buildContextMenuItemsMUI,
  type ContextMenuBuilderItemMUI,
} from "../../../../modules/imodel-browser/src/utils/_buildMenuOptions";
import { ThumbnailIconButton } from "../../../../modules/imodel-browser/src/components/baseCard/ThumbnailIconButton";
import { SvgThumbnail } from "@itwin/imodel-browser-react/mui";

const InConstrainedContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => <Box sx={{ maxWidth: "28rem", width: "100%" }}>{children}</Box>;

export const BaseCardStory = (props: BaseCardProps) => (
  <InConstrainedContainer>
    <BaseCard {...props} />
  </InConstrainedContainer>
);

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
    additionalDescription: { control: false },
    onClick: { control: false },
    onDoubleClick: { control: false },
    onContextMenu: { control: false },
    status: {
      options: ["undefined", "positive", "warning", "negative"],
      mapping: {
        none: undefined,
        positive: "positive",
        warning: "warning",
        negative: "negative",
      },
      control: {
        type: "radio",
      },
    },
  },
} as Meta;

const Template: Story<BaseCardProps> = (args) => <BaseCardStory {...args} />;

const baseArgs: BaseCardProps = {
  title: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  additionalDescription: "Edited 2000-01-02",
  thumbnail: bridgeThumbnail,
};

// ── Stories ──────────────────────────────────────────────────────────────────

export const Default = Template.bind({});
Default.args = { ...baseArgs };

const contextMenuItems: ContextMenuBuilderItemMUI[] = [
  {
    key: "open",
    onClick: action("menu: open clicked"),
    children: "Open with",
  },
  {
    key: "share",
    children: "Share",
    onClick: action("menu: share clicked"),
  },
  {
    key: "delete",
    children: "Delete",
    onClick: action("menu: delete clicked"),
  },
];
const contextMenuContent = buildContextMenuItemsMUI(
  contextMenuItems,
  { some: "object" } as const,
  () => actions("closeMenu called"),
  () => actions("refetch called")
);

const everythingArgs: BaseCardProps = {
  ...baseArgs,
  onClick: action("clicked"),
  onDoubleClick: action("double-clicked "),
  onContextMenu: action("context-menu opened"),
  contextMenuContent,
  actions: [
    { key: "open", label: "Open", onClick: action("open clicked") },
    {
      key: "share",
      label: "Share",
      onClick: action("share clicked"),
    },
  ],
  statusIcon: (
    <Box component="span" sx={{ lineHeight: 0, color: "warning.main" }}>
      <Icon href={svgStatusWarning} size="regular" />
    </Box>
  ),
  headerRight: (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Chip size="small" label="Owned" variant="outlined" />
      <AvatarGroup
        max={3}
        sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 12 } }}
      >
        <Avatar alt="User 1" src="https://i.pravatar.cc/150?img=1" />
        <Avatar alt="User 2" src="https://i.pravatar.cc/150?img=2" />
        <Avatar alt="User 3" src="https://i.pravatar.cc/150?img=3" />
      </AvatarGroup>
    </Box>
  ),
  thumbnailTopLeft: <Chip size="small" label="iModel" color="secondary" />,
  thumbnailTopRight: (
    <>
      <ThumbnailIconButton
        aria-label="Add to favorites"
        onClick={action("thumbnail favorite clicked")}
        icon={svgPin}
      />
      <ThumbnailIconButton
        aria-label="Muted icon button"
        onClick={action("muted clicked")}
        icon={svgPin}
        muted
      />
    </>
  ),
  thumbnailBottomLeft: <Chip size="small" label="Featured" color="default" />,
  thumbnailBottomRight: <Chip size="small" label="Trial" color="primary" />,
  additionalContent: (
    <Typography variant="body2" color="textSecondary">
      This is some additional content rendered below the description and above
      the footer actions.
    </Typography>
  ),
};

export const Everything = Template.bind({});
Everything.storyName = "Everything";
Everything.args = { ...everythingArgs };

export const WithoutThumbnail = Template.bind({});
WithoutThumbnail.storyName = "Without thumbnail";
WithoutThumbnail.args = { ...everythingArgs, thumbnail: undefined };

export const WithDarkThumbnail = Template.bind({});
WithDarkThumbnail.storyName = "With dark thumbnail";
WithDarkThumbnail.args = {
  ...everythingArgs,
  thumbnail: nightThumbnail,
};

export const WithSlotProps = Template.bind({});
WithSlotProps.storyName = "With slot props";
WithSlotProps.args = {
  ...everythingArgs,

  slotProps: {
    thumbnail: {
      sx: { opacity: 0.2 },
    },
    content: {
      sx: { color: "warning.main" },
    },
    divider: {
      sx: { borderWidth: 5, borderColor: "success.main" },
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
        title="Main Street Bridge"
        description="3D model of the Main Street bridge structure."
        additionalDescription="Edited 1/16/2024"
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

export const WithSvgThumbnail = Template.bind({});
WithSvgThumbnail.storyName = "With SVG thumbnail";
WithSvgThumbnail.args = {
  ...baseArgs,
  thumbnail: <SvgThumbnail src={svgGeo} />,
};

export const Loading = Template.bind({});
Loading.args = { ...baseArgs, loading: true };

export const Selected = Template.bind({});
Selected.storyName = "Selected state";
Selected.args = { ...baseArgs, selected: true };

export const LongTitle = Template.bind({});
LongTitle.storyName = "Long title";
LongTitle.args = {
  ...baseArgs,
  title:
    "This is a very long title that should truncate automagically with an ellipsis at the end",
};
