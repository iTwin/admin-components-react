/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  type IModelFull,
  type IModelGridProps as IModelGridMUIProps,
  DataStatus,
  IModelCellColumn,
  IModelGrid as ExternalComponent,
} from "@itwin/imodel-browser-react/mui";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import SvgDelete from "@stratakit/icons/delete.svg";
import React from "react";

import bridgeThumbnail from "../../utils/bridge.jpg";
import nightThumbnail from "../../utils/night.jpg";
import {
  accessTokenArgTypes,
  withAccessTokenOverride,
  withITwinIdOverride,
} from "../../utils/storyHelp";
import {
  additionalData,
  initialData,
  useIndividualState,
} from "./IModelGridMUI.storybook-helpers";

export const IModelGridMUI = (props: IModelGridMUIProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "imodel-browser/IModelGridMUI",
  component: IModelGridMUI,
  argTypes: {
    ...accessTokenArgTypes,
    requestType: {
      options: ["all", "recents", "favorites"],
      mapping: {
        all: "",
        recents: "recents",
        favorites: "favorites",
      },
      control: {
        type: "radio",
      },
    },
    viewMode: {
      options: ["tile", "cells"],
      control: {
        type: "radio",
      },
    },
  },
  args: {
    requestType: "all",
  },
  excludeStories: ["IModelGridMUI"],
} as Meta;

const Template: Story<IModelGridMUIProps> = withITwinIdOverride(
  withAccessTokenOverride((args) => <IModelGridMUI {...args} />)
);

const baseArgs: IModelGridMUIProps = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  sortOptions: { sortType: "name", descending: false },
  actions: [
    {
      key: "open",
      label: (iModel) => iModel.displayName ?? "",
      onClick: (iModel) => action("iModel opened")(iModel),
    },
  ],
  moreActions: [
    {
      key: "open",
      label: "Open iModel",
      onClick: (iModel) => {
        action("Open " + iModel?.displayName)(iModel);
      },
    },
    {
      key: "details",
      label: "View details",
      onClick: (iModel) => action("Details for " + iModel?.displayName)(iModel),
    },
  ],
};

export const Primary = Template.bind({});
Primary.args = { ...baseArgs };

export const TableView = Template.bind({});
TableView.args = {
  ...baseArgs,
  viewMode: "cells",
};

