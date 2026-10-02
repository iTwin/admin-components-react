/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  type IndividualITwinStateHook,
  type ITwinDataQuery,
  type ITwinDataState,
  type ITwinFull,
  type ITwinGridProps,
  type ITwinSortOptionsMUI,
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
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import React from "react";
import { action } from "storybook/actions";
import { fn } from "storybook/test";

import bridgeThumbnail from "../../utils/bridge.jpg";
import nightThumbnail from "../../utils/night.jpg";
import overpassThumbnail from "../../utils/overpass.jpg";
import powerThumbnail from "../../utils/power.jpg";
import { accessTokenArgTypes } from "../../utils/storyHelp";

type ITwinTileType = React.ComponentPropsWithoutRef<typeof ITwinTile>;

export const ITwinGrid = (props: ITwinGridProps) => (
  <ExternalComponent {...props} />
);

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
  onSortOptionsChange: undefined,
};

export const Primary: StoryObj<typeof ITwinGrid> = {
  args: {
    ...baseArgs,
  },
};

export const TableView: StoryObj<typeof ITwinGrid> = {
  args: {
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
  },
};

export const TableViewWithOverrides: StoryObj<typeof ITwinGrid> = {
  args: {
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
  },
};

const TableWithControlledSortRender = (args: ITwinGridProps) => {
  const [sortOptions, setSortOptions] = React.useState<
    ITwinSortOptionsMUI | undefined
  >({ field: "number", direction: "desc" });
  const field = sortOptions?.field;
  const direction = sortOptions?.direction ?? "asc";

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 8,
          alignItems: "center",
        }}
      >
        <Typography variant="body2">Sort by:</Typography>
        <Chip
          label="iTwin Number"
          clickable
          variant={field === "number" ? "filled" : "outlined"}
          onClick={() => setSortOptions({ field: "number", direction })}
        />
        <Chip
          label="iTwin Name"
          clickable
          variant={field === "displayName" ? "filled" : "outlined"}
          onClick={() => setSortOptions({ field: "displayName", direction })}
        />
        <Chip
          label="Last Modified"
          clickable
          variant={field === "lastModifiedDateTime" ? "filled" : "outlined"}
          onClick={() =>
            setSortOptions({ field: "lastModifiedDateTime", direction })
          }
        />
        <Chip
          label={direction === "desc" ? "↓ Descending" : "↑ Ascending"}
          clickable
          variant="outlined"
          onClick={() =>
            setSortOptions(
              (prev) =>
                prev && {
                  ...prev,
                  direction: prev.direction === "desc" ? "asc" : "desc",
                }
            )
          }
        />
      </div>
      <ExternalComponent
        {...args}
        sortOptions={sortOptions}
        onSortOptionsChange={(newSortOptions) => {
          action("sort options changed")(newSortOptions);
          setSortOptions(newSortOptions);
        }}
      />
    </div>
  );
};

export const TableWithControlledSort: StoryObj<typeof ITwinGrid> = {
  render: (args) => <TableWithControlledSortRender {...args} />,
  args: { ...baseArgs, viewMode: "cells" },
  parameters: {
    docs: {
      description: {
        story:
          "The sort state is fully controlled by the parent via `sortOptions` and `onSortOptionsChange`, so it can be saved anywhere the consumer wants.",
      },
    },
  },
};

export const OverrideApiData: StoryObj<typeof ITwinGrid> = {
  args: {
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
  },
};

export const IndividualContextMenu: StoryObj<typeof ITwinGrid> = {
  args: {
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
  },
};

