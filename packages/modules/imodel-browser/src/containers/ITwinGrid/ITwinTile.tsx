/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Badge, Tile, TileProps } from "@itwin/itwinui-react";
import React from "react";

import ITwinIcon from "../../images/itwin.svg";
import { ITwinFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import {
  _buildManagedContextMenuOptions,
  ContextMenuBuilderItem,
} from "../../utils/_buildMenuOptions";

export interface ITwinTileProps {
  /** iTwin to display */
  iTwin: ITwinFull;
  /** List of options to build for the iTwin context menu */
  iTwinOptions?: ContextMenuBuilderItem<ITwinFull>[];
  /** Function to call on thumbnail click */
  onThumbnailClick?(iTwin: ITwinFull): void;
  /** Strings displayed by the browser */
  stringsOverrides?: {
    /** Badge text for trial iTwins */
    trialBadge?: string;
    /** Badge text for inactive iTwins */
    inactiveBadge?: string;
  };
  /** Tile props that will be applied after normal use. (Will override ITwinTile if used) */
  tileProps?: Partial<TileProps>;
}

/**
 * Representation of an iTwin
 */
export const ITwinTile = ({
  iTwin,
  iTwinOptions,
  onThumbnailClick,
  tileProps,
  stringsOverrides,
}: ITwinTileProps) => {
  const strings = _mergeStrings(
    {
      trialBadge: "Trial",
      inactiveBadge: "Inactive",
    },
    stringsOverrides
  );

  const moreOptions = React.useMemo(
    () => _buildManagedContextMenuOptions(iTwinOptions, iTwin),
    [iTwinOptions, iTwin]
  );
  return (
    <Tile
      key={iTwin?.id}
      name={<span title={iTwin?.displayName}>{iTwin?.displayName}</span>}
      description={<span title={iTwin?.number}>{iTwin?.number ?? ""}</span>}
      badge={
        iTwin?.status &&
        iTwin.status.toLocaleLowerCase() !== "active" && (
          <Badge
            backgroundColor={
              iTwin.status.toLocaleLowerCase() === "inactive"
                ? "#A47854" /** $iui-color-background-oak */
                : "#4585A5" /** $iui-color-background-steelblue */
            }
          >
            {iTwin.status.toLocaleLowerCase() === "inactive"
              ? strings.inactiveBadge
              : strings.trialBadge}
          </Badge>
        )
      }
      moreOptions={moreOptions}
      thumbnail={
        <span
          onClick={() => onThumbnailClick?.(iTwin)}
          style={{ cursor: onThumbnailClick ? "pointer" : "auto" }}
        >
          <ITwinIcon />
        </span>
      }
      {...(tileProps ?? {})}
    />
  );
};
