/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { useLogger } from "../../contexts/LoggerContext";
import { LocalResolution, PageRequest } from "../../hooks/infiniteQueryReducer";
import { useEventCallback } from "../../hooks/useEventCallback";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";
import {
  AccessTokenProvider,
  ApiOverrides,
  DataStatus,
  ITwinDataQuery,
  ITwinDataState,
  ITwinFilterOptions,
  ITwinFull,
  ITwinSubClass,
} from "../../types";
import {
  fetchITwinsPage,
  isClientSideFiltered,
  ITwinQueryParams,
} from "./iTwinsApi";
import { useITwinFilter } from "./useITwinFilter";

export interface ProjectDataHookOptions {
  requestType?: "favorites" | "recents" | "";
  iTwinSubClass?: ITwinSubClass;
  accessToken?: AccessTokenProvider;
  apiOverrides?: ApiOverrides<ITwinFull[]>;
  filterOptions?: ITwinFilterOptions;
  orderbyOptions?: string;
  shouldRefetchFavorites?: boolean;
  resetShouldRefetchFavorites?: () => void;
  onDataStateChange?: (state: ITwinDataState) => void;
}

/** Provided data wins over a missing token. */
const resolveITwinQueryLocally = (
  query: ITwinQueryParams
): LocalResolution<ITwinFull> | undefined => {
  if (query.providedData !== undefined) {
    return { status: DataStatus.Complete, items: query.providedData };
  }
  if (!query.accessToken) {
    return { status: DataStatus.TokenRequired };
  }
  return undefined;
};

const differsOnlyByFilterText = (a: ITwinQueryParams, b: ITwinQueryParams) =>
  a.requestType === b.requestType &&
  a.iTwinSubClass === b.iTwinSubClass &&
  a.orderby === b.orderby &&
  a.accessToken === b.accessToken &&
  a.serverEnvironmentPrefix === b.serverEnvironmentPrefix &&
  a.providedData === b.providedData;

/**
 * Favorites and recents are filtered in the browser, so once every page is loaded the iTwins in
 * hand already answer a new filter text. Anything else restarts the query.
 */
const shouldRestartITwinQuery = (
  previous: ITwinQueryParams,
  next: ITwinQueryParams,
  loaded: { hasMore: boolean }
) => {
  const answeredByClientSideFilter =
    isClientSideFiltered(next.requestType) &&
    differsOnlyByFilterText(previous, next) &&
    !loaded.hasMore;
  return !answeredByClientSideFilter;
};

/** A query with no credential resolves to TokenRequired, so no page is requested. */
const requireAccessToken = (accessToken?: AccessTokenProvider) => {
  if (accessToken === undefined || accessToken === "") {
    throw new Error("A page was requested without an access token");
  }
  return accessToken;
};

export const useITwinData = ({
  requestType = "",
  iTwinSubClass = "Project",
  accessToken,
  apiOverrides,
  filterOptions,
  orderbyOptions,
  shouldRefetchFavorites,
  resetShouldRefetchFavorites,
  onDataStateChange,
}: ProjectDataHookOptions) => {
  const logger = useLogger();
  const providedData = apiOverrides?.data;
  const serverEnvironmentPrefix = apiOverrides?.serverEnvironmentPrefix;

  const dataQuery = React.useMemo<ITwinDataQuery>(
    () => ({
      requestType,
      filterText: filterOptions ?? "",
      iTwinSubClass,
      orderby: orderbyOptions,
    }),
    [requestType, filterOptions, iTwinSubClass, orderbyOptions]
  );
  const queryParams = React.useMemo<ITwinQueryParams>(
    () => ({
      ...dataQuery,
      accessToken,
      serverEnvironmentPrefix,
      providedData,
    }),
    [dataQuery, accessToken, serverEnvironmentPrefix, providedData]
  );

  const fetchPage = async (
    request: PageRequest<ITwinQueryParams>,
    signal: AbortSignal
  ) => {
    const forFavorites = request.query.requestType === "favorites";
    const page = await fetchITwinsPage({
      query: request.query,
      page: request.page,
      accessToken: requireAccessToken(accessToken),
      bypassCache: forFavorites && Boolean(shouldRefetchFavorites),
      signal,
    });
    if (forFavorites && !signal.aborted) {
      resetShouldRefetchFavorites?.();
    }
    return page;
  };

  const { items, status, hasMore, error, totalCount, fetchNextPage, refetch } =
    useInfiniteQuery({
      query: queryParams,
      fetchPage,
      resolveLocally: resolveITwinQueryLocally,
      shouldRestartQuery: shouldRestartITwinQuery,
    });

  const iTwins = useITwinFilter(items, dataQuery.filterText);
  const dataState = React.useMemo<ITwinDataState | undefined>(
    () =>
      status === undefined
        ? undefined
        : { query: dataQuery, status, iTwins, hasMore, error },
    [status, dataQuery, iTwins, hasMore, error]
  );

  const reportDataState = useEventCallback(
    (state: ITwinDataState | undefined) => {
      if (state !== undefined) {
        onDataStateChange?.(state);
      }
    }
  );
  React.useEffect(() => {
    reportDataState(dataState);
  }, [dataState, reportDataState]);

  const reportFailure = useEventCallback((failure: unknown) => {
    if (failure !== undefined) {
      logger.logError("Failed to fetch iTwins", failure);
    }
  });
  React.useEffect(() => {
    reportFailure(error);
  }, [error, reportFailure]);

  return {
    iTwins,
    status,
    totalCount,
    fetchMore: hasMore ? fetchNextPage : undefined,
    refetchITwins: refetch,
  };
};
