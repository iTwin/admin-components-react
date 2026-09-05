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
  /** Resolves with one page, or rejects with what the source answered. */
  fetchPage: (
    request: PageRequest<TQuery>,
    signal: AbortSignal
  ) => Promise<LoadedPage<TItem>>;
}

export interface InfiniteQueryResult<TItem> {
  items: TItem[];
  /** Undefined on the first render, before anything has been decided. */
  status: DataStatus | undefined;
  /** Whether a page is in flight, which a later page does not show in the status. */
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
 * Pages a query, one request at a time, and drops the answers of superseded requests. The state
 * machine in `infiniteQueryReducer` is the single source of truth; the two effects here only start
 * the query and keep the pending request in flight.
 */
export const useInfiniteQuery = <TQuery, TItem>({
  query,
  fetchPage,
  resolveLocally,
  decideOnQueryChange,
}: UseInfiniteQueryOptions<TQuery, TItem>): InfiniteQueryResult<TItem> => {
  const reduce = (
    current: InfiniteQueryState<TQuery, TItem>,
    action: InfiniteQueryAction<TQuery, TItem>
  ) =>
    reduceInfiniteQuery(current, action, {
      resolveLocally,
      decideOnQueryChange,
    });
  const [state, dispatch] = React.useReducer(reduce, query, (initial: TQuery) =>
    initialUndecidedState<TQuery, TItem>(initial)
  );

  // The query prop moved ahead of the state. Telling the reducer during render makes React
  // re-render with the reduced state before anything is committed: its documented way to adjust
  // state when a prop changes, with no effect and no intermediate commit.
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
