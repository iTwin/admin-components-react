/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Select from "@mui/material/Select";
import { type IModelFull } from "../../../../../packages/modules/imodel-browser/src/types";
import type { IModelTileMUIProps } from "../../../../modules/imodel-browser/src/containers/iModelTiles/IModelTileMUI";
import {
  Button,
  DropdownButton,
  MenuItem,
  MenuItemSkeleton,
  Tile,
} from "@itwin/itwinui-react";
import React from "react";

type TileProps = React.ComponentPropsWithoutRef<typeof Tile>;

export const initialData: IModelFull[] = [
  {
    id: "1",
    displayName: "External iModel 1",
    description: "Loaded from external source",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/activity.svg",
  },
  {
    id: "2",
    displayName: "External iModel 2",
    description: "Consumer manages pagination",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/developer.svg",
  },
  {
    id: "3",
    displayName: "External iModel 3",
    description: "Pagination demo",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/folder.svg",
  },
  {
    id: "4",
    displayName: "External iModel 4",
    description: "Initial batch of 6",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/organization.svg",
  },
  {
    id: "5",
    displayName: "External iModel 5",
    description: "More data",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/settings.svg",
  },
  {
    id: "6",
    displayName: "External iModel 6",
    description: "Last in first batch",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/tools.svg",
  },
];

export const additionalData: IModelFull[] = [
  {
    id: "7",
    displayName: "External iModel 7",
    description: "Loaded on demand via onLoadMore",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/folder.svg",
  },
  {
    id: "8",
    displayName: "External iModel 8",
    description: "Second batch",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/organization.svg",
  },
  {
    id: "9",
    displayName: "External iModel 9",
    description: "More paginated data",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/settings.svg",
  },
  {
    id: "10",
    displayName: "External iModel 10",
    description: "Second batch item",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/tools.svg",
  },
  {
    id: "11",
    displayName: "External iModel 11",
    description: "Second batch item",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/activity.svg",
  },
  {
    id: "12",
    displayName: "External iModel 12",
    description: "Last in second batch",
    thumbnail:
      "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/developer.svg",
  },
];

/** Function used in useIndividualState */
const buildMenuItems =
  (
    close: () => void,
    setVersion: React.Dispatch<React.SetStateAction<Version | undefined>>
  ) =>
  (v: Version) => (
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

interface Version {
  id: string;
  displayName: string;
}
interface NamedVersionsFetchData {
  namedVersions: { displayName: string; id: string }[];
}

/** Hook used in StatefulPropsOverrides.args, the function itself must be a stable reference as it is a hook. */
export const useIndividualState = (
  iModel: IModelFull,
  props: IModelTileMUIProps
) => {
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
      additionalContent: (
        <span
          onClick={() => {
            versions === undefined && fetchVersionsList();
          }}
        >
          <Select
            label="Select iModel..."
            displayEmpty
            value={selection?.id ?? ""}
          >
            {versions?.map(buildMenuItems(close, setSelection)) ?? []}
          </Select>
        </span>
      ),
    }),
    [fetchVersionsList, selection?.displayName, versions]
  );
  // Override the thumbnailClick so it receives the selected version too.
  // Not great typewise, but it is an example of what someone could do if it was really needed.
  const onSelect = React.useCallback(
    (iModel: IModelFull) => {
      props.onSelect?.(iModel);
    },
    [props, selection]
  );
  return {
    onSelect,
    tileProps,
  };
};