export const SimpleTilePropsOverrides: StoryObj<typeof ITwinGrid> = {
  args: {
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

export const UseIndividualState: StoryObj<typeof ITwinGrid> = {
  args: {
    apiOverrides: { serverEnvironmentPrefix: "qa" },
    useIndividualState,
  },
};

const WithPostProcessCallbackRender = (args: ITwinGridProps) => {
  const addStartTile = React.useCallback((iTwins: ITwinFull[], status: any) => {
    if (status !== (DataStatus as any).Complete) {
      return iTwins;
    }
    iTwins.unshift({
      id: "newProject",
      displayName: "New Project",
      number: "Click on this tile to create a new ITwin",
    });
    return iTwins;
  }, []);
  return (
    <div>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Property <Code>postProcessCallback</Code> allows modification of the
        data that is sent to the grid, here, we add a new tile at the start of
        the list for a &apos;New Project&apos;.
      </Typography>
      <ITwinGrid {...args} postProcessCallback={addStartTile} />
    </div>
  );
};

export const WithPostProcessCallback: StoryObj<typeof ITwinGrid> = {
  render: (args) => <WithPostProcessCallbackRender {...args} />,
  args: {
    apiOverrides: { serverEnvironmentPrefix: "qa" },
  },
};

const describeQuery = (query: ITwinDataQuery) =>
  `${query.requestType || "all"}${
    query.filterText ? ` "${query.filterText}"` : ""
  }`;

const WithOnDataStateChangeRender = ({
  onDataStateChange: reportToActionsPanel,
  ...args
}: ITwinGridProps) => {
  const [log, setLog] = React.useState<string[]>([]);
  const fetchStartedAt = React.useRef<Record<string, number>>({});

  const onDataStateChange = React.useCallback(
    (state: ITwinDataState) => {
      reportToActionsPanel?.(state);

      const query = describeQuery(state.query);
      const append = (line: string) =>
        setLog((log) => [`${query}: ${line}`, ...log].slice(0, 12));

      if (state.status === DataStatus.Fetching) {
        fetchStartedAt.current[query] = performance.now();
        append("fetching");
        return;
      }

      const startedAt = fetchStartedAt.current[query];
      const timing =
        startedAt === undefined
          ? "from the iTwins already loaded"
          : `after ${Math.round(performance.now() - startedAt)}ms`;
      append(
        [
          `${state.status} ${timing}`,
          `${state.iTwins.length} iTwins`,
          state.hasMore ? "more pages remain" : undefined,
          state.error ? String(state.error) : undefined,
        ]
          .filter(Boolean)
          .join(", ")
      );
    },
    [reportToActionsPanel]
  );

  return (
    <div>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Property <Code>onDataStateChange</Code> reports the grid&apos;s data
        state as it changes, newest first, and sends each report to the Actions
        panel. Search to see a query reported before its result. The favorites
        and recents tabs answer a search from the iTwins they already hold, so
        they report a result with no fetch before it.
      </Typography>
      <Box
        sx={{
          mb: 2,
          p: 1,
          height: "12rem",
          overflowY: "auto",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {log.length === 0 ? (
          <Typography variant="body2">Nothing reported yet.</Typography>
        ) : (
          log.map((line, index) => (
            <Typography key={index} variant="body2">
              <Code>{line}</Code>
            </Typography>
          ))
        )}
      </Box>
      <ITwinGrid {...args} onDataStateChange={onDataStateChange} />
    </div>
  );
};

export const WithOnDataStateChange: StoryObj<typeof ITwinGrid> = {
  render: (args) => <WithOnDataStateChangeRender {...args} />,
  args: {
    apiOverrides: { serverEnvironmentPrefix: "qa" },
  },
};

export const FetchAllSubclasses: StoryObj<typeof ITwinGrid> = {
  args: {
    apiOverrides: { serverEnvironmentPrefix: "qa" },
    iTwinSubClass: "All",
  },
};

export const NoResultsWithDefaultEmptyState: StoryObj<typeof ITwinGrid> = {
  args: {
    ...baseArgs,
    apiOverrides: { serverEnvironmentPrefix: "qa" },
    postProcessCallback: (iModels, status) => {
      return [];
    },
  },
};

export const TableViewWithNoResults: StoryObj<typeof ITwinGrid> = {
  args: {
    ...baseArgs,
    viewMode: "cells",
    postProcessCallback: (iModels, status) => {
      return [];
    },
  },
};

export const StringsOverrideGrid: StoryObj<typeof ITwinGrid> = {
  args: {
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
  },
};

export const StringsOverrideTable: StoryObj<typeof ITwinGrid> = {
  args: {
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
  },
};

export default {
  title: "imodel-browser/ITwinGridMUI",
  component: ITwinGrid,
  argTypes: {
    ...accessTokenArgTypes,
    viewMode: {
      options: ["tile", "cells"],
      control: {
        type: "radio",
      },
    },
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
  },
  args: {
    requestType: "all",
    onDataStateChange: fn(),
  },
  excludeStories: ["ITwinGrid"],
} as Meta;
