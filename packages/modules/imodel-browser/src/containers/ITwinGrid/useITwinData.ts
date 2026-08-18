/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { useLogger } from "../../contexts/LoggerContext";
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
import { _getAPIServer } from "../../utils/_apiOverrides";
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

const PAGE_SIZE = 100;

interface FetchState {
  query: ITwinDataQuery;
  status: DataStatus;
  iTwins: ITwinFull[];
  hasMore: boolean;
  error?: unknown;
}

const isClientSideFiltered = (requestType: string) =>
  ["favorites", "recents"].includes(requestType);

const startingOver = (query: ITwinDataQuery): FetchState => ({
  query,
  status: DataStatus.Fetching,
  iTwins: [],
  hasMore: true,
  error: undefined,
});

const sameQuery = (a: ITwinDataQuery, b: ITwinDataQuery) =>
  a.requestType === b.requestType &&
  a.filterText === b.filterText &&
  a.iTwinSubClass === b.iTwinSubClass &&
  a.orderby === b.orderby;

const hasStartedOver = (state: FetchState, query: ITwinDataQuery) =>
  sameQuery(state.query, query) &&
  state.status === DataStatus.Fetching &&
  state.iTwins.length === 0 &&
  state.hasMore;

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
  const [fetchState, setFetchState] = React.useState<FetchState>(() =>
    startingOver(query)
  );
  const filteredProjects = useITwinFilter(fetchState.iTwins, filterOptions);

  const queryRef = React.useRef(query);
  const onDataStateChangeRef = React.useRef(onDataStateChange);
  React.useEffect(() => {
    queryRef.current = query;
    onDataStateChangeRef.current = onDataStateChange;
  });

  const dataState = React.useMemo<ITwinDataState>(
    () => ({ ...fetchState, iTwins: filteredProjects }),
    [fetchState, filteredProjects]
  );
  React.useEffect(() => {
    // The new query has not reached the state below yet, so reporting now would pair it with the
    // previous query's result.
    if (sameQuery(dataState.query, query)) {
      onDataStateChangeRef.current?.(dataState);
    }
  }, [dataState, query]);

  /** Start over for the query in hand. Reads it from the ref, never a closure: see resetData. */
  const reset = React.useCallback(() => {
    setFetchState((state) =>
      hasStartedOver(state, queryRef.current)
        ? state
        : startingOver(queryRef.current)
    );
  }, []);

  /** The iTwins in hand already answer the new query, so keep them and just retarget. */
  const applyQuery = React.useCallback((query: ITwinDataQuery) => {
    setFetchState((state) =>
      sameQuery(state.query, query) ? state : { ...state, query }
    );
  }, []);

  const markFetching = React.useCallback(() => {
    setFetchState((state) =>
      state.status === DataStatus.Fetching
        ? state
        : { ...state, status: DataStatus.Fetching, error: undefined }
    );
  }, []);

  const pageLoaded = React.useCallback(
    (page: { iTwins: ITwinFull[]; isFirstPage: boolean; hasMore: boolean }) => {
      setFetchState((state) => ({
        ...state,
        status: DataStatus.Complete,
        iTwins: page.isFirstPage
          ? page.iTwins
          : [...state.iTwins, ...page.iTwins],
        hasMore: page.hasMore,
        error: undefined,
      }));
    },
    []
  );

  const pageFailed = React.useCallback(
    (failure: { error: unknown; isFirstPage: boolean }) => {
      setFetchState((state) => ({
        ...state,
        status: DataStatus.FetchFailed,
        iTwins: failure.isFirstPage ? [] : state.iTwins,
        error: failure.error,
      }));
    },
    []
  );

  /** Leaves hasMore alone: flipping it here would re-run the fetch effect into this same branch. */
  const tokenRequired = React.useCallback(() => {
    setFetchState((state) => ({
      ...state,
      status: DataStatus.TokenRequired,
      iTwins: [],
      error: undefined,
    }));
  }, []);

  const dataProvided = React.useCallback((iTwins: ITwinFull[]) => {
    setFetchState((state) => ({
      ...state,
      status: DataStatus.Complete,
      iTwins,
      hasMore: false,
      error: undefined,
    }));
  }, []);

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

  const morePagesRef = React.useRef(fetchState.hasMore);
  React.useEffect(() => {
    morePagesRef.current = fetchState.hasMore;
  }, [fetchState.hasMore]);

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
    if (!fetchState.hasMore) {
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
    fetchState.hasMore,
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
    iTwins: filteredProjects,
    status: fetchState.status,
    totalCount,
    fetchMore: fetchState.hasMore ? fetchMore : undefined,
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
