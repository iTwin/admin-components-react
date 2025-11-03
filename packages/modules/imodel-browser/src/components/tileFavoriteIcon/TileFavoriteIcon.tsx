/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SvgStar, SvgStarHollow } from "@itwin/itwinui-icons-react";
import { IconButton } from "@itwin/itwinui-react";
import React from "react";

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
}

/**
 * Reusable favorite icon button for Tile components
 * Shows a star icon that can be clicked to add/remove from favorites
 */
export const TileFavoriteIcon = ({
  isFavorite,
  onAddToFavorites,
  onRemoveFromFavorites,
  addLabel,
  removeLabel,
  className = "",
}: TileFavoriteIconProps) => {
  return (
    <IconButton
      aria-label={isFavorite ? removeLabel : addLabel}
      onClick={async () => {
        isFavorite ? await onRemoveFromFavorites() : await onAddToFavorites();
      }}
      className={`${styles.favoriteIconButton} ${className}`}
      styleType="borderless"
    >
      {isFavorite ? <SvgStar /> : <SvgStarHollow />}
    </IconButton>
  );
};
