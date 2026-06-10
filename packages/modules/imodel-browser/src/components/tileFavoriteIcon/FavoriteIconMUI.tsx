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
  tabIndex?: number;
}

/**
 * Reusable favorite icon button for Tile and Table components.
 *
 * Hidden (`opacity: 0`) when not favorited — the parent is responsible for
 * revealing it on hover / focus-within by targeting the `.favoriteIcon` class.
 * Always visible when favorited.
 */
export const FavoriteIconMUI = ({
  isFavorite,
  onAddToFavorites,
  onRemoveFromFavorites,
  addLabel,
  removeLabel,
  disabled,
  className = "",
  transparent,
  tabIndex,
}: TileFavoriteIconProps) => {
  return (
    <ThumbnailIconButton
      aria-label={isFavorite ? removeLabel : addLabel}
      aria-pressed={isFavorite}
      tabIndex={tabIndex}
      onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isFavorite) {
          // Blur so the parent's focus-within rule stops keeping the icon visible.
          event.currentTarget.blur();
          await onRemoveFromFavorites();
        } else {
          await onAddToFavorites();
        }
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
