import React from "react";
import { type BaseCardProps } from "../../components/baseCard/BaseCard";
import { ITwinFull } from "../../types";
import { MoreActionsMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import { ITwinTileProps } from "./ITwinTile";
/** @alpha */
export interface ITwinTilePropsMUI extends Omit<ITwinTileProps, "onThumbnailClick" | "tileProps" | "fullWidth">, Omit<BaseCardProps, "statusIcon" | "onSelect" | "onOpen" | "title" | "description" | "thumbnailBottomRight" | "thumbnailTopRight" | "thumbnailBottomLeft" | "moreActions"> {
    /** Defaults to iTwin.displayName */
    title?: string;
    /** If not provided, iTwin number will be used */
    description?: string;
    /** Items for the three-dot context menu */
    moreActions?: MoreActionsMenuBuilderItemMUI<ITwinFull>[];
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
export declare const ITwinTileMUI: ({ iTwin, moreActions: moreActionItems, stringsOverrides, isFavorite, addToFavorites, removeFromFavorites, refetchITwins, hideFavoriteIcon, loading, disabled, status, thumbnail, getBadge, title, description, actions, className, ...rest }: ITwinTilePropsMUI) => React.JSX.Element;
export declare function DefaultThumbnail(): React.JSX.Element;
