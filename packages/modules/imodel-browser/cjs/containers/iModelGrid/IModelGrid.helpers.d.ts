import React from "react";
import { AccessTokenProvider, ApiOverrides, DataMode, DataStatus, IModelCellOverrides, IModelFull, IModelSortOptions, ViewType } from "../../types";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import { IModelTileProps } from "../iModelTiles/IModelTile";
import { IModelTableStrings } from "./useIModelTableConfig";
export interface IModelGridProps {
    /**
     * Access token that requires the `imodels:read` scope. Provide a function that returns the token to prevent the token from expiring. Function must be memoized. */
    accessToken?: AccessTokenProvider;
    /** ITwin Id to list the iModels from (mutually exclusive to assetId) */
    iTwinId?: string | undefined;
    /** Type of iModels to request - "favorites" for user's favorite iModels, "recents" for recently accessed iModels, or empty string for all iModels */
    requestType?: "favorites" | "recents" | "";
    /** Thumbnail click handler. Adds iModel to recents when clicked unless disableAddToRecents is true. */
    onThumbnailClick?(iModel: IModelFull): void;
    /** When true, prevents automatically adding iModels to recents when thumbnail is clicked. Default is false. */
    disableAddToRecents?: boolean;
    /** Configure IModel sorting behavior. */
    sortOptions?: IModelSortOptions;
    /** List of actions to build for each imodel context menu. */
    iModelActions?: ContextMenuBuilderItem<IModelFull>[];
    /** Custom icon for the "Remove from recents" context menu action. Only applies when requestType is "recents". */
    removeFromRecentsIcon?: JSX.Element;
    /** Function (can be a react hook) that returns state for an iModel, returned values will be applied as props to the IModelTile, overrides IModelGrid provided values */
    useIndividualState?: (iModel: IModelFull, iModelTileProps: IModelTileProps) => Partial<IModelTileProps>;
    /** Static props to apply over each tile, mainly used for tileProps, overrides IModelGrid provided values */
    tileOverrides?: Partial<IModelTileProps>;
    /** Strings displayed by the browser */
    stringsOverrides?: Partial<IModelTableStrings> & {
        /** Displayed after successful fetch search, but no iModel is returned. */
        noIModelSearch?: string;
        /** Displayed after successful fetch, but no iModels are returned. */
        noIModels?: string;
        /** Displayed when the component is mounted and there is no iTwin or asset Id. */
        noContext?: string;
        /** Displayed when the component is mounted but the accessToken is empty. */
        noAuthentication?: string;
        /** Generic message displayed if an error occurs while fetching. */
        error?: string;
        /** Displayed on table while loading data. */
        tableLoadingData?: string;
        /** Displayed after successful fetch search, but no iModel is returned, along with noIModelSearch text. */
        noIModelSearchSubtext?: string;
        /** Displayed in context menu for removing iModel from recents. */
        removeFromRecents?: string;
    };
    /** Object that configures different overrides for the API.
     * @property `data`: Array of iModels used in the grid.
     * @property `isLoading`: Loading state when using consumer-provided data.
     * @property `hasMoreData`: Whether more data is available for infinite scroll (external mode only).
     * @property `serverEnvironmentPrefix`: Either qa or dev.
     */
    apiOverrides?: ApiOverrides<IModelFull[]>;
    /**
     * Allow final transformation of the iModel array before display
     * This function MUST be memoized.
     */
    postProcessCallback?: (iModels: IModelFull[], fetchStatus: DataStatus | undefined, searchText: string | undefined) => IModelFull[];
    /**Component to show when there is no iModel */
    emptyStateComponent?: React.ReactNode;
    /**  Exact name of the iModel to display */
    searchText?: string;
    /**iModel view mode */
    viewMode?: ViewType;
    /** The maximum number of iModels that can be fetched per request */
    pageSize?: number;
    /** Maximum number of iModels to fetch, default is unlimited */
    maxCount?: number;
    /** Overrides for cell rendering in cells viewMode */
    cellOverrides?: IModelCellOverrides;
    /** Additional class name for the grid structure */
    className?: string;
    /**
     * Specifies how data should be managed.
     * - 'internal': Package handles data fetching internally (default)
     * - 'external': Consumer manages data via apiOverrides.data and isLoading.
     * When using 'external' mode, `accessToken` and `iTwinId` are not required, as the consumer is responsible for data fetching.
     * Allows for infinite scrolling and data refresh via onLoadMore and onRefetch callbacks.
     */
    dataMode?: DataMode;
    /**
     * Callback function to load more data when using external data mode.
     * Only used when dataMode is set to 'external'. This enables infinite scrolling when you provide data directly from your consumer.
     */
    onLoadMore?: () => void | Promise<void>;
    /**
     * Callback function to refresh data when using external data mode.
     * Only used when dataMode is set to 'external'.
     */
    onRefetch?: () => void | Promise<void>;
}
/**
 * Component that will allow displaying a grid of iModels, given a contextId
 */
export declare const IModelGrid: (props: IModelGridProps) => React.JSX.Element;
