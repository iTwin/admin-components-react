/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import React from "react";
import { InView } from "react-intersection-observer";

import { type BaseCardActionItem } from "../../components/baseCard/BaseCard";
import { BaseCardLoading } from "../../components/baseCard/BaseCardLoading";
import { NoResults } from "../../components/noResults/NoResults";
import { IModelFavoritesProvider } from "../../contexts/IModelFavoritesContext";
import {
  type AccessTokenProvider,
  type ApiOverrides,
  type IModelFull,
  type IModelTableOverridesMUI,
  DataStatus,
  IModelSortOptions,
} from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import {
  addIModelToRecents,
  removeIModelFromRecents,
} from "../../utils/iModelApi";
import {
  type IModelTileMUIProps,
  IModelTileMUI,
} from "../iModelTiles/IModelTileMUI";
import { clientSideIModelSort } from "./clientSideIModelSort";
import type { IModelGridProps } from "./IModelGrid";
import { type IModelTableMUIStrings, IModelTableMUI } from "./IModelTableMUI";
import { DEFAULT_PAGE_SIZE, useIModelData } from "./useIModelData";

/** @alpha */
export interface IModelGridMUIProps
  extends Omit<
    IModelGridProps,
    | "onThumbnailClick"
    | "iModelActions"
    | "useIndividualState"
    | "tileOverrides"
    | "cellOverrides"
    | "tableOverrides"
    | "status"
    | "removeFromRecentsIcon"
    | "onOpen"
  > {
  /**
   * Factory that returns actions for a given iModel.
   *
   * - **Single action** — the tile title becomes a clickable link; a table row click fires the action.
   * - **Multiple actions** — rendered as buttons in the tile footer; the first action still drives table row click.
   *
   * The grid automatically wraps the first action with recents tracking
   * unless `disableAddToRecents` is true.
   *
   * @example
   * ```tsx
   * actions={(iModel) => [
   *   { key: "open", label: iModel.displayName, onClick: () => navigate(`/imodels/${iModel.id}`) },
   * ]}
   * ```
   */
  actions?: (iModel: IModelFull) => BaseCardActionItem[];
  /** List of actions to build for each imodel context menu. */
  moreActions?: ContextMenuBuilderItemMUI<IModelFull>[];
  /** Custom icon for the "Remove from recents" context menu action. Only applies when requestType is "recents". Should be a Stratakit SVG href. */
  removeFromRecentsIcon?: string;
  useIndividualState?: (
    iModel: IModelFull,
    iModelTileProps: IModelTileMUIProps
  ) => Partial<IModelTileMUIProps>;
  /** Static props to apply over each tile, mainly used for tileProps, overrides IModelGrid provided values */
  tileOverrides?: Partial<IModelTileMUIProps>;
  tableOverrides?: IModelTableOverridesMUI;
  stringsOverrides?: Partial<IModelTableMUIStrings>;
}

/**
 * Component to display a grid or table of iModels within a given iTwin.
 *
 * This is the Stratakit/MUI version of the IModelGrid. It is still under active development and may have breaking changes.
 *
 * Feedback is most welcome.
 * @alpha
 */
