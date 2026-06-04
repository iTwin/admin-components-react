import { Tile } from "@itwin/itwinui-react";
import React from "react";
import { ITwinFull } from "../../types";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
export type TileProps = React.ComponentPropsWithoutRef<typeof Tile>;
export interface ITwinTileProps {
    /** iTwin to display */
    iTwin: ITwinFull;
    /** List of options to build for the iTwin context menu */
    iTwinOptions?: ContextMenuBuilderItem<ITwinFull>[];
    /** Function to call on thumbnail click */
    onThumbnailClick?(iTwin: ITwinFull): void;
    /** Strings displayed by the browser */
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
    /** Tile props that will be applied after normal use. (Will override ITwinTile if used) */
    tileProps?: Partial<TileProps>;
    /**  Indicates whether the iTwin is marked as a favorite */
    isFavorite?: boolean;
    /**  Function to add the iTwin to favorites  */
    addToFavorites?(iTwinId: string): Promise<void>;
    /**  Function to remove the iTwin from favorites  */
    removeFromFavorites?(iTwinId: string): Promise<void>;
    /** Function to refetch iTwins */
    refetchITwins?: () => void;
    /** Indicates whether the tile should take the full width of its container */
    fullWidth?: boolean;
    /** Hides the favorite icon when true */
    hideFavoriteIcon?: boolean;
}
/**
 * Representation of an iTwin
 */
export declare const ITwinTile: ({ iTwin, iTwinOptions, onThumbnailClick, tileProps, stringsOverrides, isFavorite, addToFavorites, removeFromFavorites, refetchITwins, fullWidth, hideFavoriteIcon, }: ITwinTileProps) => React.JSX.Element;