export const TableViewWithOverrides = Template.bind({});
TableViewWithOverrides.args = {
  ...baseArgs,
  actions: [
    {
      key: "open",
      label: (iModel) => iModel.displayName ?? "",
      onClick: (iModel) => action("iModel opened")(iModel),
      disabled: (iModel) =>
        iModel.displayName?.toLowerCase().includes("t") ?? false,
    },
  ],
  viewMode: "cells",
  tableOverrides: {
    columnOverrides: {
      [IModelCellColumn.Name]: {
        renderCell: (params) =>
          params.formattedValue?.includes("*") ? (
            <div>
              {params.formattedValue}{" "}
              <Typography variant="caption">
                (redacted number in name)
              </Typography>
            </div>
          ) : (
            <div>
              {params.formattedValue}{" "}
              <Typography variant="caption">(no redactions)</Typography>
            </div>
          ),
        valueFormatter: (value, iModel) => {
          // replace any numbers with *
          return iModel.displayName?.replace(/[0-9]/g, "*");
        },
      },
      [IModelCellColumn.Description]: {
        renderCell: (params) => (
          <em>
            Add random number {Math.floor(Math.random() * 100)} to description
            &quot;{params.value}&quot;
          </em>
        ),
      },
    },
    hideColumns: [IModelCellColumn.LastModified],
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
          actions={[
            {
              key: "open",
              label: (iModel) => iModel.displayName ?? "",
              onClick: (iModel) => action("open action clicked")(iModel),
            },
            {
              key: "somethingElse",
              label: "Something else",
              onClick: (iModel) =>
                action("something else clicked " + iModel?.displayName)(iModel),
            },
          ]}
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

export const ContextualActions = Template.bind({});
ContextualActions.args = {
  ...baseArgs,
  actions: [
    {
      key: "withR",
      label: "displayName contains 'R'",
      visible: (iModel) =>
        iModel.displayName?.toLowerCase().includes("r") ?? false,
    },
  ],
  moreActions: [
    {
      label: "displayName contains 'R'",
      visible: (iModel: IModelFull) =>
        iModel.displayName?.toLowerCase().includes("r") ?? false,
      key: "withR",
      onClick: (iModel: IModelFull | undefined) =>
        action("Contains R: " + iModel?.displayName)(iModel),
    },
    {
      label: "Disabled if name contains 'T'",
      disabled: (iModel: IModelFull) =>
        iModel.displayName?.toLowerCase().includes("t") ?? false,
      key: "withT",
      onClick: (iModel: IModelFull | undefined) =>
        action("Does not contain T: " + iModel?.displayName)(iModel),
    },
    {
      label: "Add description",
      key: "addD",
      onClick: (iModel: IModelFull | undefined) =>
        action("Add description: " + iModel?.displayName)(iModel),
    },
    {
      label: "Edit description",
      visible: (iModel: IModelFull) => !!iModel.description,
      key: "editD",
      onClick: (iModel: IModelFull | undefined) =>
        action("Edit description: " + iModel?.displayName)(iModel),
    },
  ],
};

export const SimpleTilePropsOverrides = Template.bind({});
SimpleTilePropsOverrides.args = {
  ...baseArgs,
  tileOverrides: {
    thumbnail: bridgeThumbnail,
    thumbnailBottomRight: <Chip size="small" label="Tile Bottom Right" />,
    thumbnailBottomLeft: <Chip size="small" label="Thumbnail Bottom Left " />,
    thumbnailTopLeft: (
      <AvatarGroup max={3}>
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
  if (status !== DataStatus.Complete) {
    return iModels;
  }

  iModels.unshift({
    id: "prepended",
    displayName: "Some Prepended iModel",
    description: "This iModel was added in the postProcessCallback",
    thumbnail: nightThumbnail,
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
      {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
      <Typography variant="h2" render={<h2 />}>
        There are no iModels to show.
      </Typography>
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
  actions: { table: { disable: true } },
  sortOptions: { table: { disable: true } },
  moreActions: { table: { disable: true } },
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
  tableOverrides: { table: { disable: true } },
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
  removeFromRecentsIcon: SvgDelete,
};

export const NoResultsWithDefaultEmptyState = Template.bind({});
NoResultsWithDefaultEmptyState.args = {
  ...baseArgs,
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  postProcessCallback: (iModels, status) => {
    return [];
  },
};

export const StringsOverrideGrid = Template.bind({});
StringsOverrideGrid.args = {
  ...baseArgs,
  moreActions: [
    {
      label: "Some action",
      key: "something",
      onClick: (iModel) => action("clicked " + iModel?.displayName)(iModel),
    },
  ],
  stringsOverrides: {
    moreOptions: "Fleiri valkostir",
    addToFavorites: "Bæta við eftirlæti",
    removeFromFavorites: "Fjarlægja úr eftirlætum",
    tableColumnName: "Heiti iModel",
    tableColumnDescription: "Lýsing iModel",
    tableColumnLastModified: "Síðast breytt",
    noRowsLabel: "Engar raðir",
    noResultsOverlayLabel: "Engar niðurstöður fundust.",
    paginationRowsPerPage: "Raðir á síðu:",
    footerRowSelected: (count: number) =>
      count !== 1
        ? `${count.toLocaleString()} raðir valdar`
        : `${count.toLocaleString()} röð valin`,
    footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
      `${visibleCount.toLocaleString()} af ${totalCount.toLocaleString()}`,
  },
};

export const StringsOverrideTable = Template.bind({});
StringsOverrideTable.args = {
  ...baseArgs,
  viewMode: "cells",

  moreActions: [
    {
      label: "Some action",
      key: "something",
      onClick: (iModel) => action("clicked " + iModel?.displayName)(iModel),
    },
  ],
  stringsOverrides: {
    moreOptions: "Fleiri valkostir",
    addToFavorites: "Bæta við eftirlæti",
    removeFromFavorites: "Fjarlægja úr eftirlætum",
    tableColumnName: "Heiti iModel",
    tableColumnDescription: "Lýsing iModel",
    tableColumnLastModified: "Síðast breytt",
    noRowsLabel: "Engar raðir",
    noResultsOverlayLabel: "Engar niðurstöður fundust.",
    paginationRowsPerPage: "Raðir á síðu:",
    footerRowSelected: (count: number) =>
      count !== 1
        ? `${count.toLocaleString()} raðir valdar`
        : `${count.toLocaleString()} röð valin`,
    footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
      `${visibleCount.toLocaleString()} af ${totalCount.toLocaleString()}`,
  },
};
