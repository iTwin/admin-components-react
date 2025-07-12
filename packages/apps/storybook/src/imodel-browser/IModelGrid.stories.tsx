/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DataStatus,
  IModelFull,
  IModelGrid as ExternalComponent,
  IModelGridProps,
  IModelTileProps,
} from "@itwin/imodel-browser-react";
import { SvgStar } from "@itwin/itwinui-icons-react";
import {
  Button,
  Code,
  DropdownButton,
  IconButton,
  LabeledInput,
  MenuItem,
  MenuItemSkeleton,
  Text,
  Tile,
} from "@itwin/itwinui-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
  withITwinIdOverride,
} from "../utils/storyHelp";

type TileProps = React.ComponentPropsWithoutRef<typeof Tile>;

export const IModelGrid = (props: IModelGridProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "imodel-browser/IModelGrid",
  component: IModelGrid,
  argTypes: accessTokenArgTypes,
  excludeStories: ["IModelGrid"],
} as Meta;

const Template: Story<IModelGridProps> = withITwinIdOverride(
  withAccessTokenOverride((args) => <IModelGrid {...args} />)
);

export const Primary = Template.bind({});
Primary.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
};

export const PrimaryCell = Template.bind({});
PrimaryCell.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  viewMode: "cells",
};

export const OverrideCellData = Template.bind({});
OverrideCellData.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  viewMode: "cells",
  cellOverrides: {
    name: (props) => (
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <IconButton size="small" styleType="borderless">
          <SvgStar />
        </IconButton>
        {props.value}
      </div>
    ),
    description: (props) => <em>{props.value}</em>,
  },
};

export const OverrideApiData = Template.bind({});
OverrideApiData.args = {
  apiOverrides: {
    data: [
      {
        id: "1",
        displayName: "Provided iModel",
        description: "No Network Calls",
        thumbnail:
          "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/activity.svg",
      },
      {
        id: "2",
        displayName: "Useful iModel",
        description:
          "Use if the data comes from a different API or needs to be tweaked",
        thumbnail:
          "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/developer.svg",
      },
    ],
  },
};

export const IndividualContextMenu = Template.bind({});
IndividualContextMenu.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  iModelActions: [
    {
      children: "displayName contains 'R'",
      visible: (iModel) => iModel.displayName?.includes("R") ?? false,
      key: "withR",
      onClick: (iModel) => alert("Contains R" + iModel?.displayName),
    },
    {
      children: "Add description",
      visible: (iModel) => !iModel.description,
      key: "addD",
      onClick: (iModel) => alert("Add description" + iModel?.displayName),
    },
    {
      children: "Edit description",
      visible: (iModel) => !!iModel.description,
      key: "editD",
      onClick: (iModel) => alert("Edit description" + iModel?.displayName),
    },
  ],
};

export const SimpleTilePropsOverrides = Template.bind({});
SimpleTilePropsOverrides.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  tileOverrides: { tileProps: { style: { width: "100%" } } },
};

interface Version {
  id: string;
  displayName: string;
}
interface NamedVersionsFetchData {
  namedVersions: { displayName: string; id: string }[];
}

