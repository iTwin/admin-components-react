/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  IModelGridMUI as ExternalComponent,
  type IModelGridMUIProps,
} from "../../../../modules/imodel-browser/src/containers/iModelGrid/IModelGridMUI";
import {
  DataStatus,
  type IModelFull,
  IModelCellColumn,
} from "../../../../../packages/modules/imodel-browser/src/types";
import {
  useIndividualState,
  additionalData,
  initialData,
} from "./IModelGridMUI.helpers";
import SvgDelete from "@stratakit/icons/delete.svg";
import SvgApple from "@stratakit/icons/apple.svg";
import { Icon } from "@stratakit/mui";
import { IconButton } from "@itwin/itwinui-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import {
  accessTokenArgTypes,
  withAccessTokenOverride,
  withITwinIdOverride,
} from "../utils/storyHelp";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import { action } from "@storybook/addon-actions";

export const IModelGridMUI = (props: IModelGridMUIProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "imodel-browser/IModelGridMUI",
  component: IModelGridMUI,
  argTypes: accessTokenArgTypes,
  excludeStories: ["IModelGridMUI"],
} as Meta;

const Template: Story<IModelGridMUIProps> = withITwinIdOverride(
  withAccessTokenOverride((args) => <IModelGridMUI {...args} />)
);

const baseArgs: IModelGridMUIProps = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  sortOptions: { sortType: "name", descending: false },
  onOpen: action("iModel opened"),
  onSelect: action("iModel selected"),
  iModelActions: [
    {
      key: "open",
      children: "Open iModel",
      onClick: (iModel) => {
        action("Open " + iModel?.displayName)(iModel);
      },
    },
    {
      key: "details",
      children: "View details",
      onClick: (iModel) => action("Details for " + iModel?.displayName)(iModel),
    },
  ],
  // tileOverrides: {
  //   onOpen: (iModel) => alert("Opened " + iModel.displayName),
  //   onSelect: (iModel) => action("Selected " + iModel.displayName),
  // },
};

export const Primary = Template.bind({});
Primary.args = { ...baseArgs };

export const PrimaryCell = Template.bind({});
PrimaryCell.args = {
  ...baseArgs,
  viewMode: "cells",
};

export const OverrideCellData = Template.bind({});
OverrideCellData.args = {
  ...baseArgs,
  viewMode: "cells",
  cellOverrides: {
    name: (props) =>
      props.value.includes("a") ? (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <IconButton
            aria-label="apple-icon"
            size="small"
            styleType="borderless"
          >
            <SvgApple />
          </IconButton>
          {props.value}
        </div>
      ) : (
        props.value
      ),
    description: (props) => <em>{props.value}</em>,
    hideColumns: [IModelCellColumn.CreatedDateTime],
  },
};

export const OverrideApiDataWithLoadMore: Story<IModelGridMUIProps> =
  withITwinIdOverride(
    withAccessTokenOverride((args) => {
      const [data, setData] = React.useState<IModelFull[]>(initialData);
      const [isLoading, setIsLoading] = React.useState(false);
      const [hasMore, setHasMore] = React.useState(true);

      const handleLoadMore = React.useCallback(async () => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setData((prev) => [...prev, ...additionalData]);
        setHasMore(false);
        setIsLoading(false);
      }, []);

      return (
        <ExternalComponent
          {...args}
          dataMode="external"
          apiOverrides={{
            data,
            isLoading,
            hasMoreData: hasMore,
          }}
          onLoadMore={handleLoadMore}
        />
      );
    })
  );

export const IndividualContextMenu = Template.bind({});
IndividualContextMenu.args = {
  ...baseArgs,
  iModelActions: [
    {
      children: "displayName contains 'R'",
      visible: (iModel: IModelFull) =>
        iModel.displayName?.toLowerCase().includes("r") ?? false,
      key: "withR",
      onClick: (iModel: IModelFull | undefined) =>
        alert("Contains R: " + iModel?.displayName),
    },
    {
      children: "Disabled if name contains 'T'",
      disabled: (iModel: IModelFull) =>
        iModel.displayName?.toLowerCase().includes("t") ?? false,
      key: "withT",
      onClick: (iModel: IModelFull | undefined) =>
        alert("Does not contain T: " + iModel?.displayName),
    },
    {
      children: "Add description",
      key: "addD",
      onClick: (iModel: IModelFull | undefined) =>
        alert("Add description: " + iModel?.displayName),
    },
    {
      children: "Edit description",
      visible: (iModel: IModelFull) => !!iModel.description,
      key: "editD",
      onClick: (iModel: IModelFull | undefined) =>
        alert("Edit description: " + iModel?.displayName),
    },
  ],
};

export const SimpleTilePropsOverrides = Template.bind({});
SimpleTilePropsOverrides.args = {
  ...baseArgs,
  tileOverrides: {
    getBadge: () => <Chip size="small" label="Tile Override" color="primary" />,
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
  },
};

export const StatefulPropsOverrides = Template.bind({});
StatefulPropsOverrides.args = {
  ...baseArgs,
  useIndividualState,
};

function addStartTileCallback(iModels: IModelFull[], status?: DataStatus) {
  if (status !== DataStatus.Complete) return iModels;

  iModels.unshift({
    id: "prepended",
    displayName: "Some Prepended iModel",
    description: "This iModel was added in the postProcessCallback",
  });
  return iModels;
}

export const WithPostProcessCallback = Template.bind({});
WithPostProcessCallback.args = {
  ...baseArgs,
  postProcessCallback: addStartTileCallback,
};

export const DefaultNoStateComponentOverride = Template.bind({});
DefaultNoStateComponentOverride.args = {
  ...baseArgs,
  emptyStateComponent: (
    <div>
      <Typography variant="h6">There are no iModels to show.</Typography>
    </div>
  ),
};

export const DisableAddToRecents = Template.bind({});
DisableAddToRecents.args = {
  ...baseArgs,
  disableAddToRecents: true,
};
DisableAddToRecents.argTypes = {
  accessToken: { table: { disable: true } },
  onOpen: { table: { disable: true } },
  onSelect: { table: { disable: true } },
  sortOptions: { table: { disable: true } },
  iModelActions: { table: { disable: true } },
  useIndividualState: { table: { disable: true } },
  tileOverrides: { table: { disable: true } },
  stringsOverrides: { table: { disable: true } },
  apiOverrides: { table: { disable: true } },
  postProcessCallback: { table: { disable: true } },
  emptyStateComponent: { table: { disable: true } },
  searchText: { table: { disable: true } },
  viewMode: { table: { disable: true } },
  pageSize: { table: { disable: true } },
  maxCount: { table: { disable: true } },
  cellOverrides: { table: { disable: true } },
  className: { table: { disable: true } },
};

export const Recents = Template.bind({});
Recents.args = {
  ...baseArgs,
  requestType: "recents",
};

export const RecentsWithCustomIcon = Template.bind({});
RecentsWithCustomIcon.args = {
  ...baseArgs,
  requestType: "recents",
  removeFromRecentsIcon: <Icon href={SvgDelete} />,
};
