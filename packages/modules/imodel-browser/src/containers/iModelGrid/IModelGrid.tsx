/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Table, ThemeProvider } from "@itwin/itwinui-react";
import React from "react";
import { InView } from "react-intersection-observer";

import { GridStructure } from "../../components/gridStructure/GridStructure";
import { NoResults } from "../../components/noResults/NoResults";
import { IModelFavoritesProvider } from "../../contexts/IModelFavoritesContext";
import {
  AccessTokenProvider,
  ApiOverrides,
  DataMode,
  DataStatus,
  IModelCellOverrides,
  IModelFull,
  IModelSortOptions,
  ViewType,
} from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import {
  addIModelToRecents,
  removeIModelFromRecents,
} from "../../utils/iModelApi";
import { IModelGhostTile } from "../iModelTiles/IModelGhostTile";
import { IModelTile, IModelTileProps } from "../iModelTiles/IModelTile";
import styles from "./IModelGrid.module.scss";
import { DEFAULT_PAGE_SIZE, useIModelData } from "./useIModelData";
import { useIModelTableConfig } from "./useIModelTableConfig";

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
  useIndividualState?: (
    iModel: IModelFull,
    iModelTileProps: IModelTileProps
  ) => Partial<IModelTileProps>;
  /** Static props to apply over each tile, mainly used for tileProps, overrides IModelGrid provided values */
  tileOverrides?: Partial<IModelTileProps>;
  /** Strings displayed by the browser */
  stringsOverrides?: {
    /** Displayed for table name header. */
    tableColumnName?: string;
    /** Displayed for table description header. */
    tableColumnDescription?: string;
    /** Displayed for table lastModified header. */
    tableColumnLastModified?: string;
    /** Displayed on table while loading data. */
    tableLoadingData?: string;
    /** Displayed after successful fetch search, but no iModel is returned. */
    noIModelSearch?: string;
    /** Displayed after successful fetch search, but no iModel is returned, along with noIModelSearch text. */
    noIModelSearchSubtext?: string;
    /** Displayed after successful fetch, but no iModels are returned. */
    noIModels?: string;
    /** Displayed when the component is mounted and there is no iTwin or asset Id. */
    noContext?: string;
    /** Displayed when the component is mounted but the accessToken is empty. */
    noAuthentication?: string;
    /** Generic message displayed if an error occurs while fetching. */
    error?: string;
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
  postProcessCallback?: (
    iModels: IModelFull[],
    fetchStatus: DataStatus | undefined,
    searchText: string | undefined
  ) => IModelFull[];
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
   * - 'external': Consumer manages data via apiOverrides.data and isLoading
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
export const IModelGrid = (props: IModelGridProps) => {
  return (
    <IModelFavoritesProvider
      iTwinId={props.iTwinId}
      accessToken={props.accessToken}
      serverEnvironmentPrefix={props.apiOverrides?.serverEnvironmentPrefix}
    >
      <ITwinGridInternal {...props} />
    </IModelFavoritesProvider>
  );
};
const ITwinGridInternal = ({
  accessToken,
  apiOverrides,
  iModelActions,
  removeFromRecentsIcon,
  onThumbnailClick,
  iTwinId,
  sortOptions = { sortType: "name", descending: false },
  requestType,
  stringsOverrides,
  tileOverrides,
  useIndividualState,
  postProcessCallback,
  emptyStateComponent,
  searchText,
  viewMode,
  pageSize,
  maxCount,
  cellOverrides,
  className,
  onLoadMore,
  onRefetch,
  dataMode = "internal",
  disableAddToRecents = false,
}: IModelGridProps) => {
  const [sort, setSort] = React.useState<IModelSortOptions>(sortOptions);
  const [isSortOnTable, setIsSortOnTable] = React.useState(false);

  React.useEffect(() => {
    if (!isSortOnTable) {
      const defaultTableSort: IModelSortOptions = {
        sortType: "name",
        descending: false,
      };
      setSort(
        viewMode === "cells"
          ? defaultTableSort
          : {
              sortType: sortOptions.sortType,
              descending: sortOptions.descending,
            }
      );
    }
  }, [isSortOnTable, sortOptions.descending, sortOptions.sortType, viewMode]);

  const strings = _mergeStrings(
    {
      tableColumnFavorites: "",
      tableColumnName: "Name",
      tableColumnDescription: "Description",
      tableColumnLastModified: "Last Modified",
      tableLoadingData: "Loading...",
      noIModelSearch: "No results found",
      noIModelSearchSubtext:
        "Try adjusting your search by using fewer or more general terms.",
      noIModels:
        requestType === "recents"
          ? "There are no recent iModels."
          : requestType === "favorites"
          ? "There are no favorite iModels."
          : "There are no iModels in this iTwin.",
      noContext: "No context provided",
      noAuthentication: "No access token provided",
      error: "An error occurred",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      removeFromRecents: "Remove from recents",
    },
    stringsOverrides
  );

  // Add "Remove from recents" action when viewing recents
  const enhancedIModelActions = React.useMemo(() => {
    if (requestType === "recents") {
      const removeFromRecentsAction: ContextMenuBuilderItem<IModelFull> = {
        key: "remove-from-recents",
        children: strings.removeFromRecents,
        ...(removeFromRecentsIcon && { icon: removeFromRecentsIcon }),
        onClick: async (iModel, refetchData) => {
          if (!iModel || !accessToken) {
            return;
          }
          await removeIModelFromRecents({
            iModelId: iModel.id,
            accessToken,
            serverEnvironmentPrefix: apiOverrides?.serverEnvironmentPrefix,
          });
          refetchData?.();
        },
      };
      return iModelActions
        ? [removeFromRecentsAction, ...iModelActions]
        : [removeFromRecentsAction];
    }
    return iModelActions;
  }, [
    requestType,
    iModelActions,
    strings.removeFromRecents,
    removeFromRecentsIcon,
    accessToken,
    apiOverrides?.serverEnvironmentPrefix,
  ]);

  const {
    iModels: fetchediModels,
    status: fetchStatus,
    fetchMore,
    refetchIModels,
  } = useIModelData({
    requestType,
    accessToken,
    apiOverrides,
    iTwinId,
    sortOptions: sort,
    searchText,
    maxCount,
    pageSize,
    viewMode,
    dataMode,
    onLoadMore,
    onRefetch,
  });

  const iModels = React.useMemo(
    () =>
      postProcessCallback?.([...fetchediModels], fetchStatus, searchText) ??
      fetchediModels,
    [postProcessCallback, fetchediModels, fetchStatus, searchText]
  );

  React.useEffect(() => {
    if (
      iModels.length < (pageSize ?? DEFAULT_PAGE_SIZE) &&
      fetchMore &&
      fetchStatus !== DataStatus.Fetching
    ) {
      fetchMore();
    }
  }, [iModels.length, pageSize, fetchMore, fetchStatus]);

  const iModelClickAndAddToRecents = async (
    iModel: IModelFull,
    clickFn: () => void
  ) => {
    try {
      if (!accessToken || disableAddToRecents) {
        clickFn();
        return;
      }

      void addIModelToRecents({
        iModelId: iModel.id,
        accessToken,
        serverEnvironmentPrefix: apiOverrides?.serverEnvironmentPrefix,
      });
    } catch (e) {
      // swallow errors to avoid disrupting the UI
      console.error("Failed to add iModel to recents", e);
    }
    onThumbnailClick?.(iModel);
  };

  const { columns, onRowClick } = useIModelTableConfig({
    iModelActions: enhancedIModelActions,
    onThumbnailClick: (iModel) =>
      iModelClickAndAddToRecents(iModel, () => onThumbnailClick?.(iModel)),
    strings,
    refetchIModels,
    cellOverrides,
  });

  const noResultsText = {
    [DataStatus.Fetching]: "",
    [DataStatus.Complete]: strings.noIModels,
    [DataStatus.FetchFailed]: strings.error,
    [DataStatus.TokenRequired]: strings.noAuthentication,
    [DataStatus.ContextRequired]: strings.noContext,
  }[fetchStatus ?? DataStatus.Fetching];

  const tileApiOverrides = apiOverrides
    ? { serverEnvironmentPrefix: apiOverrides.serverEnvironmentPrefix }
    : undefined;

  const renderIModelGridStructure = () => {
    return (
      <>
        {viewMode !== "cells" ? (
          <GridStructure className={className}>
            {iModels?.map((iModel) => (
              <IModelHookedTile
                key={iModel.id}
                iModel={iModel}
                iModelOptions={enhancedIModelActions}
                accessToken={accessToken}
                onThumbnailClick={(iModel) =>
                  iModelClickAndAddToRecents(iModel, () =>
                    onThumbnailClick?.(iModel)
                  )
                }
                apiOverrides={tileApiOverrides}
                useTileState={useIndividualState}
                refetchIModels={refetchIModels}
                {...cellOverrides}
                {...tileOverrides}
                tileProps={
                  tileOverrides
                    ? {
                        ...tileOverrides.tileProps,
                        onClick: tileOverrides.tileProps?.onClick
                          ? (e) =>
                              iModelClickAndAddToRecents(iModel, () =>
                                tileOverrides.tileProps?.onClick?.(e)
                              )
                          : undefined,
                      }
                    : undefined
                }
              />
            ))}
            {fetchMore ? (
              <InView
                onChange={(inView) => {
                  inView && fetchStatus !== DataStatus.Fetching && fetchMore();
                }}
              >
                {({ ref }) => {
                  return (
                    <IModelGhostTile
                      ref={ref}
                      fullWidth={tileOverrides?.fullWidth}
                    />
                  );
                }}
              </InView>
            ) : null}
            {fetchStatus === DataStatus.Fetching && (
              <>
                <IModelGhostTile fullWidth={tileOverrides?.fullWidth} />
                <IModelGhostTile fullWidth={tileOverrides?.fullWidth} />
              </>
            )}
          </GridStructure>
        ) : (
          <ThemeProvider theme="inherit">
            <Table<{ [P in keyof IModelFull]: IModelFull[P] }>
              columns={columns}
              data={iModels}
              onRowClick={onRowClick}
              emptyTableContent={
                fetchStatus === DataStatus.Fetching
                  ? strings.tableLoadingData
                  : strings.noIModelSearch
              }
              isLoading={fetchStatus === DataStatus.Fetching}
              isSortable
              onSort={(state) => {
                const sortBy =
                  state.sortBy.length > 0 ? state.sortBy[0] : undefined;
                setIsSortOnTable(sortBy?.id !== undefined);
                if (
                  !sortBy ||
                  sortBy.desc === undefined ||
                  (sortBy.id !== "name" && sortBy.id !== "createdDateTime")
                ) {
                  return;
                }
                setSort({
                  sortType: sortBy.id,
                  descending: sortBy.desc,
                });
              }}
              manualSortBy
              onBottomReached={fetchMore}
              autoResetFilters={false}
              autoResetSortBy={false}
              bodyProps={{
                className: onThumbnailClick ? styles.rowCursor : "",
              }}
            />
          </ThemeProvider>
        )}
      </>
    );
  };

  const renderComponent = () => {
    if (
      !searchText &&
      iModels.length === 0 &&
      noResultsText === strings.noIModels &&
      emptyStateComponent
    ) {
      return <>{emptyStateComponent}</>;
    }
    if (!searchText && iModels.length === 0 && noResultsText) {
      return <NoResults text={noResultsText} />;
    }
    if (
      searchText &&
      iModels.length === 0 &&
      fetchStatus !== DataStatus.Fetching
    ) {
      return (
        <NoResults
          text={strings.noIModelSearch}
          subtext={strings.noIModelSearchSubtext}
          isSearchResult
        />
      );
    }
    return renderIModelGridStructure();
  };
  return renderComponent();
};

type IModelHookedTileProps = IModelTileProps & {
  useTileState?: (
    iModel: IModelFull,
    iModelTileProps: IModelTileProps
  ) => Partial<IModelTileProps>;
};
const noOp = () => ({} as Partial<IModelTileProps>);
const IModelHookedTile = (props: IModelHookedTileProps) => {
  const { useTileState = noOp, ...iModelTileProps } = props;

  const hookIdentity = React.useRef(useTileState);

  if (hookIdentity.current !== useTileState) {
    throw new Error(
      "Even when used in a prop, useTilePropsForIModel identity must remain stable as it is used as a hook."
    );
  }

  const tileState = useTileState(props.iModel, iModelTileProps);
  return <IModelTile {...iModelTileProps} {...tileState} />;
};
