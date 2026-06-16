/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import React from "react";
import { InView } from "react-intersection-observer";

import type {
  ITwinGridProps,
  ITwinGridStrings,
} from "../../../containers/ITwinGrid/ITwinGrid";
import { useITwinData } from "../../../containers/ITwinGrid/useITwinData";
import { useITwinFavorites } from "../../../containers/ITwinGrid/useITwinFavorites";
import { type ITwinFull, DataStatus } from "../../../types";
import { _mergeStrings } from "../../../utils/_apiOverrides";
import {
  type CardActionsItemMUI,
  MoreActionsMenuItemMUI,
  resolveCardActionsItemsMUI,
} from "../../../utils/_buildMenuOptions";
import { BaseCardLoading } from "../../components/baseCard/BaseCardLoading";
import { NoResultsMUI } from "../../components/noResults/NoResultsMUI";
import { type ITwinTableOverridesMUI } from "../../types";
import { stripNonTileProps } from "../../utils/stripNonTileProps";
import { type ITwinTableMUIStrings, ITwinTableMUI } from "./ITwinTableMUI";
import { type ITwinTilePropsMUI, ITwinTileMUI } from "./ITwinTileMUI";

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
    | "status"
    | "onOpen"
  > {
  /**
   * Factory that returns actions for a given iTwin.
   *
   * - **Single action** — the tile title becomes a clickable link; a table row click fires the action.
   * - **Multiple actions** — rendered as buttons in the tile footer; the first action still drives table row click.
   *
   * @example
   * ```tsx
   * actions={[
   *   { key: "open", label: (iTwin) => iTwin.displayName, onClick: (iTwin) => navigate(`/itwins/${iTwin.id}`) },
   * ]}
   * ```
   */
  actions?: CardActionsItemMUI<ITwinFull>[];
  /** List of actions to build for each iTwin context menu. */
  moreActions?: MoreActionsMenuItemMUI<ITwinFull>[];
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
  actions,
  moreActions,
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
  const {
    iTwinFavorites,
    addITwinToFavorites,
    removeITwinFromFavorites,
    shouldRefetchFavorites,
    resetShouldRefetchFavorites,
  } = useITwinFavorites(accessToken, apiOverrides?.serverEnvironmentPrefix);

  const strings = React.useMemo(
    () =>
      _mergeStrings(
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
              : "No iTwins found.",
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
      ),
    [requestType, stringsOverrides]
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

  if (iTwins.length === 0 && noResultsText) {
    return <NoResultsMUI text={noResultsText} />;
  }

  return viewMode !== "cells" ? (
    <Box
      component="ul"
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: "repeat(auto-fill, minmax(22.5rem, 1fr))",
        listStyle: "none",
        alignItems: "stretch",
        "& > li": {
          display: "flex",
          minWidth: 0,
        },
        "& > li > *": {
          flex: 1,
          minWidth: 0,
        },
        p: 0,
        m: 0,
      }}
      className={className}
    >
      {fetchStatus === DataStatus.Fetching ? (
        <>
          <li>
            <BaseCardLoading />
          </li>
          <li>
            <BaseCardLoading />
          </li>
          <li>
            <BaseCardLoading />
          </li>
        </>
      ) : (
        <>
          {iTwins?.map((iTwin) => (
            <li key={iTwin.id}>
              <ITwinHookedTile
                gridProps={{
                  accessToken,
                  apiOverrides,
                  filterOptions,
                  actions,
                  requestType,
                  stringsOverrides,
                  tileOverrides,
                  useIndividualState,
                }}
                iTwin={iTwin}
                moreActions={moreActions}
                actions={
                  actions
                    ? resolveCardActionsItemsMUI(actions, iTwin)
                    : undefined
                }
                useTileState={useIndividualState}
                isFavorite={iTwinFavorites.has(iTwin.id)}
                addToFavorites={addITwinToFavorites}
                removeFromFavorites={removeITwinFromFavorites}
                refetchITwins={refetchITwins}
                stringsOverrides={stringsOverrides}
                thumbnail={iTwin.image} // This is a fix for https://github.com/iTwin/admin-components-react/issues/196
                {...tileOverrides}
              />
            </li>
          ))}
          {fetchMore ? (
            <>
              <li>
                <InView
                  onChange={(inView) => {
                    inView && fetchMore();
                  }}
                >
                  <BaseCardLoading />
                </InView>
              </li>
              <li>
                <BaseCardLoading />
              </li>
              <li>
                <BaseCardLoading />
              </li>
            </>
          ) : null}
        </>
      )}
    </Box>
  ) : (
    <ITwinTableMUI
      iTwins={iTwins}
      moreActions={moreActions}
      actions={
        actions
          ? (iTwin: ITwinFull) => resolveCardActionsItemsMUI(actions, iTwin)
          : undefined
      }
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
  const { useTileState = noOp, ...rest } = props;

  const hookIdentity = React.useRef(useTileState);

  if (hookIdentity.current !== useTileState) {
    throw new Error(
      "Even when used in a prop, useIndividualState identity must remain stable as it is used as a hook."
    );
  }

  const useIndividualStateResult = useTileState(props.iTwin, rest);
  const tileProps = stripNonTileProps(rest);
  const tileState = stripNonTileProps(useIndividualStateResult);
  return <ITwinTileMUI {...tileProps} {...tileState} />;
};
