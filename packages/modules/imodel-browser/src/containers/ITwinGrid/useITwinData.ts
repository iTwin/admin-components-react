/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { useLogger } from "../../contexts/LoggerContext";
import {
  AccessTokenProvider,
  ApiOverrides,
  ITwinDataQuery,
  ITwinDataState,
  ITwinFilterOptions,
  ITwinFull,
  ITwinSubClass,
} from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";
import { useITwinDataState } from "./useITwinDataState";

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

const PAGE_SIZE = 100;

const isClientSideFiltered = (requestType: string) =>
  ["favorites", "recents"].includes(requestType);

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
  const data = apiOverrides?.data;
  const serverEnvironmentPrefix = apiOverrides?.serverEnvironmentPrefix;
  const [totalCount, setTotalCount] = React.useState<number>();
  const [page, setPage] = React.useState(0);

  const query = React.useMemo<ITwinDataQuery>(
    () => ({
      requestType,
      filterText: filterOptions ?? "",
      iTwinSubClass,
      orderby: orderbyOptions,
    }),
    [requestType, filterOptions, iTwinSubClass, orderbyOptions]
  );
  const {
    status,
    iTwins,
    hasMore,
    reset,
    applyQuery,
    markFetching,
    pageLoaded,
    pageFailed,
    tokenRequired,
    dataProvided,
  } = useITwinDataState(query, onDataStateChange);

  const resetData = React.useCallback(() => {
    reset();
    setTotalCount(undefined);
    setPage(0);
    fetchingMoreRef.current = true;
    lastPageFailedRef.current = false;
  }, [reset]);

  // We start in a fetching state
  const fetchingMoreRef = React.useRef(true);
  const lastPageFailedRef = React.useRef(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const fetchMore = React.useCallback(() => {
    if (fetchingMoreRef.current) {
      return;
    }
    fetchingMoreRef.current = true;
    if (lastPageFailedRef.current) {
      // Ask for the same page again. Advancing would leave a hole where it should have been.
      lastPageFailedRef.current = false;
      setRetryCount((count) => count + 1);
      return;
    }
    setPage((page) => page + 1);
  }, []);

  // counter to force a new request when resetting the existing state would not change an effect dependency
  const [refetchCount, setRefetchCount] = React.useState(0);
  const refetchITwins = React.useCallback(() => {
    resetData();
    setRefetchCount((count) => count + 1);
  }, [resetData]);

  const activeRequestRef = React.useRef<symbol | undefined>(undefined);

  const morePagesRef = React.useRef(hasMore);
  React.useEffect(() => {
    morePagesRef.current = hasMore;
  }, [hasMore]);

  React.useEffect(() => {
    // If filter changes but we already have all the data for favorites or recents,
    // let client side filtering do its job, otherwise, refetch from scratch.
    // Use ref so "morePages" changes itself does not trigger the effect.
    if (morePagesRef.current || !isClientSideFiltered(requestType)) {
      resetData();
    } else {
      applyQuery(query);
    }
  }, [query, requestType, resetData, applyQuery]);

  React.useEffect(() => {
    // If any of the dependencies change, always restart the fetch from scratch.
    resetData();
  }, [
    accessToken,
    requestType,
    iTwinSubClass,
    orderbyOptions,
    data,
    serverEnvironmentPrefix,
    resetData,
  ]);

  React.useEffect(() => {
    if (!hasMore) {
      return;
    }
    if (data) {
      dataProvided(data);
      return;
    }
    if (!accessToken) {
      tokenRequired();
      return;
    }
    if (page === 0) {
      markFetching();
    }
    const requestId = Symbol();
    activeRequestRef.current = requestId;
    const { abortController, fetchITwins } = createFetchITwinsFn({
      query,
      accessToken,
      page,
      serverEnvironmentPrefix,
      shouldRefetchFavorites,
    });

    const applyResult = async () => {
      const result = await fetchITwins();
      if (activeRequestRef.current !== requestId) {
        return;
      }
      if (result.totalCount !== undefined) {
        setTotalCount(result.totalCount);
      }
      fetchingMoreRef.current = false;
      requestType === "favorites" && resetShouldRefetchFavorites?.();
      pageLoaded({
        iTwins: result.iTwins,
        isFirstPage: page === 0,
        hasMore: result.hasMore,
      });
    };

    applyResult().catch((e) => {
      if (activeRequestRef.current !== requestId || e.name === "AbortError") {
        // Superseded or aborted, not a failure worth reporting.
        return;
      }
      fetchingMoreRef.current = false;
      lastPageFailedRef.current = true;
      pageFailed({ error: e, isFirstPage: page === 0 });
      logger.logError("Failed to fetch iTwins", e);
    });
    return () => {
      activeRequestRef.current = undefined;
      abortController.abort();
    };
  }, [
    accessToken,
    requestType,
    data,
    serverEnvironmentPrefix,
    query,
    page,
    hasMore,
    refetchCount,
    retryCount,
    shouldRefetchFavorites,
    resetShouldRefetchFavorites,
    logger,
    dataProvided,
    tokenRequired,
    markFetching,
    pageLoaded,
    pageFailed,
  ]);
  return {
    iTwins,
    status,
    totalCount,
    fetchMore: hasMore ? fetchMore : undefined,
    refetchITwins,
  };
};

