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
import styles from "./ITwinTile.module.scss";
import { StatusIcon } from "./StatusIcon";

export interface ITwinTileMUIProps
  extends Omit<
    BaseCardProps,
    | "headerRight"
    | "statusIcon"
    | "contextMenuItems"
    | "onDoubleClick"
    | "title"
    | "description"
  > {
  /** Defaults to iTwin.displayName */
  title?: string;
  /** If not provided, iTwin number will be used */
  description?: string;
  /** iTwin to display */
  iTwin: ITwinFull;
  /** List of options to build for the context menu */
  contextMenuItems?: ContextMenuBuilderItemMUI<ITwinFull>[];
  /** Function to call on card click — receives the iTwin object */
  onThumbnailClick?(iTwin: ITwinFull): void;
  /** Strings displayed by the component */
  stringsOverrides?: {
    /** Badge text for trial iTwins */
    trialBadge?: string;
    /** Badge text for inactive iTwins */
    inactiveBadge?: string;
    /** Accessible text for the hollow star icon to add the iTwin to favorites */
    addToFavorites?: string;
    /** Accessible text for the full star icon to remove the iTwin from favorites */
    removeFromFavorites?: string;
  };
  /** Indicates whether the iTwin is marked as a favorite */
  isFavorite?: boolean;
  /** Function to add the iTwin to favorites */
  addToFavorites?(iTwinId: string): Promise<void>;
  /** Function to remove the iTwin from favorites */
  removeFromFavorites?(iTwinId: string): Promise<void>;
  /** Function to refetch iTwins */
  refetchITwins?: () => void;
  /** Hides the favorite icon when true */
  hideFavoriteIcon?: boolean;
  /** Additional content rendered below fineprint in the info section */
  children?: React.ReactNode;
}

/**
 * Representation of an iTwin — V2 (Stratakit/MUI)
 */
export const ITwinTileMUI = ({
  iTwin,
  contextMenuItems,
  onThumbnailClick,
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
  thumbnailTopLeft,
  thumbnailTopRight,
  thumbnailBottomLeft,
  thumbnailBottomRight,
  title,
  description,

  contextMenuContent,
  children,
  onTitleClick,
  slotProps,
  className,
  onContextMenu: onCardContextMenu,
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
    () => buildContextMenuItemsMUI(contextMenuItems, iTwin, refetchITwins),
    [contextMenuItems, iTwin, refetchITwins]
  );

  const hasMoreOptions = !!(contextMenuContent ?? moreOptionsBuilt?.length);

  const statusBadge =
    thumbnailBottomRight ??
    (iTwin.status && iTwin.status.toLocaleLowerCase() !== "active" ? (
      <Chip
        size="small"
        label={
          iTwin.status.toLocaleLowerCase() === "inactive"
            ? strings.inactiveBadge
            : strings.trialBadge
        }
        color={
          iTwin.status.toLocaleLowerCase() === "inactive"
            ? "default"
            : "primary"
        }
      />
    ) : null);

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

  const thumbnailTopRightContent =
    thumbnailTopRight || favoriteIcon ? (
      <>
        {thumbnailTopRight}
        {favoriteIcon}
      </>
    ) : undefined;

  const fineprint = iTwin.lastModifiedDateTime
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
              <Icon href={svgItwin} size="large" />
            </Box>
          </Box>
        )
      }
      thumbnailTopLeft={thumbnailTopLeft}
      thumbnailTopRight={thumbnailTopRightContent}
      thumbnailBottomLeft={thumbnailBottomLeft}
      thumbnailBottomRight={statusBadge}
      title={title ?? iTwin.displayName ?? ""}
      onTitleClick={
        onTitleClick ??
        (onThumbnailClick ? () => onThumbnailClick(iTwin) : undefined)
      }
      onContextMenu={onCardContextMenu}
      contextMenuContent={
        hasMoreOptions ? contextMenuContent ?? moreOptionsBuilt : undefined
      }
      statusIcon={
        <StatusIcon status={status} loading={loading} selected={selected} />
      }
      description={description ?? iTwin.number ?? ""}
      fineprint={fineprint}
      slotProps={slotProps}
      {...rest}
    />
  );
};
