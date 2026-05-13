/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./ITwinGrid.scss";

import { Table, ThemeProvider } from "@itwin/itwinui-react";
import React from "react";
import { InView } from "react-intersection-observer";
import { NoResults } from "../../components/noResults/NoResults";
import { DataStatus, type ITwinFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import { useITwinData } from "./useITwinData";
import { useITwinFavorites } from "./useITwinFavorites";
import { useITwinTableConfig } from "./useITwinTableConfig";
import { Box } from "@mui/material";
import { ITwinTileMUI, type ITwinTileMUIProps } from "./ITwinTileMUI";
import { BaseCardLoading } from "../../components/baseCard/BaseCardLoading";
import type { ITwinGridProps, ITwinGridStrings } from "./ITwinGrid";

export type IndividualITwinStateHookMUI = (
  iTwin: ITwinFull,
  iTwinTileProps: ITwinTileMUIProps & {
    gridProps: ITwinGridMUIProps;
  }
) => Partial<ITwinTileMUIProps>;

export { ITwinGridStrings };

export interface ITwinGridMUIProps
  extends Omit<
    ITwinGridProps,
    "onThumbnailClick" | "iTwinActions" | "tileOverrides" | "useIndividualState"
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
  tileOverrides?: Partial<ITwinTileMUIProps>;
}

/**
 * Component that will allow displaying a grid of iTwins, given a requestType
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
  cellOverrides,
  className,
}: ITwinGridMUIProps) => {
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

  const { columns, onRowClick } = useITwinTableConfig({
    iTwinActions,
    onThumbnailClick: onSelect,
    strings,
    iTwinFavorites,
    addITwinToFavorites,
    removeITwinFromFavorites,
    refetchITwins,
    cellOverrides,
  } as any); // TODO: types

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
                onSelect={() => {
                  setSelectedITwinId(iTwin.id);
                  onSelect?.(iTwin);
                }}
                onOpen={onOpen ? () => onOpen(iTwin) : undefined}
                useTileState={useIndividualState}
                isFavorite={iTwinFavorites.has(iTwin.id)}
                addToFavorites={addITwinToFavorites}
                removeFromFavorites={removeITwinFromFavorites}
                refetchITwins={refetchITwins}
                {...tileOverrides}
              />
            ))}
            {fetchMore ? (
              <>
                <InView onChange={fetchMore}>
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
    <ThemeProvider theme="inherit">
      <Table<{ [P in keyof ITwinFull]: ITwinFull[P] }>
        columns={columns}
        data={iTwins}
        onRowClick={onRowClick}
        emptyTableContent={
          fetchStatus === DataStatus.Fetching
            ? strings.tableLoadingData
            : strings.noITwins
        }
        isLoading={fetchStatus === DataStatus.Fetching}
        isSortable
        onBottomReached={fetchMore}
        autoResetFilters={false}
        autoResetSortBy={false}
        bodyProps={{ className: onSelect ? "row-cursor" : "" }}
      />
    </ThemeProvider>
  );
};

type ITwinHookedTileProps = ITwinTileMUIProps & {
  gridProps: ITwinGridMUIProps;
  useTileState?: IndividualITwinStateHookMUI;
};
const noOp = () => ({} as Partial<ITwinTileMUIProps>);
const ITwinHookedTile = (props: ITwinHookedTileProps) => {
  const { useTileState = noOp, ...iTwinTileProps } = props;

  const hookIdentity = React.useRef(useTileState);

  if (hookIdentity.current !== useTileState) {
    throw new Error(
      "Even when used in a prop, useTilePropsForIModel identity must remain stable as it is used as a hook."
    );
  }

  const tileState = useTileState(props.iTwin, iTwinTileProps);
  return <ITwinTileMUI {...iTwinTileProps} {...tileState} />;
};