/**
 * Builds the request for one page of iTwins. Resolves with the page, or throws what the API
 * answered. A totalCount of undefined means the response carried no count, which is not zero.
 */
const createFetchITwinsFn = ({
  query,
  accessToken,
  page,
  serverEnvironmentPrefix,
  shouldRefetchFavorites,
}: {
  query: ITwinDataQuery;
  accessToken: AccessTokenProvider;
  page: number;
  serverEnvironmentPrefix?: "" | "dev" | "qa";
  shouldRefetchFavorites?: boolean;
}): {
  abortController: AbortController;
  fetchITwins: () => Promise<{
    iTwins: ITwinFull[];
    totalCount: number | undefined;
    hasMore: boolean;
  }>;
} => {
  const { requestType, filterText, iTwinSubClass, orderby } = query;
  const clientSideFiltered = isClientSideFiltered(requestType);
  const endpoint = clientSideFiltered ? requestType : "";
  const subClass = `?subClass=${iTwinSubClass === "All" ? "" : iTwinSubClass}`;
  const paging = `&$skip=${page * PAGE_SIZE}&$top=${PAGE_SIZE}`;
  const search =
    clientSideFiltered || !filterText
      ? ""
      : `&$search=${encodeURIComponent(filterText.trim())}`;
  const ordering =
    clientSideFiltered || !orderby
      ? ""
      : `&$orderby=${encodeURIComponent(orderby.trim())}`;

  const abortController = new AbortController();
  const url = `${_getAPIServer(
    serverEnvironmentPrefix
  )}/itwins/${endpoint}${subClass}${paging}${search}${ordering}`;

  const doFetchRequest = async () => {
    const options: RequestInit = {
      signal: abortController.signal,
      headers: {
        "Cache-Control":
          requestType === "favorites" && shouldRefetchFavorites
            ? "no-cache"
            : "",
        Authorization:
          typeof accessToken === "function" ? await accessToken() : accessToken,
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
        Prefer: "return=representation",
        "x-total-count": "true",
      },
    };

    const response = await fetch(url, options);
    const result: { iTwins: ITwinFull[] } = response.ok
      ? await response.json()
      : await response.text().then((errorText) => {
          throw new Error(errorText);
        });

    const totalCountHeader = response.headers.get("x-total-count");
    return {
      iTwins: result.iTwins,
      totalCount:
        totalCountHeader !== null ? Number(totalCountHeader) : undefined,
      hasMore: result.iTwins.length === PAGE_SIZE,
    };
  };

  return { abortController, fetchITwins: doFetchRequest };
};
