import React from "react";
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
export declare const TileFavoriteIcon: ({ isFavorite, onAddToFavorites, onRemoveFromFavorites, addLabel, removeLabel, className, }: TileFavoriteIconProps) => React.JSX.Element;
