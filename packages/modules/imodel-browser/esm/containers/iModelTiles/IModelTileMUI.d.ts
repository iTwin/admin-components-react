import React from "react";
import { type BaseCardProps } from "../../components/baseCard/BaseCard";
import { AccessTokenProvider, ApiOverrides, IModelFull } from "../../types";
import { ContextMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import { IModelTileProps } from "./IModelTile";
/** @alpha */
export interface IModelTileMUIProps extends Omit<IModelTileProps, "onThumbnailClick" | "iModelOptions" | "tileProps" | "fullWidth">, Omit<BaseCardProps, "statusIcon" | "contextMenuItems" | "onSelect" | "onOpen" | "title" | "description" | "thumbnailBottomRight" | "thumbnailTopRight" | "onDoubleClick" | "contextMenuContent"> {
    /** If not provided, iModel display name will be used */
    title?: string;
    /** If not provided, iModel description will be used */
    description?: string;
    /** iModel to display */
    iModel: IModelFull;
    /** List of options to build for the context menu */
    contextMenuItems?: ContextMenuBuilderItemMUI<IModelFull>[];
    /** Function to call when the card is selected. */
    onSelect?(iModel: IModelFull): void;
    /** Function to call when the card is opened. */
    onOpen?(iModel: IModelFull): void;
    /** Strings displayed by the component */
    stringsOverrides?: {
        /** Accessible text for the hollow star icon to add the iModel to favorites */
        addToFavorites?: string;
        /** Accessible text for the full star icon to remove the iModel from favorites */
        removeFromFavorites?: string;
    };
    /** Access token for fetching the thumbnail */
    accessToken?: AccessTokenProvider;
    /** Object that configures different overrides for the API */
    apiOverrides?: ApiOverrides;
    /** Function to refetch iModels */
    refetchIModels?: () => void;
    /** Hides the favorite icon when true */
    hideFavoriteIcon?: boolean;
    /** Function that returns a badge node for the given iModel */
    getBadge?: (iModel: IModelFull) => React.ReactNode;
    /** Badge for the given iModel - getBadge will take precedence over this prop */
    badge?: React.ReactNode;
}
/**
 * Representation of an IModel — V2 (Stratakit/MUI)
 * @alpha
 */
export declare const IModelTileMUI: ({ iModel, contextMenuItems, accessToken, apiOverrides, stringsOverrides, refetchIModels, hideFavoriteIcon, selected, loading, disabled, status, thumbnail, thumbnailTopLeft, thumbnailBottomLeft, getBadge, badge, title, description, additionalDescription, actions, onSelect, onOpen, slotProps, className, ...rest }: IModelTileMUIProps) => React.JSX.Element;
