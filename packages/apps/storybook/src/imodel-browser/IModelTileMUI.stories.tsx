/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  type IModelTileProps as IModelTileMUIProps,
  IModelTile as IModelTileMUI,
  SvgThumbnail,
} from "@itwin/imodel-browser-react/mui";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import SvgDelete from "@stratakit/icons/delete.svg";
import svgRoad from "@stratakit/icons/road.svg";
import SvgShare from "@stratakit/icons/share.svg";
import React from "react";

import bridgeThumbnail from "../utils/bridge.jpg";
import overpassThumbnail from "../utils/overpass.jpg";

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
    thumbnail: { control: false },
    actions: { control: false },
    moreActions: { control: false },
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
  actions: [
    {
      key: "open",
      label: "iModel Name",
      onClick: action("iModel opened"),
    },
  ],
  disabled: false,
  loading: false,
  moreActions: [
    {
      key: "option-1",
      icon: SvgShare,
      children: "More Actions Option 1",
      onClick: (iModel) => action("action 1 clicked")(iModel),
    },
    {
      key: "option-2",
      icon: SvgDelete,
      children: "More Actions Option 2",
      onClick: (iModel) => action("action 2 clicked")(iModel),
    },
  ],
};

export const Default = Template.bind({});
Default.args = {
  ...baseArgs,
};

export const Extensive = Template.bind({});
Extensive.args = {
  ...baseArgs,
  title: "Overridden Title",
  description: "Overriden description",
  subheader: "Additional description",
  thumbnail: overpassThumbnail,
  getBadge: () => <Chip size="small" label="Badge" />,
  thumbnailTopLeft: (
    <AvatarGroup max={3}>
      <Avatar alt="User 1" src="https://i.pravatar.cc/150?img=1" />
      <Avatar alt="User 2" src="https://i.pravatar.cc/150?img=2" />
      <Avatar alt="User 3" src="https://i.pravatar.cc/150?img=3" />
    </AvatarGroup>
  ),
  actions: [
    {
      key: "open",
      label: "Open in App",
      onClick: action("iModel opened"),
    },
    {
      key: "vr",
      label: "Open in VR Headset",
      onClick: action("VR Headset clicked"),
    },
  ],
};

export const NoThumbnail = Template.bind({});
NoThumbnail.args = {
  ...baseArgs,
  thumbnail: undefined,
};

export const CustomSvgThumbnail = Template.bind({});
CustomSvgThumbnail.args = {
  ...baseArgs,
  thumbnail: <SvgThumbnail src={svgRoad} />,
};
