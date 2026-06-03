/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  IModelTile as IModelTileMUI,
  type IModelTileProps as IModelTileMUIProps,
} from "@itwin/imodel-browser-react/mui";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Icon } from "@stratakit/mui";
import svgPlaceholder from "@stratakit/icons/placeholder.svg";
import SvgShare from "@stratakit/icons/share.svg";
import SvgDelete from "@stratakit/icons/delete.svg";
import bridgeThumbnail from "../utils/bridge.jpg";
import overpassThumbnail from "../utils/overpass.jpg";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import Button from "@mui/material/Button";

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
    onSelect: { control: false },
    onOpen: { control: false },
    thumbnail: { control: false },
    actions: { control: false },
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

  onSelect: action("iModel selected"),
  onOpen: action("iModel opened"),
  disabled: false,
  loading: false,
  selected: false,
  contextMenuItems: [
    {
      key: "option-1",
      icon: <Icon href={SvgShare} size="regular" />,
      children: "Context Menu Option 1",
      onClick: (iModel) => action("iModel option 1 clicked")(iModel),
    },
    {
      key: "option-2",
      icon: <Icon href={SvgDelete} size="regular" />,
      children: "Context Menu Option 2",
      onClick: (iModel) => action("iModel option 2 clicked")(iModel),
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
  additionalDescription: "Additional description",
  additionalContent: <Button variant="contained">Additional Content</Button>,
  thumbnail: overpassThumbnail,
  getBadge: () => <Chip size="small" label="Badge" />,
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
