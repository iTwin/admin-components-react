import "./ITwinGrid.scss";
import React from "react";
import { AccessTokenProvider, ApiOverrides, DataStatus, ITwinCellOverrides, ITwinFilterOptions, ITwinFull, ITwinSubClass, ViewType } from "../../types";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import { ITwinTileProps } from "./ITwinTile";
export type IndividualITwinStateHook = (iTwin: ITwinFull, iTwinTileProps: ITwinTileProps & {
    gridProps: ITwinGridProps;
}) => Partial<ITwinTileProps>;
export interface ITwinGridStrings {
    /** Displayed for table favorites header. */
    tableColumnFavorites: string;
    /** Displayed for table name header. */
    tableColumnName: string;
    /** Displayed for table description header. */
    tableColumnDescription: string;
    /** Displayed for table lastModified header. */
    tableColumnLastModified: string;
    /** Displayed on table while loading data. */
    tableLoadingData: string;
    /** Badge text for trial iTwins */
    trialBadge: string;
    /** Badge text for inactive iTwins */
    inactiveBadge: string;
    /** Displayed after successful fetch, but no iTwins are returned. */
    noITwins: string;
    /** Displayed when the component is mounted but the accessToken is empty. */
    noAuthentication: string;
    /** Generic message displayed if an error occurs while fetching. */
    error: string;
    /** Accessible text for the hollow star icon to add the iTwin to favorites */
    addToFavorites: string;
    /** Accessible text for the full star icon to remove the iTwin from favorites */
    removeFromFavorites: string;
}
export interface ITwinGridProps {
    /** Access token that requires the `itwins:read` scope. Provide a function that returns the token to prevent the token from expiring. Function must be memoized. */
    accessToken?: AccessTokenProvider;
    /** Type of iTwin to request */
    requestType?: "favorites" | "recents" | "";
    /** Sub class of iTwin, defaults to Project */
    iTwinSubClass?: ITwinSubClass;
    /** Thumbnail click handler. */
    onThumbnailClick?(iTwin: ITwinFull): void;
    /** String/function that configure iTwin filtering behavior.
     * A string will filter on displayed text only ().
     * A function allow filtering on anything, is used in a normal array.filter.
     */
    filterOptions?: ITwinFilterOptions;
    /**
     * Set the `$orderby` parameter when fetching iTwins from the iTwin API, e.g. `displayName ASC`.
     * This only has an effect when the `requestType` is empty - it does not apply to "favorites" or "recents".
     * See https://developer.bentley.com/apis/itwins/operations/get-my-itwins/#odata-queries for details.
     */
    orderbyOptions?: string;
    /** List of actions to build for each iTwin context menu. */
    iTwinActions?: ContextMenuBuilderItem<ITwinFull>[];
    /** Function (can be a react hook) that returns state for an iTwin, returned values will be applied as props to the iTwinTile, overrides ITwinGrid provided values */
    useIndividualState?: IndividualITwinStateHook;
    /** Static props to apply over each tile, mainly used for tileProps, overrides ITwinGrid provided values */
    tileOverrides?: Partial<ITwinTileProps>;
    /** Strings displayed by the browser */
    stringsOverrides?: Partial<ITwinGridStrings>;
    /** Object that configures different overrides for the API.
     * @property `data`: Array of iTwins used in the grid.
     * @property `serverEnvironmentPrefix`: Either qa or dev.
     */
    apiOverrides?: ApiOverrides<ITwinFull[]>;
    /**
     * Allow final transformation of the iTwin array before display
     * This function MUST be memoized.
     */
    postProcessCallback?: (iTwins: ITwinFull[], fetchStatus: DataStatus | undefined) => ITwinFull[];
    /**iTwin view mode */
    viewMode?: ViewType;
    /** Overrides for cell rendering in cells viewMode */
    cellOverrides?: ITwinCellOverrides;
    /** Additional class name for the grid structure */
    className?: string;
}
/**
 * Component that will allow displaying a grid of iTwins, given a requestType
 */
export declare const ITwinGrid: ({ accessToken, apiOverrides, filterOptions, orderbyOptions, onThumbnailClick, iTwinActions, requestType, iTwinSubClass, stringsOverrides, tileOverrides, useIndividualState, postProcessCallback, viewMode, cellOverrides, className, }: ITwinGridProps) => React.JSX.Element;
