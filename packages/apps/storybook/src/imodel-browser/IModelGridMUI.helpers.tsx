/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Select from "@mui/material/Select";
import { type IModelFull } from "../../../../../packages/modules/imodel-browser/src/types";
import type { IModelTileMUIProps } from "../../../../modules/imodel-browser/src/containers/iModelTiles/IModelTileMUI";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { action } from "@storybook/addon-actions";

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

/** Hook used in StatefulPropsOverrides.args, the function itself must be a stable reference as it is a hook. */
export const useIndividualState = (
  iModel: IModelFull,
  props: IModelTileMUIProps
): IModelTileMUIProps => {
  // random versions
  const versions = React.useMemo(() => {
    return [
      { id: "v1", displayName: `${iModel.displayName} v1` },
      { id: "v2", displayName: `${iModel.displayName} v2` },
      { id: "v3", displayName: `${iModel.displayName} v3` },
    ];
  }, [iModel.displayName]);

  // Create a memo of the tileProps we want to override, depending on the state.
  const tileProps = React.useMemo<Partial<IModelTileMUIProps>>(
    () => ({
      actions: [
        {
          key: "default",
          label: `Open ${iModel.displayName}`,
          onClick: () => {},
        },
        { key: "vr", label: "Open in VR", onClick: () => {} },
      ],
      isNew: versions?.length === 0,
      additionalContent: (
        <Select label="Select iModel..." value={versions[1].id}>
          {versions?.map((v) => (
            <MenuItem
              key={v.id}
              value={v.id}
              onClick={action(`Selected ${v.id}`)}
            >
              {v.displayName}
            </MenuItem>
          ))}
        </Select>
      ),
    }),
    [iModel?.displayName, versions]
  );

  return {
    ...props,
    ...tileProps,
  };
};
