/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./ITwinTile.scss";

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
  /** itwin to display */
  itwin: ITwinFull;
  /** List of options to build for the itwin context menu */
  itwinOptions?: ContextMenuBuilderItem<ITwinFull>[];
  /** Function to call on thumbnail click */
  onThumbnailClick?(itwin: ITwinFull): void;
  /** Strings displayed by the browser */
  stringsOverrides?: {
    /** Badge text for trial itwins */
    trialBadge?: string;
    /** Badge text for inactive itwins */
    inactiveBadge?: string;
  };
  /** Tile props that will be applied after normal use. (Will override ITwinTile if used) */
  tileProps?: Partial<TileProps>;
}

/**
 * Representation of an ITwin
 */
export const ITwinTile = ({
  itwin,
  itwinOptions,
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
    () => _buildManagedContextMenuOptions(itwinOptions, itwin),
    [itwinOptions, itwin]
  );
  return (
    <Tile
      key={itwin?.id}
      name={<span title={itwin?.displayName}>{itwin?.displayName}</span>}
      description={<span title={itwin?.number}>{itwin?.number ?? ""}</span>}
      badge={
        itwin?.status &&
        itwin.status.toLocaleLowerCase() !== "active" && (
          <Badge
            backgroundColor={
              itwin.status.toLocaleLowerCase() === "inactive"
                ? "#A47854" /** $iui-color-dataviz-oak */
                : "#4585A5" /** $iui-color-dataviz-steelblue */
            }
          >
            {itwin.status.toLocaleLowerCase() === "inactive"
              ? strings.inactiveBadge
              : strings.trialBadge}
          </Badge>
        )
      }
      moreOptions={moreOptions}
      thumbnail={
        <span
          className={"iui-picture iac-itwin-thumbnail"}
          onClick={() => onThumbnailClick?.(itwin)}
          style={{ cursor: onThumbnailClick ? "pointer" : "auto" }}
        >
          <ITwinIcon className={"iac-itwin-thumbnail"} />
        </span>
      }
      {...(tileProps ?? {})}
    />
  );
};
