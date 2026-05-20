/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import svgItwin from "@stratakit/icons/itwin.svg";
import { Icon } from "@stratakit/mui";
import classNames from "classnames";
import React from "react";

import { BaseCard, BaseCardProps } from "../../components/baseCard/BaseCard";
import { TileFavoriteIconMUI } from "../../components/tileFavoriteIcon/TileFavoriteIconMUI";
import { ITwinFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import {
  buildContextMenuItemsMUI,
  ContextMenuBuilderItemMUI,
} from "../../utils/_buildMenuOptions";
import { ITwinTileProps } from "./ITwinTile";
import styles from "./ITwinTile.module.scss";
import { StatusIcon } from "./StatusIcon";

export interface ITwinTileMUIProps
  extends Omit<ITwinTileProps, "onThumbnailClick">,
    Omit<
      BaseCardProps,
      | "statusIcon"
      | "contextMenuItems"
      | "onSelect"
      | "onOpen"
      | "onDoubleClick"
      | "title"
      | "description"
      | "thumbnailBottomRight"
      | "thumbnailTopRight"
      | "thumbnailBottomLeft"
    > {
  /** Defaults to iTwin.displayName */
  title?: string;
  /** If not provided, iTwin number will be used */
  description?: string;
  /** List of options to build for the context menu */
  contextMenuItems?: ContextMenuBuilderItemMUI<ITwinFull>[];
  /** Function to call when the card is selected. */
  onSelect?(iTwin: ITwinFull): void;
  /** Function to call when the card is opened. */
  onOpen?(iTwin: ITwinFull): void;
  /** Status to display on the tile — will override iTwin.status if provided, otherwise iTwin.status will be used.  Should be a MUI {@link Chip} */
  getBadge?: (iTwin: ITwinFull) => React.ReactNode;
}

/**
 * Representation of an iTwin — V2 (Stratakit/MUI)
 */
export const ITwinTileMUI = ({
  iTwin,
  contextMenuItems,
  stringsOverrides,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  refetchITwins,
  hideFavoriteIcon,

  selected,
  loading,
  disabled,
  status,
  thumbnail,
  getBadge,
  title,
  description,
  contextMenuContent,
  onSelect,
  onOpen,
  slotProps,
  className,
  ...rest
}: ITwinTileMUIProps) => {
  const strings = _mergeStrings(
    {
      trialBadge: "Trial",
      inactiveBadge: "Inactive",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
    },
    stringsOverrides
  );

  const moreOptionsBuilt = React.useMemo(
    () =>
      buildContextMenuItemsMUI(
        contextMenuItems,
        iTwin,
        undefined,
        refetchITwins
      ),
    [contextMenuItems, iTwin, refetchITwins]
  );

  const hasMoreOptions = !!(contextMenuContent ?? moreOptionsBuilt?.length);

  const favoriteIcon =
    !hideFavoriteIcon &&
    isFavorite !== undefined &&
    addToFavorites &&
    removeFromFavorites ? (
      <TileFavoriteIconMUI
        isFavorite={isFavorite}
        onAddToFavorites={() => addToFavorites(iTwin.id)}
        onRemoveFromFavorites={() => removeFromFavorites(iTwin.id)}
        addLabel={strings.addToFavorites}
        removeLabel={strings.removeFromFavorites}
        className={classNames(styles.iTwinTileFavoriteIcon, {
          [styles.hidden]: !isFavorite,
        })}
        disabled={disabled}
      />
    ) : undefined;

  const additionalDescription = iTwin.lastModifiedDateTime
    ? new Date(iTwin.lastModifiedDateTime).toDateString()
    : undefined;

  return (
    <BaseCard
      aria-disabled={disabled ?? undefined}
      className={classNames(styles.iTwinTile, className)}
      disabled={disabled}
      loading={loading}
      selected={selected}
      thumbnail={
        thumbnail ?? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="span"
              sx={{ lineHeight: 0, color: "text.secondary" }}
            >
              {/* TODO: align this with iModel default thumbnail generation */}
              <Icon href={svgItwin} size="large" />
            </Box>
          </Box>
        )
      }
      thumbnailTopRight={favoriteIcon}
      thumbnailBottomRight={
        getBadge?.(iTwin) ?? (
          <StatusBadge status={iTwin.status} strings={strings} />
        )
      }
      title={title ?? iTwin.displayName ?? ""}
      onSelect={onSelect ? (event) => onSelect(iTwin) : undefined}
      onOpen={onOpen ? (event) => onOpen(iTwin) : undefined}
      contextMenuContent={
        hasMoreOptions ? contextMenuContent ?? moreOptionsBuilt : undefined
      }
      status={status}
      statusIcon={<StatusIcon status={status} selected={selected} />}
      description={description ?? iTwin.number ?? ""}
      additionalDescription={additionalDescription}
      slotProps={slotProps}
      {...rest}
    />
  );
};

function StatusBadge({
  status,
  strings,
}: {
  status?: string;
  strings: {
    trialBadge: string;
    inactiveBadge: string;
  };
}) {
  if (!status || status.toLocaleLowerCase() === "active") {
    return null;
  }

  return (
    <Chip
      size="small"
      label={
        status.toLocaleLowerCase() === "inactive"
          ? strings.inactiveBadge
          : strings.trialBadge
      }
    />
  );
}
