/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { DropdownButton, MenuItem, TileProps } from "@bentley/itwinui-react";
import {
  IModelFull,
  IModelGrid as ExternalComponent,
  IModelGridProps,
  IModelTileProps,
} from "@itwin/imodel-browser";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
  withProjectIdOverride,
} from "../utils/storyHelp";

export const IModelGrid = (props: IModelGridProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "imodel-browser/IModelGrid",
  component: IModelGrid,
  argTypes: accessTokenArgTypes,
  excludeStories: ["IModelGrid"],
} as Meta;

const Template: Story<IModelGridProps> = withProjectIdOverride(
  withAccessTokenOverride((args) => <IModelGrid {...args} />)
);

export const Primary = Template.bind({});
Primary.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa-" },
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
  apiOverrides: { serverEnvironmentPrefix: "qa-" },
  iModelOptions: [
    {
      children: "displayName contains 'R'",
      visible: (iModel) => iModel.displayName?.includes("R") ?? false,
      key: "withR",
      onClick: (iModel) => alert("Contains R" + iModel.displayName),
    },
    {
      children: "Add description",
      visible: (iModel) => !iModel.description,
      key: "addD",
      onClick: (iModel) => alert("Add description" + iModel.displayName),
    },
    {
      children: "Edit description",
      visible: (iModel) => !!iModel.description,
      key: "editD",
      onClick: (iModel) => alert("Edit description" + iModel.displayName),
    },
  ],
};

export const SimpleTilePropsOverrides = Template.bind({});
SimpleTilePropsOverrides.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa-" },
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
const buildMenuItems = (
  close: () => void,
  setVersion: React.Dispatch<React.SetStateAction<Version | undefined>>
) => (v: Version) => (
  <span
    onClick={(event) => {
      event.stopPropagation();
    }}
  >
    <MenuItem
      key={v.id}
      onClick={() => {
        close();
        v.id !== "loading" && setVersion(v);
      }}
      className={v.id === "loading" ? "iui-skeleton" : undefined}
    >
      {v.displayName}
    </MenuItem>
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
        `https://${props.apiOverrides?.serverEnvironmentPrefix}api.bentley.com/imodels/${iModel.id}/namedversions`,
        {
          headers: {
            Authorization: props.accessToken ?? "",
            Prefer: "return=minimal",
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
          ? [<span key="Create">Create version</span>]
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
  // Override the thumbnailClick so it recieves the selected version too.
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
  apiOverrides: { serverEnvironmentPrefix: "qa-" },
  useIndividualState,
};
