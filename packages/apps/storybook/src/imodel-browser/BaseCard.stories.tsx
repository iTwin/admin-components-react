/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SvgThumbnail } from "@itwin/imodel-browser-react/mui";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { action } from "storybook/actions";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import svgGeo from "@stratakit/icons/geospatial-features.svg";
import svgPin from "@stratakit/icons/pin.svg";
import svgSave from "@stratakit/icons/save.svg";
import svgStatusError from "@stratakit/icons/status-error.svg";
import svgStatusSuccess from "@stratakit/icons/status-success.svg";
import svgStatusWarning from "@stratakit/icons/status-warning.svg";
import React from "react";

import {
  BaseCard,
  BaseCardProps,
} from "../../../../modules/imodel-browser/src/components/baseCard/BaseCard";
import { ThumbnailIconButton } from "../../../../modules/imodel-browser/src/components/baseCard/ThumbnailIconButton";
import bridgeThumbnail from "../utils/bridge.jpg";
import nightThumbnail from "../utils/night.jpg";

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
    thumbnail: { control: false },
    thumbnailTopLeft: { control: false },
    thumbnailTopRight: { control: false },
    thumbnailBottomRight: { control: false },

    statusIconHref: { control: false },
    additionalDescription: { control: false },
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

const baseArgs: BaseCardProps = {
  title: "Main Street Bridge",
  description: "3D model of the Main Street bridge structure and components.",
  subheader: "Edited 2000-01-02",
  thumbnail: bridgeThumbnail,
  actions: [
    { key: "open", label: "Open", onClick: action("default action clicked") },
  ],
};

// ── Stories ──────────────────────────────────────────────────────────────────

export const Default: StoryObj<typeof BaseCardStory> = {
  args: { ...baseArgs },
};

const everythingArgs: BaseCardProps = {
  ...baseArgs,
  description:
    "When there is more than one `action` prop they will be rendered as buttons in the footer of the card and the whole card is not clickable.",
  onContextMenu: action("context-menu opened"),
  actions: [
    { key: "open", label: "Open", onClick: action("open action clicked") },
    { key: "share", label: "Share", onClick: action("share action clicked") },
    {
      key: "disabled",
      label: "Disabled",
      onClick: action("disabled action clicked"),
      disabled: true,
    },
  ],
  moreActions: [
    {
      key: "open",
      label: "Open with",
      onClick: action("menu: open clicked"),
      icon: svgGeo,
    },
    { key: "share", label: "Share", onClick: action("menu: share clicked") },
    { key: "delete", label: "Delete", onClick: action("menu: delete clicked") },
    {
      key: "disabled",
      label: "Disabled option",
      onClick: action("menu: disabled clicked"),
      disabled: true,
      icon: svgSave,
    },
  ],

  statusIconHref: svgStatusWarning,
  thumbnailTopLeft: (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Chip size="small" label="Top Left" />
      <AvatarGroup max={3}>
        <Avatar alt="User 1" src="https://i.pravatar.cc/150?img=1" />
        <Avatar alt="User 2" src="https://i.pravatar.cc/150?img=2" />
        <Avatar alt="User 3" src="https://i.pravatar.cc/150?img=3" />
      </AvatarGroup>
    </Box>
  ),

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
        icon={svgSave}
        muted
      />
    </>
  ),
  thumbnailBottomLeft: <Chip size="small" label="Bottom left" />,
  thumbnailBottomRight: <Chip size="small" label="Bottom right" />,
};

export const Everything: StoryObj<typeof BaseCardStory> = {
  name: "Everything",
  args: { ...everythingArgs },
};

export const WithoutThumbnail: StoryObj<typeof BaseCardStory> = {
  name: "Without thumbnail",
  args: { ...everythingArgs, thumbnail: undefined },
};

export const WithDarkThumbnail: StoryObj<typeof BaseCardStory> = {
  name: "With dark thumbnail",
  args: {
    ...everythingArgs,
    thumbnail: nightThumbnail,
  },
};

export const WithoutContent: StoryObj<typeof BaseCardStory> = {
  name: "Without content",
  args: {
    ...everythingArgs,
    title: "Main Street Bridge",
    description: undefined,
    subheader: undefined,
    thumbnail: bridgeThumbnail,
  },
};

export const Statuses: StoryObj<typeof BaseCardStory> = {
  render: () => (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: "repeat(auto-fill, minmax(22.5rem, 1fr))",
      }}
    >
      {(
        [
          { label: "Positive", icon: svgStatusSuccess, status: "positive" },
          { label: "Warning", icon: svgStatusWarning, status: "warning" },
          { label: "Negative", icon: svgStatusError, status: "negative" },
        ] as const
      ).map(({ label, icon, status }) => (
        <BaseCard
          key={label}
          title="Main Street Bridge"
          description="3D model of the Main Street bridge structure."
          subheader="Edited 1/16/2024"
          thumbnail={bridgeThumbnail}
          statusIconHref={icon}
          status={status}
        />
      ))}
    </Box>
  ),
};

export const WithSvgThumbnail: StoryObj<typeof BaseCardStory> = {
  name: "With SVG thumbnail",
  args: {
    ...baseArgs,
    thumbnail: <SvgThumbnail src={svgGeo} />,
  },
};

export const Loading: StoryObj<typeof BaseCardStory> = {
  args: { ...baseArgs, loading: true },
};

export const Disabled: StoryObj<typeof BaseCardStory> = {
  name: "Disabled state",
  args: { ...baseArgs, disabled: true },
};

export const LongTitle: StoryObj<typeof BaseCardStory> = {
  name: "Long title",
  args: {
    ...baseArgs,
    title:
      "This is a very long title that should truncate automagically with an ellipsis at the end",
    moreActions: [
      {
        key: "open",
        label: "Open with",
        onClick: action("menu: open clicked"),
        icon: svgGeo,
      },
    ],
  },
};

export const OpenSitePlus: StoryObj<typeof BaseCardStory> = {
  name: "OpenSite+ iModel style",
  args: {
    ...baseArgs,
    title: "OpenSite+ iModel",
    subheader: "Modified 2026-01-01",
    description:
      "This card mimics the design of OpenSite+ iModel cards with an AvatarGroup in the top left, a pin/favorite button in the top right, and no dedicated action buttons below the description.",
    onContextMenu: action("context-menu opened"),
    moreActions: [
      {
        key: "open",
        label: "Open with",
        onClick: action("menu: open with clicked"),
        icon: svgGeo,
      },
      { key: "share", label: "Share", onClick: action("menu: share clicked") },
      { key: "delete", label: "Delete", onClick: action("menu: delete clicked") },
    ],
    actions: [
      {
        key: "open",
        label: "Open",
        onClick: action("default open action clicked"),
      },
    ],
    statusIconHref: undefined,
    thumbnailTopLeft: (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AvatarGroup max={3}>
          <Avatar alt="User 1" src="https://i.pravatar.cc/150?img=1" />
          <Avatar alt="User 2" src="https://i.pravatar.cc/150?img=2" />
          <Avatar alt="User 3" src="https://i.pravatar.cc/150?img=3" />
        </AvatarGroup>
      </Box>
    ),
    thumbnailTopRight: (
      <>
        <ThumbnailIconButton
          aria-label="Add to favorites"
          onClick={action("thumbnail favorite clicked")}
          icon={svgPin}
        />
      </>
    ),
  },
};
