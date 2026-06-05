import React from "react";
import { type BaseCardProps } from "../../components/baseCard/BaseCard";
import { ITwinFull } from "../../types";
import { ContextMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import { ITwinTileProps } from "./ITwinTile";
/** @alpha */
export interface ITwinTilePropsMUI extends Omit<ITwinTileProps, "onThumbnailClick" | "tileProps" | "fullWidth">, Omit<BaseCardProps, "statusIcon" | "contextMenuItems" | "onSelect" | "onOpen" | "onDoubleClick" | "title" | "description" | "thumbnailBottomRight" | "thumbnailTopRight" | "thumbnailBottomLeft" | "contextMenuContent"> {
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
    stringsOverrides?: {
        trialBadge?: string;
        inactiveBadge?: string;
        addToFavorites?: string;
        removeFromFavorites?: string;
        moreOptions?: string;
    };
}
/**
 * Representation of an iTwin — V2 (Stratakit/MUI)
 * @alpha
 */
export declare const ITwinTileMUI: ({ iTwin, contextMenuItems, stringsOverrides, isFavorite, addToFavorites, removeFromFavorites, refetchITwins, hideFavoriteIcon, selected, loading, disabled, status, thumbnail, getBadge, title, description, onSelect, onOpen, slotProps, className, ...rest }: ITwinTilePropsMUI) => React.JSX.Element;
export declare function DefaultThumbnail(): React.JSX.Element;
