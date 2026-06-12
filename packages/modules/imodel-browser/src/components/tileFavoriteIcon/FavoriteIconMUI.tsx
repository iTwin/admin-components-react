/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import pinUnpinSvg from "@stratakit/icons/pin-unpin.svg";
import pinSvg from "@stratakit/icons/pin.svg";
import React, { useState } from "react";

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
   * When true, removes the overlay background (e.g. table rows)
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
  const [hovered, setHovered] = useState(false);
  const [pending, setPending] = useState(false);

  // Pinned: always show pin icon, swap to unpin on hover.
  // Unpinned: hidden by default, show pin icon on hover.
  const icon = isFavorite && hovered ? pinUnpinSvg : pinSvg;

  return (
    <ThumbnailIconButton
      aria-label={isFavorite ? removeLabel : addLabel}
      aria-pressed={isFavorite}
      tabIndex={tabIndex}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
        // debounce
        if (pending) return;

        setPending(true);
        try {
          if (isFavorite) {
            // Blur so the parent's focus-within rule stops keeping the icon visible.
            event.currentTarget.blur();
            await onRemoveFromFavorites();
          } else {
            // Reset hover so the icon doesn't immediately flip to "unpin"
            // while the cursor is still over the button.
            setHovered(false);
            await onAddToFavorites();
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to toggle favorite", error);
        } finally {
          setPending(false);
        }
      }}
      className={`favoriteIcon${isFavorite ? " isFavorite" : ""}${
        className ? " " + className : ""
      }`}
      disabled={(disabled ?? false) || pending}
      muted={!isFavorite}
      icon={icon}
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
