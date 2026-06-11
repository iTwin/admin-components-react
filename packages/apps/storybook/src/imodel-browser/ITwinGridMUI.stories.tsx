/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  type IndividualITwinStateHook,
  type ITwinFull,
  type ITwinGridProps,
  DataStatus,
  ITwinCellColumn,
  ITwinGrid as ExternalComponent,
  ITwinTile,
} from "@itwin/imodel-browser-react/mui";
import { SvgHeart } from "@itwin/itwinui-icons-react";
import { Code, IconButton } from "@itwin/itwinui-react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import bridgeThumbnail from "../utils/bridge.jpg";
import nightThumbnail from "../utils/night.jpg";
import overpassThumbnail from "../utils/overpass.jpg";
import powerThumbnail from "../utils/power.jpg";
import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";

type ITwinTileType = React.ComponentPropsWithoutRef<typeof ITwinTile>;

export const ITwinGrid = (props: ITwinGridProps) => (
  <ExternalComponent {...props} />
);

const accessToken = accessTokenArgTypes.accessToken;

const Template: Story<ITwinGridProps> = withAccessTokenOverride((args) => (
  <ITwinGrid {...args} />
));

const baseArgs: ITwinGridProps = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  viewMode: "tile",
  actions: [
    {
      key: "open",
      label: (iTwin) => iTwin.displayName ?? "",
      onClick: (iTwin) => action("Open " + iTwin.displayName)(iTwin),
    },
  ],
};

export const Primary = Template.bind({});
Primary.args = {
  ...baseArgs,
};

export const TableView = Template.bind({});
TableView.args = {
  ...baseArgs,
  viewMode: "cells",
  moreActions: [
    {
      label: "Some action",
      key: "something",
      onClick: (iTwin) => action("clicked " + iTwin?.displayName)(iTwin),
    },
    {
      label: "Some other action",
      key: "something-else",
      onClick: (iTwin) =>
        action("clicked something else " + iTwin?.displayName)(iTwin),
    },
  ],
};

export const TableViewWithOverrides = Template.bind({});
TableViewWithOverrides.args = {
  ...baseArgs,
  viewMode: "cells",
  actions: [
    {
      key: "open",
      label: (iTwin) => iTwin.displayName ?? "",
      onClick: (iTwin) => action("Open " + iTwin.displayName)(iTwin),
      disabled: (iTwin) =>
        iTwin.displayName?.toLowerCase().includes("t") ?? false,
    },
  ],
  tableOverrides: {
    columnOverrides: {
      [ITwinCellColumn.Number]: {
        renderCell: (params) => (
          <div>
            <IconButton
              size="small"
              styleType="borderless"
              onClick={(e) => {
                e.stopPropagation();
                action("Icon Clicked")();
              }}
            >
              <SvgHeart />
            </IconButton>{" "}
            {params.formattedValue}
          </div>
        ),
      },
      [ITwinCellColumn.Name]: {
        renderCell: (params) => (
          <Box sx={{ display: "inline-block", transform: "rotate(180deg)" }}>
            {params.value}
          </Box>
        ),
      },
    },
    hideColumns: [ITwinCellColumn.LastModified],
  },
};

export const OverrideApiData = Template.bind({});
OverrideApiData.args = {
  ...baseArgs,
  apiOverrides: {
    data: [
      {
        id: "1",
        displayName: "Bridge iTwin",
        number: "No Network Calls",
        image: bridgeThumbnail,
      },
      {
        id: "2",
        displayName: "Power iTwin",
        number: "aaa-bbb-ccc",
        image: powerThumbnail,
      },
      {
        id: "3",
        displayName: "Overpass iTwin",
        number: "No Network Calls",
        image: overpassThumbnail,
      },

      {
        id: "4",
        displayName: "Highway iTwin",
        number: "No Network Calls",
        image: nightThumbnail,
      },
    ],
  },
};

export const IndividualContextMenu = Template.bind({});
IndividualContextMenu.args = {
  ...baseArgs,
  moreActions: [
    {
      label: "displayName contains 'R'",
      visible: (iTwin) => iTwin.displayName?.includes("R") ?? false,
      key: "withR",
      onClick: (iTwin) => action("Contains R" + iTwin?.displayName)(iTwin),
    },
    {
      label: "Add iTwinNumber",
      visible: (iTwin) => !iTwin.number,
      key: "addD",
      onClick: (iTwin) =>
        action("Add iTwinNumber to " + iTwin?.displayName)(iTwin),
    },
    {
      label: (iTwin) => `Edit iTwin ${iTwin.displayName}`,
      visible: (iTwin) => !!iTwin.number,
      key: "editD",
      onClick: (iTwin) => action("Edit iTwinNumber: " + iTwin?.number)(iTwin),
    },
  ],
};

export const SimpleTilePropsOverrides = Template.bind({});
SimpleTilePropsOverrides.args = {
  ...baseArgs,
  tileOverrides: {
    status: "negative",
    thumbnail: bridgeThumbnail,
    thumbnailBottomLeft: <Chip size="small" label="Bottom Left Override" />,
    thumbnailBottomRight: <Chip size="small" label="Bottom Right Override" />,
    thumbnailTopLeft: (
      <AvatarGroup max={3}>
        <Avatar alt="User 1" src="https://i.pravatar.cc/150?img=1" />
        <Avatar alt="User 2" src="https://i.pravatar.cc/150?img=2" />
        <Avatar alt="User 3" src="https://i.pravatar.cc/150?img=3" />
      </AvatarGroup>
    ),
  },
};

