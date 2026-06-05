/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./ITwinGrid.scss";

import React from "react";
import { InView } from "react-intersection-observer";
import Box from "@mui/material/Box";
import { NoResults } from "../../components/noResults/NoResults";
import {
  DataStatus,
  type ITwinTableOverridesMUI,
  type ITwinFull,
} from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import { useITwinData } from "./useITwinData";
import { useITwinFavorites } from "./useITwinFavorites";
import { ITwinTableMUI, type ITwinTableMUIStrings } from "./ITwinTableMUI";
import { ITwinTileMUI, type ITwinTilePropsMUI } from "./ITwinTileMUI";
import { BaseCardLoading } from "../../components/baseCard/BaseCardLoading";
import type { ITwinGridProps, ITwinGridStrings } from "./ITwinGrid";

/** @alpha */
export type IndividualITwinStateHookMUI = (
  iTwin: ITwinFull,
  iTwinTileProps: ITwinTilePropsMUI & {
    gridProps: ITwinGridPropsMUI;
  }
) => Partial<ITwinTilePropsMUI>;

/** @alpha */
export interface ITwinGridStringsMUI
  extends ITwinGridStrings,
    ITwinTableMUIStrings {}

/** @alpha */
export interface ITwinGridPropsMUI
  extends Omit<
    ITwinGridProps,
    | "onThumbnailClick"
    | "iTwinActions"
    | "tileOverrides"
    | "useIndividualState"
    | "cellOverrides"
    | "tableOverrides"
    | "stringsOverrides"
  > {
  /** Select handler for the iTwin tile. */
  onSelect?(iTwin: ITwinFull): void;
  /** Open handler for the iTwin tile. */
  onOpen?(iTwin: ITwinFull): void;
  /** List of actions to build for each iTwin context menu. */
  iTwinActions?: ContextMenuBuilderItemMUI<ITwinFull>[];
  /** Function (can be a react hook) that returns state for an iTwin, returned values will be applied as props to the iTwinTile, overrides ITwinGrid provided values */
  useIndividualState?: IndividualITwinStateHookMUI;
  /** Static props to apply over each tile, mainly used for tileProps, overrides ITwinGrid provided values */
  tileOverrides?: Partial<ITwinTilePropsMUI>;
  /** Overrides for table column definitions and visibility in cells viewMode */
  tableOverrides?: ITwinTableOverridesMUI;
  /** Localized string overrides - falls back to default English strings if not provided */
  stringsOverrides?: Partial<ITwinGridStringsMUI>;
}

/**
 * Component that will allow displaying a grid of iTwins, given a requestType
 * @alpha
 */
