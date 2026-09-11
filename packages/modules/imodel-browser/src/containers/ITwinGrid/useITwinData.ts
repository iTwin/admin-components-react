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

/**
 * Identifies the credential: the token itself for a string, `"provider"` for a function. Keying on
 * a function's identity would refetch every render, so the provider is read at request time.
 *
 * The trade-off: every function is the same key, so swapping one provider for another does not
 * restart a settled query. Note `<ITwinGrid>` still documents that a provider must be memoized,
 * because `useITwinFavorites` keys on its identity.
 */
const toCredentialKey = (accessToken?: AccessTokenProvider) => {
  if (typeof accessToken === "function") {
    return "provider";
  }
  // An empty token means no credential, so `??` would be wrong here.
  if (accessToken === undefined || accessToken === "") {
    return undefined;
  }
  return accessToken;
};

/** Provided data wins over a missing token. */
const resolveITwinQueryLocally = (
  query: ITwinQueryParams
): LocalResolution<ITwinFull> | undefined => {
  if (query.providedData !== undefined) {
    return { status: DataStatus.Complete, items: query.providedData };
  }
  if (query.credentialKey === undefined) {
    return { status: DataStatus.TokenRequired };
  }
  return undefined;
};

const differsOnlyByFilterText = (a: ITwinQueryParams, b: ITwinQueryParams) =>
  a.requestType === b.requestType &&
  a.iTwinSubClass === b.iTwinSubClass &&
  a.orderby === b.orderby &&
  a.credentialKey === b.credentialKey &&
  a.serverEnvironmentPrefix === b.serverEnvironmentPrefix &&
  a.providedData === b.providedData;

/**
 * Favorites and recents are filtered in the browser, so once every page is loaded the iTwins in
 * hand already answer a new filter text. Anything else restarts the query.
 */
const decideOnITwinQueryChange = (
  previous: ITwinQueryParams,
  next: ITwinQueryParams,
  loaded: { hasMore: boolean }
) =>
  isClientSideFiltered(next.requestType) &&
  differsOnlyByFilterText(previous, next) &&
  !loaded.hasMore
    ? "keep"
    : "restart";

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
  const credentialKey = toCredentialKey(accessToken);
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
      credentialKey,
      serverEnvironmentPrefix,
      providedData,
    }),
    [dataQuery, credentialKey, serverEnvironmentPrefix, providedData]
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
      decideOnQueryChange: decideOnITwinQueryChange,
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
