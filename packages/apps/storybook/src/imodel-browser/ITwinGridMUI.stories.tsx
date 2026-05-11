/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { DataStatus } from "@itwin/imodel-browser-react";
import {
  ITwinGridMUI as ExternalComponent,
  IndividualITwinStateHookMUI,
  ITwinGridMUIProps,
} from "../../../../modules/imodel-browser/src/containers/ITwinGrid/ITwinGridMUI";
import { SvgHeart } from "@itwin/itwinui-icons-react";
import { Code, IconButton } from "@itwin/itwinui-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";
import { ITwinFull } from "@itwin/imodel-browser-react/src";
import { action } from "@storybook/addon-actions";
import {
  Avatar,
  AvatarGroup,
  Chip,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { ITwinTileMUI } from "@itwin/imodel-browser-react/src/containers/ITwinGrid/ITwinTileMUI";
import { ITwinCellColumn } from "@itwin/imodel-browser-react/src/types";

export type ITwinTileMUIType = React.ComponentPropsWithoutRef<
  typeof ITwinTileMUI
>;

export const ITwinGrid = (props: ITwinGridMUIProps) => (
  <ExternalComponent {...props} />
);

const accessToken = accessTokenArgTypes.accessToken;

const Template: Story<ITwinGridMUIProps> = withAccessTokenOverride((args) => (
  <ITwinGrid {...args} />
));

const baseArgs: ITwinGridMUIProps = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  viewMode: "tile",
  onOpen: (iTwin) => action("Open " + iTwin.displayName)(iTwin),
  onSelect: (iTwin) => action("Select " + iTwin.displayName)(iTwin),
};

export const Primary = Template.bind({});
Primary.args = {
  ...baseArgs,
};

export const OverrideCellData = Template.bind({});
OverrideCellData.args = {
  ...baseArgs,
  viewMode: "cells",
  cellOverrides: {
    ITwinNumber: (props) => (
      <strong>
        <IconButton
          size="small"
          styleType="borderless"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Icon Clicked");
          }}
        >
          <SvgHeart />
        </IconButton>{" "}
        {props.value}
      </strong>
    ),
    ITwinName: (props) => <i style={{ color: "red" }}>{props.value}</i>,
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
        displayName: "Provided iTwin",
        number: "No Network Calls",
      },
      {
        id: "2",
        displayName: "Useful iTwin",
        number:
          "Use if the data comes from a different API or needs to be tweaked",
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
      children: "Edit iTwinNumber",
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
    badge: <Chip size="small" label="Tile Override" color="primary" />,
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
const useIndividualState: IndividualITwinStateHookMUI = (iTwin, props) => {
  const [selection, setSelection] = React.useState<IModelMinimal | undefined>();
  const [links, setLinks] = React.useState<
    [string | undefined, string | undefined]
  >([undefined, undefined]);
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
        setLinks([undefined, undefined]);
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
          setLinks([
            data._links.prev?.href !== data._links.self.href
              ? data._links.prev?.href
              : undefined,
            data._links.next?.href !== data._links.self.href
              ? data._links.next?.href
              : undefined,
          ]);
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
  const tileProps = React.useMemo<Partial<ITwinTileMUIType>>(
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
          onClick={() => {
            imodels === undefined && fetchIModelList();
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
    [selection, imodels, fetchIModelList, links]
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

export const WithPostProcessCallback: Story<ITwinGridMUIProps> =
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

export default {
  title: "imodel-browser/ITwinGridMUI",
  component: ITwinGrid,
  argTypes: {
    accessToken,
  },
  excludeStories: ["ITwinGrid"],
} as Meta;
