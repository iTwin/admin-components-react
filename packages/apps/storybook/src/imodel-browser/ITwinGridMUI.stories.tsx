/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  ITwinGrid as ExternalComponent,
  type IndividualITwinStateHook,
  type ITwinGridProps,
  ITwinTile,
  DataStatus,
  type ITwinFull,
  ITwinCellColumn,
} from "@itwin/imodel-browser-react/mui";
import { SvgHeart } from "@itwin/itwinui-icons-react";
import { Code, IconButton } from "@itwin/itwinui-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";
import { action } from "@storybook/addon-actions";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import bridgeThumbnail from "../utils/bridge.jpg";
import powerThumbnail from "../utils/power.jpg";
import nightThumbnail from "../utils/night.jpg";
import overpassThumbnail from "../utils/overpass.jpg";
import Box from "@mui/material/Box";

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
  onOpen: (iTwin) => action("Open " + iTwin.displayName)(iTwin),
  onSelect: (iTwin) => action("Select " + iTwin.displayName)(iTwin),
};

export const Primary = Template.bind({});
Primary.args = {
  ...baseArgs,
};

export const TableView = Template.bind({});
TableView.args = {
  ...baseArgs,
  viewMode: "cells",
};

export const TableViewWithOverrides = Template.bind({});
TableViewWithOverrides.args = {
  ...baseArgs,
  viewMode: "cells",
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

  iTwinActions: [
    {
      children: "displayName contains 'R'",
      visible: (iTwin) => iTwin.displayName?.includes("R") ?? false,
      key: "withR",
      onClick: (iTwin) => action("Contains R" + iTwin?.displayName)(iTwin),
    },
    {
      children: "Add iTwinNumber",
      visible: (iTwin) => !iTwin.number,
      key: "addD",
      onClick: (iTwin) =>
        action("Add iTwinNumber to " + iTwin?.displayName)(iTwin),
    },
    {
      children: (iTwin) => `Edit iTwin ${iTwin.displayName}`,
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
    getBadge: () => <Chip size="small" label="Tile Override" />,
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

interface IModelMinimal {
  id: string;
  displayName: string;
}
interface IModelsFetchData {
  iModels: IModelMinimal[];
  _links: {
    prev: { href: string };
    next: { href: string };
    self: { href: string };
  };
}

/** Function used in useIndividualState */
const buildMenuItems =
  (
    close: () => void,
    setVersion: React.Dispatch<React.SetStateAction<IModelMinimal | undefined>>
  ) =>
  (v: IModelMinimal) => (
    <span
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {v.id === "loading" ? (
        <MenuItem>
          <Skeleton variant="rectangular" width="100%" height={24} />
        </MenuItem>
      ) : (
        <MenuItem
          key={v.id}
          onClick={() => {
            close();
            v.id !== "loading" && setVersion(v);
          }}
        >
          {v.displayName}
        </MenuItem>
      )}
    </span>
  );

/** Hook used in StatefulPropsOverrides.args, the function itself must be a stable reference as it is a hook. */
const useIndividualState: IndividualITwinStateHook = (iTwin, props) => {
  const [selection, setSelection] = React.useState<IModelMinimal | undefined>();

  const [imodels, setIModels] = React.useState<IModelMinimal[] | undefined>();
  // We delay network call until the user wants to query the data, this could be in an effect
  // but would automatically trigger for EVERY project, causing potentially huge network traffic at startup.
  const fetchIModelList = React.useCallback(
    async (
      url = `https://${
        props.gridProps.apiOverrides?.serverEnvironmentPrefix
          ? `${props.gridProps.apiOverrides?.serverEnvironmentPrefix}-`
          : ""
      }api.bentley.com/imodels/?iTwinId=${iTwin.id}&$top=10`
    ) => {
      try {
        // Show the skeleton, plus prevent further calls to this function.
        setIModels([
          {
            id: "loading",
            displayName: "",
          },
        ]);

        // Start the fetch
        const response = await fetch(url, {
          headers: {
            Authorization: (props.gridProps.accessToken as string) ?? "",
            Prefer: "return=minimal",
          },
        });
        if (response.ok) {
          const data: IModelsFetchData = await response.json();
          setIModels(data.iModels);
          if (data.iModels.length === 0) {
            setSelection({ displayName: "No iModels created", id: "none" });
          }
        }
      } catch (error) {
        // If an error occurs, clear the versions so they will be fetched again.
        setIModels(undefined);
        console.error(error);
      }
    },
    [
      iTwin.id,
      props.gridProps.accessToken,
      props.gridProps.apiOverrides?.serverEnvironmentPrefix,
    ]
  );
  // Create a memo of the tileProps we want to override, depending on the state.
  const tileProps = React.useMemo<Partial<ITwinTileType>>(
    () => ({
      actions:
        selection && selection.id !== "none"
          ? [
              {
                key: "create",
                label: "Create IModel",
                onClick: action("Create IModel clicked"),
              },
              {
                key: "open",
                label: "Open IModel",
                onClick: action("Open IModel clicked"),
              },
            ]
          : [
              {
                key: "create",
                label: "Create IModel",
                onClick: action("Create IModel clicked"),
              },
            ],
      headerRight: (
        <AvatarGroup max={3}>
          <Avatar alt="User 3" src="https://i.pravatar.cc/150?img=1" />
        </AvatarGroup>
      ),
      additionalContent: (
        <span
          onClick={async () => {
            imodels === undefined && (await fetchIModelList());
          }}
        >
          <Select
            label="Select iModel..."
            displayEmpty
            value={selection?.id ?? ""}
          >
            {imodels?.map(buildMenuItems(() => {}, setSelection)) ?? []}
          </Select>
        </span>
      ),
    }),
    [selection, imodels, fetchIModelList]
  );
  // TODO: verify
  return {
    ...props,
    ...tileProps,
  };
};

export const StatefulPropsOverrides = Template.bind({});
StatefulPropsOverrides.args = {
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
  iTwinActions: [
    {
      children: "Some action",
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
  iTwinActions: [
    {
      children: "Some action",
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
