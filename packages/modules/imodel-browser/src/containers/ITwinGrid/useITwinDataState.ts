/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import {
  DataStatus,
  ITwinDataQuery,
  ITwinDataState,
  ITwinFull,
} from "../../types";
import { useITwinFilter } from "./useITwinFilter";

/** One object, so a render can never pair one query's status with another query's iTwins. */
interface FetchState extends Omit<ITwinDataState, "iTwins" | "status"> {
  /** Every page fetched, where a report carries only what client side filtering kept. */
  iTwins: ITwinFull[];
  /** Undefined until the first transition, which is what postProcessCallback sees on first render. */
  status: DataStatus | undefined;
}

const startingOver = (query: ITwinDataQuery): FetchState => ({
  query,
  status: DataStatus.Fetching,
  iTwins: [],
  hasMore: true,
  error: undefined,
});

const nothingDecidedYet = (query: ITwinDataQuery): FetchState => ({
  ...startingOver(query),
  status: undefined,
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

export const useITwinDataState = (
  /** MUST be memoized. A new object every render reports the same state again on every render. */
  query: ITwinDataQuery,
  onDataStateChange?: (state: ITwinDataState) => void
) => {
  const [fetchState, setFetchState] = React.useState<FetchState>(() =>
    nothingDecidedYet(query)
  );
  const iTwins = useITwinFilter(fetchState.iTwins, query.filterText);

  const queryRef = React.useRef(query);
  const onDataStateChangeRef = React.useRef(onDataStateChange);
  React.useEffect(() => {
    queryRef.current = query;
    onDataStateChangeRef.current = onDataStateChange;
  });

  const dataState = React.useMemo<ITwinDataState | undefined>(() => {
    const { status } = fetchState;
    return status === undefined ? undefined : { ...fetchState, status, iTwins };
  }, [fetchState, iTwins]);
  React.useEffect(() => {
    // The new query has not reached the state yet, so reporting now would pair it with the
    // previous query's result.
    if (dataState && sameQuery(dataState.query, query)) {
      onDataStateChangeRef.current?.(dataState);
    }
  }, [dataState, query]);

  /** Start over for the query in hand. Reads it from the ref so the caller can reset from an
   * effect that must not depend on the query. */
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

  /** Leaves hasMore alone: flipping it here would re-run the caller's fetch effect into this
   * same branch. */
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

  return {
    status: fetchState.status,
    iTwins,
    hasMore: fetchState.hasMore,
    reset,
    applyQuery,
    markFetching,
    pageLoaded,
    pageFailed,
    tokenRequired,
    dataProvided,
  };
};