/** Function used in useIndividualState */
const buildMenuItems =
  (
    close: () => void,
    setVersion: React.Dispatch<React.SetStateAction<Version | undefined>>
  ) =>
  (v: Version) =>
    (
      <span
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {v.id === "loading" ? (
          <MenuItemSkeleton />
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
const useIndividualState = (iModel: IModelFull, props: IModelTileProps) => {
  const [selection, setSelection] = React.useState<Version | undefined>();
  const [versions, setVersions] = React.useState<Version[] | undefined>();
  // We delay network call until the user wants to query the data, this could be in an effect
  // but would automatically trigger for EVERY iModel, causing potentially huge network traffic at startup.
  const fetchVersionsList = React.useCallback(async () => {
    try {
      // Show the skeleton, plus prevent further calls to this function.
      setVersions([
        {
          id: "loading",
          displayName: "",
        },
      ]);
      // Start the fetch
      const response = await fetch(
        `https://${
          props.apiOverrides?.serverEnvironmentPrefix
            ? `${props.apiOverrides?.serverEnvironmentPrefix}-`
            : ""
        }api.bentley.com/imodels/${iModel.id}/namedversions`,
        {
          headers: {
            Authorization: (props.accessToken as string) ?? "",
            Prefer: "return=minimal",
            Accept: "application/vnd.bentley.itwin-platform.v2+json",
          },
        }
      );
      if (response.ok) {
        const data: NamedVersionsFetchData = await response.json();
        setVersions(data.namedVersions);
        if (data.namedVersions.length === 0) {
          setSelection({ displayName: "No version created", id: "none" });
        }
      }
    } catch (error) {
      // If an error occurs, clear the versions so they will be fetched again.
      setVersions(undefined);
      console.error(error);
    }
  }, [
    iModel.id,
    props.accessToken,
    props.apiOverrides?.serverEnvironmentPrefix,
  ]);
  // Create a memo of the tileProps we want to override, depending on the state.
  const tileProps = React.useMemo<Partial<TileProps>>(
    () => ({
      buttons:
        versions?.length === 0
          ? [<Button key="Create">Create version</Button>]
          : undefined,
      isNew: versions?.length === 0,
      metadata: (
        <span
          onClick={() => {
            versions === undefined && fetchVersionsList();
          }}
        >
          <DropdownButton
            menuItems={(close) =>
              versions?.map(buildMenuItems(close, setSelection)) ?? []
            }
          >
            <span>{selection?.displayName ?? "Select version..."}</span>
          </DropdownButton>
        </span>
      ),
    }),
    [fetchVersionsList, selection?.displayName, versions]
  );
  // Override the thumbnailClick so it receives the selected version too.
  // Not great typewise, but it is an example of what someone could do if it was really needed.
  const onThumbnailClick = React.useCallback(
    (iModel: IModelFull) => {
      (props.onThumbnailClick as any)?.(iModel, selection);
    },
    [props, selection]
  );
  return {
    onThumbnailClick,
    tileProps,
  };
};

export const StatefulPropsOverrides = Template.bind({});
StatefulPropsOverrides.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  useIndividualState,
};

export const WithPostProcessCallback: Story<IModelGridProps> =
  withITwinIdOverride(
    withAccessTokenOverride((args) => {
      const [filter, setFilter] = React.useState("");
      const filterOrAddStartTile = React.useCallback(
        (iModels: IModelFull[], status?: DataStatus) => {
          if (status !== DataStatus.Complete) {
            return iModels;
          }
          const filterText = filter.toLocaleLowerCase().trim();
          if (filterText) {
            return iModels.filter((iModel) =>
              iModel.displayName?.toLocaleLowerCase().includes(filterText)
            );
          }
          iModels.unshift({
            id: "newiModel",
            displayName: "New iModel",
            description: "Click on this tile to create a new iModel",
            thumbnail:
              "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/add.svg",
          });
          return iModels;
        },
        [filter]
      );
      return (
        <div>
          <Text variant="title">Description</Text>
          <Text as="p" variant="body">
            Property <Code>postProcessCallback</Code> allows modification of the
            data that is sent to the grid, here, we either apply a filter, or
            add a new tile at the start of the list for a 'New iModel' when
            there is no filter defined.
          </Text>
          <LabeledInput
            label={"Name filter"}
            onChange={(event) => {
              const {
                target: { value },
              } = event;
              setFilter(value);
            }}
          />
          <IModelGrid {...args} postProcessCallback={filterOrAddStartTile} />
        </div>
      );
    })
  );
WithPostProcessCallback.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
};
export const DefaultNoStateComponentOverride = Template.bind({});
DefaultNoStateComponentOverride.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  emptyStateComponent: (
    <div>
      <Text variant="title">There are no iModels to show.</Text>
    </div>
  ),
};
