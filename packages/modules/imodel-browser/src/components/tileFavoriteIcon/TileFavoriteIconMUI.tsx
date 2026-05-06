/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";
import { Icon } from "@stratakit/mui";
import pinIcon from "@stratakit/icons/pin.svg";
import IconButton from "@mui/material/IconButton";
import styles from "./TileFavoriteIcon.module.scss";

export interface TileFavoriteIconProps {
  /** Whether the item is currently favorited */
  isFavorite: boolean;
  /** Callback to add the item to favorites */
  onAddToFavorites: () => Promise<void>;
  /** Callback to remove the item from favorites */
  onRemoveFromFavorites: () => Promise<void>;
  /** Accessible label for adding to favorites */
  addLabel: string;
  /** Accessible label for removing from favorites */
  removeLabel: string;
  /** CSS class to apply to the icon */
  className?: string;
  /** Whether the icon button is disabled */
  disabled?: boolean;
}

/**
 * Reusable favorite icon button for Tile components
 * Shows a star icon that can be clicked to add/remove from favorites
 */
export const TileFavoriteIconMUI = ({
  isFavorite,
  onAddToFavorites,
  onRemoveFromFavorites,
  addLabel,
  removeLabel,
  disabled,
  className = "",
}: TileFavoriteIconProps) => {
  return (
    <IconButton
      aria-label={isFavorite ? removeLabel : addLabel}
      onClick={async () => {
        isFavorite ? await onRemoveFromFavorites() : await onAddToFavorites();
      }}
      className={className}
      size="small"
      disabled={disabled}
      sx={{
        bgcolor: "background.paper",
      }}
    >
      <Icon
        href={pinIcon}
        size="regular"
        className={
          isFavorite ? styles.favouriteMUIIcon : styles.notFavouriteMUIIcon
        }
      />
    </IconButton>
  );
};
