/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import pinIcon from "@stratakit/icons/pin.svg";
import { Icon } from "@stratakit/mui";
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
  sx?: React.ComponentProps<typeof ThumbnailIconButton>["sx"];
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
  sx,
}: TileFavoriteIconProps) => {
  return (
    <ThumbnailIconButton
      aria-label={isFavorite ? removeLabel : addLabel}
      onClick={async () => {
        isFavorite ? await onRemoveFromFavorites() : await onAddToFavorites();
      }}
      className={className}
      size="small"
      disabled={disabled}
      sx={sx}
    >
      <Icon href={pinIcon} size="regular" />
    </ThumbnailIconButton>
  );
};