export const IModelGridMUI = (props: IModelGridMUIProps) => {
  return (
    <IModelFavoritesProvider
      iTwinId={props.iTwinId}
      accessToken={props.accessToken}
      serverEnvironmentPrefix={props.apiOverrides?.serverEnvironmentPrefix}
      disabled={props.tileOverrides?.hideFavoriteIcon}
    >
      <IModelGridInternal {...props} />
    </IModelFavoritesProvider>
  );
};
const IModelGridInternal = ({
  accessToken,
  apiOverrides,
  moreActions,
  removeFromRecentsIcon,
  actions,
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
  tableOverrides,
  className,
  onLoadMore,
  onRefetch,
  dataMode = "internal",
  disableAddToRecents = false,
}: IModelGridMUIProps) => {
  const [sort, setSort] = React.useState<IModelSortOptions>(sortOptions);

  React.useEffect(() => {
    setSort(
      viewMode === "cells"
        ? {
            sortType: "name",
            descending: false,
          }
        : {
            sortType: sortOptions.sortType,
            descending: sortOptions.descending,
          }
    );
  }, [sortOptions.descending, sortOptions.sortType, viewMode]);

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
      moreOptions: "More options",
      noRowsLabel: "No rows",
      noResultsOverlayLabel: "No results found.",
      paginationRowsPerPage: "Rows per page:",
      footerRowSelected: (count: number): React.ReactNode =>
        count !== 1
          ? `${count.toLocaleString()} rows selected`
          : `${count.toLocaleString()} row selected`,
      footerTotalVisibleRows: (
        visibleCount: number,
        totalCount: number
      ): React.ReactNode =>
        `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,
    },
    stringsOverrides
  );

  const enhancedMoreActions = React.useMemo(() => {
    // Add "Remove from recents" action when viewing recents
    if (requestType === "recents") {
      const action = removeFromRecentsAction(
        strings,
        accessToken,
        apiOverrides,
        removeFromRecentsIcon
      );
      return moreActions ? [action, ...moreActions] : [action];
    }
    return moreActions;
  }, [
    requestType,
    moreActions,
    strings,
    removeFromRecentsIcon,
    accessToken,
    apiOverrides,
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

  const iModels = React.useMemo(() => {
    const processed =
      postProcessCallback?.([...fetchediModels], fetchStatus, searchText) ??
      fetchediModels;
    return clientSideIModelSort(processed, { viewMode, requestType, sort });
  }, [
    postProcessCallback,
    fetchediModels,
    fetchStatus,
    searchText,
    viewMode,
    requestType,
    sort,
  ]);

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
    clickFn();
  };

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

  const withRecentsTracking = React.useCallback(
    (iModel: IModelFull, actionItems: BaseCardActionItem[]) => {
      if (!actionItems.length) {
        return actionItems;
      }
      const [first, ...rest] = actionItems;
      return [
        {
          ...first,
          onClick: first.onClick
            ? () => iModelClickAndAddToRecents(iModel, first.onClick!)
            : undefined,
        },
        ...rest,
      ];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken, disableAddToRecents, apiOverrides?.serverEnvironmentPrefix]
  );

  const renderIModelGridStructure = () => {
    return (
      <>
        {viewMode !== "cells" ? (
          <Box
            component="ul"
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: "repeat(auto-fill, minmax(22.5rem, 1fr))",
              listStyle: "none",
              p: 0,
              m: 0,
            }}
            className={className}
            data-testid="itwin-grid"
          >
            {iModels?.map((iModel) => (
              <li key={iModel.id}>
                <IModelHookedTile
                  iModel={iModel}
                  moreActions={enhancedMoreActions}
                  accessToken={accessToken}
                  apiOverrides={tileApiOverrides}
                  useTileState={useIndividualState}
                  refetchIModels={refetchIModels}
                  stringsOverrides={stringsOverrides}
                  {...tileOverrides}
                  actions={
                    actions
                      ? withRecentsTracking(iModel, actions(iModel))
                      : undefined
                  }
                />
              </li>
            ))}
            {fetchMore ? (
              <li>
                <InView
                  onChange={(inView) => {
                    inView &&
                      fetchStatus !== DataStatus.Fetching &&
                      fetchMore();
                  }}
                >
                  {({ ref }) => {
                    return <BaseCardLoading ref={ref} />;
                  }}
                </InView>
              </li>
            ) : null}
            {fetchStatus === DataStatus.Fetching && (
              <>
                <li>
                  <BaseCardLoading />
                </li>
                <li>
                  <BaseCardLoading />
                </li>
              </>
            )}
          </Box>
        ) : (
          <IModelTableMUI
            iModels={iModels}
            moreActions={enhancedMoreActions}
            actions={
              actions
                ? (iModel: IModelFull) =>
                    withRecentsTracking(iModel, actions(iModel))
                : undefined
            }
            strings={strings}
            refetchIModels={refetchIModels}
            tableOverrides={tableOverrides}
            isLoading={fetchStatus === DataStatus.Fetching}
            fetchMore={fetchMore}
            data-testid="itwin-table"
          />
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

type IModelHookedTileProps = IModelTileMUIProps & {
  useTileState?: (
    iModel: IModelFull,
    iModelTileProps: IModelTileMUIProps
  ) => Partial<IModelTileMUIProps>;
};
const noOp = () => ({} as Partial<IModelTileMUIProps>);

const IModelHookedTile = (props: IModelHookedTileProps) => {
  const { useTileState = noOp, ...iModelTileProps } = props;

  const hookIdentity = React.useRef(useTileState);

  if (hookIdentity.current !== useTileState) {
    throw new Error(
      "Even when used in a prop, useIndividualState identity must remain stable as it is used as a hook."
    );
  }

  const tileState = useTileState(props.iModel, iModelTileProps);

  return <IModelTileMUI {...iModelTileProps} {...tileState} />;
};

function removeFromRecentsAction(
  strings: IModelGridProps["stringsOverrides"],
  accessToken?: AccessTokenProvider,
  apiOverrides?: ApiOverrides<IModelFull[]>,
  removeFromRecentsIcon?: string
): ContextMenuBuilderItemMUI<IModelFull> {
  return {
    key: "remove-from-recents",
    icon: removeFromRecentsIcon,
    children: strings?.removeFromRecents ?? "Remove from recents",
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
}
