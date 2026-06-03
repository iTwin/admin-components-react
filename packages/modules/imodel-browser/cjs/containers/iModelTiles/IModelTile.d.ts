import { Tile } from "@itwin/itwinui-react";
import React from "react";
import { AccessTokenProvider, ApiOverrides, IModelFull } from "../../types";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
type TileProps = React.ComponentPropsWithoutRef<typeof Tile>;
export interface IModelTileProps {
    /** iModel to display */
    iModel: IModelFull;
    /** Access token to display */
    accessToken?: AccessTokenProvider;
    /** List of options to build for the imodel context menu */
    iModelOptions?: ContextMenuBuilderItem<IModelFull>[];
    /** Function to call on thumbnail click */
    onThumbnailClick?(iModel: IModelFull): void;
    /** Strings displayed by the browser */
    stringsOverrides?: {
        /** Accessible text for the hollow star icon to add the iModel to favorites */
        addToFavorites?: string;
        /** Accessible text for the full star icon to remove the iModel from favorites */
        removeFromFavorites?: string;
    };
    /** Tile props that will be applied after normal use. (Will override IModelTile if used) */
    tileProps?: Partial<TileProps & {
        getBadge?: (iModel: IModelFull) => React.ReactNode;
    }>;
    /** Object that configures different overrides for the API */
    apiOverrides?: ApiOverrides;
    /** Function to refetch iModels */
    refetchIModels?: () => void;
    /** Indicates whether the tile should take the full width of its container */
    fullWidth?: boolean;
    /** Hides the favorite icon when true */
    hideFavoriteIcon?: boolean;
}
/**
 * Representation of an IModel
 */
export declare const IModelTile: ({ iModel, iModelOptions, accessToken, onThumbnailClick, apiOverrides, tileProps, stringsOverrides, refetchIModels, fullWidth, hideFavoriteIcon, }: IModelTileProps) => React.JSX.Element;
export {};
