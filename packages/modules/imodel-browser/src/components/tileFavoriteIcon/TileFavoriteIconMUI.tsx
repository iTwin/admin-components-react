/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import pinIcon from "@stratakit/icons/pin.svg";
import React from "react";

import { ThumbnailIconButton } from "../baseCard/ThumbnailIconButton";

export interface TileFavoriteIconProps {
  /** Whether the item is currently favorited */
  isFavorite: boolean;
  /** Callback to add the item to favorites */
  onAddToFavorites: () => Promise<void> | void;
  /** Callback to remove the item from favorites */
  onRemoveFromFavorites: () => Promise<void> | void;
  /** Accessible label for adding to favorites */
  addLabel: string;
  /** Accessible label for removing from favorites */
  removeLabel: string;
  /** CSS class to apply to the icon */
  className?: string;
  /** Whether the icon button is disabled */
  disabled?: boolean;
  /**
   * When true, removes the overlay background (e.g. for use in table rows
   * where the row itself provides contrast).
   */
  transparent?: boolean;
}

/**
 * Reusable favorite icon button for Tile and Table components.
 *
 * Hidden (`opacity: 0`) when not favorited — the parent is responsible for
 * revealing it on hover / focus-within by targeting the `.favoriteIcon` class.
 * Always visible when favorited.
 */
export const TileFavoriteIconMUI = ({
  isFavorite,
  onAddToFavorites,
  onRemoveFromFavorites,
  addLabel,
  removeLabel,
  disabled,
  className = "",
  transparent,
}: TileFavoriteIconProps) => {
  return (
    <ThumbnailIconButton
      aria-label={isFavorite ? removeLabel : addLabel}
      aria-pressed={isFavorite}
      onClick={async () => {
        isFavorite ? await onRemoveFromFavorites() : await onAddToFavorites();
      }}
      className={`favoriteIcon${isFavorite ? " isFavorite" : ""}${
        className ? " " + className : ""
      }`}
      disabled={disabled}
      muted={!isFavorite}
      icon={pinIcon}
      sx={{
        ...(!isFavorite && { opacity: 0 }),
        ...(transparent && {
          bgcolor: "transparent",
          "&:hover": { bgcolor: "transparent" },
        }),
      }}
    />
  );
};
