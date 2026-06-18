/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  type IModelFull,
  type IModelTileProps,
} from "@itwin/imodel-browser-react/mui";
import React from "react";

import bridgeThumbnail from "../../utils/bridge.jpg";
import nightThumbnail from "../../utils/night.jpg";
import overpassThumbnail from "../../utils/overpass.jpg";
import powerThumbnail from "../../utils/power.jpg";

export const initialData: IModelFull[] = [
  {
    id: "1",
    displayName: "External iModel 1",
    description:
      "Loaded from external source with a nice long description to see how our layouts work.  It needs to be really long so we get a good representation.",
    thumbnail: bridgeThumbnail,
  },
  {
    id: "2",
    displayName: "External iModel 2",
    description: "",
    thumbnail: nightThumbnail,
  },
  {
    id: "3",
    displayName: "External iModel 3",
    description: "Pagination demo",
    thumbnail: overpassThumbnail,
  },
  {
    id: "4",
    displayName: "External iModel 4",
    description: "Initial batch of 6",
  },
  {
    id: "5",
    displayName: "External iModel 5",
    description: "More data",
    thumbnail: powerThumbnail,
  },
  {
    id: "6",
    displayName: "External iModel 6",
    description: "Last in first batch",
    thumbnail: bridgeThumbnail,
  },
];

export const additionalData: IModelFull[] = [
  {
    id: "7",
    displayName: "External iModel 7",
    description: "Loaded on demand via onLoadMore",
  },

  {
    id: "8",
    displayName: "External iModel 8",
    description: "Second batch",
  },
  {
    id: "9",
    displayName: "External iModel 9",
    description: "More paginated data",
    thumbnail: bridgeThumbnail,
  },
  {
    id: "10",
    displayName: "External iModel 10",
    description: "Second batch item",
  },
  {
    id: "11",
    displayName: "External iModel 11",
    description: "Second batch item",
  },
  {
    id: "12",
    displayName: "External iModel 12",
    description: "Last in second batch",
  },
];

/** Hook used in StatefulPropsOverrides.args, the function itself must be a stable reference as it is a hook. */
export const useIndividualState = (
  iModel: IModelFull,
  props: IModelTileProps
): IModelTileProps => {
  const tileProps = React.useMemo<Partial<IModelTileProps>>(
    () => ({
      actions: [
        {
          key: "default",
          label: `Open ${iModel.displayName}`,
          onClick: () => {},
        },
        { key: "vr", label: "Open in VR", onClick: () => {} },
      ],
    }),
    [iModel?.displayName]
  );

  return {
    ...props,
    ...tileProps,
  };
};
