/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { DataStatus } from "../types";
import {
  InfiniteQueryAction,
  InfiniteQueryPolicy,
  InfiniteQueryState,
  initialUndecidedState,
  LoadedPage,
  PageRequest,
  reduceInfiniteQuery,
} from "./infiniteQueryReducer";
import { useEventCallback } from "./useEventCallback";

export interface UseInfiniteQueryOptions<TQuery, TItem>
  extends InfiniteQueryPolicy<TQuery, TItem> {
  /** MUST be memoized. A new object every render restarts the query. */
  query: TQuery;
  fetchPage: (
    request: PageRequest<TQuery>,
    signal: AbortSignal
  ) => Promise<LoadedPage<TItem>>;
}

export interface InfiniteQueryResult<TItem> {
  items: TItem[];
  /** Undefined on the first render, before anything has been decided. */
  status: DataStatus | undefined;
  /** Whether a request is in flight. This is different from the status, which reports
   * `Fetching` only for the first page (existing behavior). Here we know a request
   * is in flight even after the first page has loaded. */
  isFetching: boolean;
  hasMore: boolean;
  error: unknown;
  totalCount: number | undefined;
  fetchNextPage: () => void;
  refetch: () => void;
}

const isAbortError = (error: unknown) =>
  error instanceof Error && error.name === "AbortError";

/**
 * Pages a query, one request at a time, dropping the answers of superseded requests.
 * `infiniteQueryReducer` is the single source of truth; the effects here only keep the pending
 * request in flight.
 */
export const useInfiniteQuery = <TQuery, TItem>({
  query,
  fetchPage,
  resolveLocally,
  shouldRestartQuery,
}: UseInfiniteQueryOptions<TQuery, TItem>): InfiniteQueryResult<TItem> => {
  const reduce = (
    current: InfiniteQueryState<TQuery, TItem>,
    action: InfiniteQueryAction<TQuery, TItem>
  ) =>
    reduceInfiniteQuery(current, action, {
      resolveLocally,
      shouldRestartQuery,
    });
  const [state, dispatch] = React.useReducer(reduce, query, (initial: TQuery) =>
    initialUndecidedState<TQuery, TItem>(initial)
  );

  // The query prop moved ahead of the state. Dispatching during render is React's documented way
  // to adjust state on a prop change: it re-renders with the reduced state before committing.
  if (state.query !== query) {
    dispatch({ type: "queryChanged", query });
  }

  React.useEffect(() => dispatch({ type: "start" }), []);

  const runFetchPage = useEventCallback(fetchPage);
  React.useEffect(() => {
    const request = state.pendingRequest;
    if (request === undefined) {
      return;
    }
    const controller = new AbortController();
    void runFetchPage(request, controller.signal).then(
      (page) => {
        if (!controller.signal.aborted) {
          dispatch({ type: "pageLoaded", request, page });
        }
      },
      (error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) {
          return;
        }
        dispatch({ type: "pageFailed", request, error });
      }
    );
    return () => controller.abort();
  }, [state.pendingRequest, runFetchPage]);

  const fetchNextPage = React.useCallback(
    () => dispatch({ type: "fetchNextPage" }),
    []
  );
  const refetch = React.useCallback(() => dispatch({ type: "refetch" }), []);

  return {
    items: state.items,
    status: state.status,
    isFetching: state.pendingRequest !== undefined,
    hasMore: state.hasMore,
    error: state.error,
    totalCount: state.totalCount,
    fetchNextPage,
    refetch,
  };
};
