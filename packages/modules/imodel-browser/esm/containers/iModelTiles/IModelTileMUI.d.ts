import React from "react";
import { type BaseCardProps } from "../../components/baseCard/BaseCard";
import { AccessTokenProvider, ApiOverrides, IModelFull } from "../../types";
import { type MoreActionsMenuItemMUI } from "../../utils/_buildMenuOptions";
import { IModelTileProps } from "./IModelTile";
/** @alpha */
export interface IModelTileMUIProps extends Omit<IModelTileProps, "onThumbnailClick" | "iModelOptions" | "tileProps" | "fullWidth">, Omit<BaseCardProps, "statusIcon" | "onSelect" | "onOpen" | "title" | "description" | "thumbnailBottomRight" | "thumbnailTopRight" | "moreActions"> {
    /** If not provided, iModel display name will be used */
    title?: string;
    /** If not provided, iModel description will be used */
    description?: string;
    /** iModel to display */
    iModel: IModelFull;
    /** Items for the three-dot context menu */
    moreActions?: MoreActionsMenuItemMUI<IModelFull>[];
    /** Strings displayed by the component */
    stringsOverrides?: {
        /** Accessible text for the hollow star icon to add the iModel to favorites */
        addToFavorites?: string;
        /** Accessible text for the full star icon to remove the iModel from favorites */
        removeFromFavorites?: string;
        moreOptions?: string;
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
export declare const IModelTileMUI: ({ iModel, moreActions: moreActionItems, accessToken, apiOverrides, stringsOverrides, refetchIModels, hideFavoriteIcon, loading, disabled, status, thumbnail, thumbnailTopLeft, thumbnailBottomLeft, getBadge, badge, title, description, subheader, actions, className, ...rest }: IModelTileMUIProps) => React.JSX.Element;