const useIndividualState: IndividualITwinStateHook = (iTwin, props) => {
  const tileProps = React.useMemo<Partial<ITwinTileType>>(
    () => ({
      actions: [
        {
          key: "create",
          label: "Create iModel",
          onClick: action("Create iModel clicked"),
        },
        {
          key: "open",
          label: `Open ${iTwin.displayName}`,
          onClick: action(`Open ${iTwin.displayName} clicked`),
        },
      ],
      thumbnailTopLeft: (
        <AvatarGroup max={3}>
          <Avatar alt="User 3" src="https://i.pravatar.cc/150?img=1" />
        </AvatarGroup>
      ),
    }),
    [iTwin.displayName]
  );

  return {
    ...props,
    ...tileProps,
  };
};

export const UseIndividualState = Template.bind({});
UseIndividualState.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  useIndividualState,
};

export const WithPostProcessCallback: Story<ITwinGridProps> =
  withAccessTokenOverride((args) => {
    const addStartTile = React.useCallback(
      (iTwins: ITwinFull[], status: any) => {
        if (status !== (DataStatus as any).Complete) {
          return iTwins;
        }
        iTwins.unshift({
          id: "newProject",
          displayName: "New Project",
          number: "Click on this tile to create a new ITwin",
        });
        return iTwins;
      },
      []
    );
    return (
      <div>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Property <Code>postProcessCallback</Code> allows modification of the
          data that is sent to the grid, here, we add a new tile at the start of
          the list for a 'New Project'.
        </Typography>
        <ITwinGrid {...args} postProcessCallback={addStartTile} />
      </div>
    );
  });
WithPostProcessCallback.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
};

export const FetchAllSubclasses = Template.bind({});
FetchAllSubclasses.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  iTwinSubClass: "All",
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
  apiOverrides: {
    data: [
      {
        id: "1",
        displayName: "Bridge iTwin",
        number: "1111-2222-3333-4444",
        image: bridgeThumbnail,
        status: "Trial",
      },
      {
        id: "2",
        displayName: "Power iTwin",
        number: "2222-3333-4444-5555",
        image: powerThumbnail,
        status: "Inactive",
      },
      {
        id: "3",
        displayName: "Highway iTwin",
        number: "3333-4444-5555-6666",
        image: nightThumbnail,
      },
    ],
  },
  moreActions: [
    {
      label: "Some action",
      key: "something",
      onClick: (iTwin) => action("clicked " + iTwin?.displayName)(iTwin),
    },
  ],
  stringsOverrides: {
    moreOptions: "Flere muligheder",
    trialBadge: "Prøveversion",
    inactiveBadge: "Inaktiv",
    addToFavorites: "Føj til favoritter",
    removeFromFavorites: "Fjern fra favoritter",
    noRowsLabel: "Ingen rækker",
    noResultsOverlayLabel: "Ingen resultater fundet.",
    footerRowSelected: (count: number) =>
      count !== 1
        ? `${count.toLocaleString()} rækker valgt`
        : `${count.toLocaleString()} række valgt`,
    footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
      `${visibleCount.toLocaleString()} af ${totalCount.toLocaleString()}`,
    paginationRowsPerPage: "Rækker per side:",
  },
};

export const StringsOverrideTable = Template.bind({});
StringsOverrideTable.args = {
  ...baseArgs,
  viewMode: "cells",
  apiOverrides: {
    data: [
      {
        id: "1",
        displayName: "Bridge iTwin",
        number: "1111-2222-3333-4444",
        image: bridgeThumbnail,
        status: "Trial",
      },
      {
        id: "2",
        displayName: "Power iTwin",
        number: "2222-3333-4444-5555",
        image: powerThumbnail,
        status: "Inactive",
      },
      {
        id: "3",
        displayName: "Highway iTwin",
        number: "3333-4444-5555-6666",
        image: nightThumbnail,
      },
    ],
  },
  moreActions: [
    {
      label: "Some action",
      key: "something",
      onClick: (iTwin) => action("clicked " + iTwin?.displayName)(iTwin),
    },
  ],
  stringsOverrides: {
    moreOptions: "Flere muligheder",
    trialBadge: "Prøveversion",
    inactiveBadge: "Inaktiv",
    addToFavorites: "Føj til favoritter",
    removeFromFavorites: "Fjern fra favoritter",
    tableColumnName: "iTwin Navn",
    tableColumnDescription: "iTwin Beskrivelse",
    tableColumnLastModified: "Sidst ændret",
    noRowsLabel: "Ingen rækker",
    noResultsOverlayLabel: "Ingen resultater fundet.",
    footerRowSelected: (count: number) =>
      count !== 1
        ? `${count.toLocaleString()} rækker valgt`
        : `${count.toLocaleString()} række valgt`,
    footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
      `${visibleCount.toLocaleString()} af ${totalCount.toLocaleString()}`,
    paginationRowsPerPage: "Rækker per side:",
  },
};

export default {
  title: "imodel-browser/ITwinGridMUI",
  component: ITwinGrid,
  argTypes: {
    accessToken,
  },
  excludeStories: ["ITwinGrid"],
} as Meta;