export const ITwinGridMUI = ({
  accessToken,
  apiOverrides,
  filterOptions,
  orderbyOptions,
  onSelect,
  onOpen,
  iTwinActions,
  requestType,
  iTwinSubClass,
  stringsOverrides,
  tileOverrides,
  useIndividualState,
  postProcessCallback,
  viewMode,
  tableOverrides,
  className,
}: ITwinGridPropsMUI) => {
  const [selectedITwinId, setSelectedITwinId] = React.useState<
    string | undefined
  >();

  const {
    iTwinFavorites,
    addITwinToFavorites,
    removeITwinFromFavorites,
    shouldRefetchFavorites,
    resetShouldRefetchFavorites,
  } = useITwinFavorites(accessToken, apiOverrides?.serverEnvironmentPrefix);

  const strings = _mergeStrings(
    {
      tableColumnFavorites: "",
      tableColumnName: "iTwin Number",
      tableColumnDescription: "iTwin Name",
      tableColumnLastModified: "Last Modified",
      tableLoadingData: "Loading...",
      trialBadge: "Trial",
      inactiveBadge: "Inactive",
      noITwins:
        requestType === "recents"
          ? "No recent iTwins."
          : requestType === "favorites"
          ? "No favorite iTwins."
          : "No iTwin found.",
      noAuthentication: "No access token provided",
      error: "An error occurred",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
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
  const {
    iTwins: fetchedItwins,
    status: fetchStatus,
    fetchMore,
    refetchITwins,
  } = useITwinData({
    requestType,
    iTwinSubClass,
    accessToken,
    apiOverrides,
    filterOptions,
    orderbyOptions,
    shouldRefetchFavorites,
    resetShouldRefetchFavorites,
  });

  const iTwins = React.useMemo(
    () =>
      postProcessCallback?.([...fetchedItwins], fetchStatus) ?? fetchedItwins,
    [postProcessCallback, fetchedItwins, fetchStatus]
  );

  const noResultsText = {
    [DataStatus.Fetching]: "",
    [DataStatus.Complete]: strings.noITwins,
    [DataStatus.FetchFailed]: strings.error,
    [DataStatus.TokenRequired]: strings.noAuthentication,
    [DataStatus.ContextRequired]: "",
  }[fetchStatus ?? DataStatus.Fetching];

  return viewMode !== "cells" ? (
    iTwins.length === 0 && noResultsText ? (
      <NoResults text={noResultsText} />
    ) : (
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fill, minmax(22.5rem, 1fr))",
        }}
        className={className}
      >
        {fetchStatus === DataStatus.Fetching ? (
          <>
            <BaseCardLoading />
            <BaseCardLoading />
            <BaseCardLoading />
          </>
        ) : (
          <>
            {iTwins?.map((iTwin) => (
              <ITwinHookedTile
                gridProps={{
                  accessToken,
                  apiOverrides,
                  filterOptions,
                  onSelect,
                  onOpen,
                  requestType,
                  stringsOverrides,
                  tileOverrides,
                  useIndividualState,
                }}
                key={iTwin.id}
                iTwin={iTwin}
                contextMenuItems={iTwinActions}
                selected={
                  selectedITwinId === iTwin.id || tileOverrides?.selected
                }
                onOpen={onOpen ? () => onOpen(iTwin) : undefined}
                useTileState={useIndividualState}
                isFavorite={iTwinFavorites.has(iTwin.id)}
                addToFavorites={addITwinToFavorites}
                removeFromFavorites={removeITwinFromFavorites}
                refetchITwins={refetchITwins}
                stringsOverrides={stringsOverrides}
                thumbnail={iTwin.image} // This is a fix for https://github.com/iTwin/admin-components-react/issues/196
                {...tileOverrides}
                onSelect={() => {
                  if (selectedITwinId === iTwin.id && onOpen) {
                    onOpen(iTwin);
                  } else {
                    setSelectedITwinId(iTwin.id);
                    tileOverrides?.onSelect
                      ? tileOverrides.onSelect(iTwin)
                      : onSelect?.(iTwin);
                  }
                }}
              />
            ))}
            {fetchMore ? (
              <>
                <InView
                  onChange={(inView) => {
                    inView && fetchMore();
                  }}
                >
                  <BaseCardLoading />
                </InView>
                <BaseCardLoading />
                <BaseCardLoading />
              </>
            ) : null}
          </>
        )}
      </Box>
    )
  ) : (
    <ITwinTableMUI
      iTwins={iTwins}
      iTwinActions={iTwinActions}
      onOpen={onOpen}
      strings={strings}
      iTwinFavorites={iTwinFavorites}
      addITwinToFavorites={addITwinToFavorites}
      removeITwinFromFavorites={removeITwinFromFavorites}
      refetchITwins={refetchITwins}
      tableOverrides={tableOverrides}
      isLoading={fetchStatus === DataStatus.Fetching}
      fetchMore={fetchMore}
    />
  );
};

type ITwinHookedTileProps = ITwinTilePropsMUI & {
  gridProps: ITwinGridPropsMUI;
  useTileState?: IndividualITwinStateHookMUI;
};
const noOp = () => ({} as Partial<ITwinTilePropsMUI>);
const ITwinHookedTile = (props: ITwinHookedTileProps) => {
  const { useTileState = noOp, ...iTwinTileProps } = props;

  const hookIdentity = React.useRef(useTileState);

  if (hookIdentity.current !== useTileState) {
    throw new Error(
      "Even when used in a prop, useIndividualState identity must remain stable as it is used as a hook."
    );
  }

  const tileState = useTileState(props.iTwin, iTwinTileProps);
  // gridProps aren't used by ITwinTileMUI but are passed to useIndividualState
  const { gridProps, ...tileProps } = props;
  return <ITwinTileMUI {...tileProps} {...tileState} />;
};
