/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { DataStatus } from "../types";

/** The id is what lets a late answer be recognised and dropped. */
export interface PageRequest<TQuery> {
  id: number;
  query: TQuery;
  page: number;
}

export interface LoadedPage<TItem> {
  items: TItem[];
  hasMore: boolean;
  /** Undefined when the response carried no count, which is not zero. */
  totalCount?: number;
}

export type LocalResolution<TItem> =
  | { status: DataStatus.Complete; items: TItem[] }
  | { status: DataStatus.TokenRequired | DataStatus.ContextRequired };

export interface InfiniteQueryPolicy<TQuery, TItem> {
  /** A settled answer needing no request, or undefined to fetch. */
  resolveLocally: (query: TQuery) => LocalResolution<TItem> | undefined;
  /** Whether the loaded items still answer the new query. */
  decideOnQueryChange: (
    previous: TQuery,
    next: TQuery,
    loaded: { hasMore: boolean }
  ) => "keep" | "restart";
}

export interface InfiniteQueryState<TQuery, TItem> {
  query: TQuery;
  /** Undefined only before the first transition. */
  status: DataStatus | undefined;
  items: TItem[];
  hasMore: boolean;
  error: unknown;
  totalCount: number | undefined;
  lastRequestedPage: number;
  pendingRequest: PageRequest<TQuery> | undefined;
  requestCount: number;
}

export type InfiniteQueryAction<TQuery, TItem> =
  | { type: "start" }
  | { type: "queryChanged"; query: TQuery }
  | {
      type: "pageLoaded";
      request: PageRequest<TQuery>;
      page: LoadedPage<TItem>;
    }
  | { type: "pageFailed"; request: PageRequest<TQuery>; error: unknown }
  | { type: "fetchNextPage" }
  | { type: "refetch" };

export const initialUndecidedState = <TQuery, TItem>(
  query: TQuery
): InfiniteQueryState<TQuery, TItem> => ({
  query,
  status: undefined,
  items: [],
  hasMore: true,
  error: undefined,
  totalCount: undefined,
  lastRequestedPage: 0,
  pendingRequest: undefined,
  requestCount: 0,
});

const answersThePendingRequest = <TQuery, TItem>(
  state: InfiniteQueryState<TQuery, TItem>,
  request: PageRequest<TQuery>
) => state.pendingRequest?.id === request.id;

const isFirstPage = <TQuery>(request: PageRequest<TQuery>) =>
  request.page === 0;

const localItems = <TItem>(resolution: LocalResolution<TItem>) =>
  resolution.status === DataStatus.Complete ? resolution.items : [];

/** Leaves the status alone: a later page loads behind a Complete status. */
const requestingPage = <TQuery, TItem>(
  state: InfiniteQueryState<TQuery, TItem>,
  page: number
): InfiniteQueryState<TQuery, TItem> => {
  const id = state.requestCount + 1;
  return {
    ...state,
    pendingRequest: { id, query: state.query, page },
    requestCount: id,
  };
};

const startingOver = <TQuery, TItem>(
  state: InfiniteQueryState<TQuery, TItem>,
  query: TQuery,
  policy: InfiniteQueryPolicy<TQuery, TItem>
): InfiniteQueryState<TQuery, TItem> => {
  const settled = {
    ...state,
    query,
    error: undefined,
    totalCount: undefined,
    lastRequestedPage: 0,
  };
  const resolution = policy.resolveLocally(query);
  if (resolution !== undefined) {
    return {
      ...settled,
      status: resolution.status,
      items: localItems(resolution),
      hasMore: false,
      pendingRequest: undefined,
    };
  }
  return requestingPage(
    { ...settled, status: DataStatus.Fetching, items: [], hasMore: true },
    0
  );
};

const nextPageToRequest = <TQuery, TItem>(
  state: InfiniteQueryState<TQuery, TItem>
) =>
  state.status === DataStatus.FetchFailed
    ? // Ask for the same page again. Advancing would leave a hole where it should have been.
      state.lastRequestedPage
    : state.lastRequestedPage + 1;

const reduceQueryChanged = <TQuery, TItem>(
  state: InfiniteQueryState<TQuery, TItem>,
  query: TQuery,
  policy: InfiniteQueryPolicy<TQuery, TItem>
): InfiniteQueryState<TQuery, TItem> => {
  if (Object.is(state.query, query)) {
    return state;
  }
  const nothingDecidedYet = state.status === undefined;
  if (nothingDecidedYet) {
    return { ...state, query };
  }
  const decision = policy.decideOnQueryChange(state.query, query, {
    hasMore: state.hasMore,
  });
  return decision === "keep"
    ? { ...state, query }
    : startingOver(state, query, policy);
};

const reducePageLoaded = <TQuery, TItem>(
  state: InfiniteQueryState<TQuery, TItem>,
  request: PageRequest<TQuery>,
  page: LoadedPage<TItem>
): InfiniteQueryState<TQuery, TItem> => {
  if (!answersThePendingRequest(state, request)) {
    return state;
  }
  return {
    ...state,
    status: DataStatus.Complete,
    items: isFirstPage(request) ? page.items : [...state.items, ...page.items],
    hasMore: page.hasMore,
    totalCount: page.totalCount ?? state.totalCount,
    error: undefined,
    lastRequestedPage: request.page,
    pendingRequest: undefined,
  };
};

const reducePageFailed = <TQuery, TItem>(
  state: InfiniteQueryState<TQuery, TItem>,
  request: PageRequest<TQuery>,
  error: unknown
): InfiniteQueryState<TQuery, TItem> => {
  if (!answersThePendingRequest(state, request)) {
    return state;
  }
  // hasMore is left alone, so a query change on a failed query still restarts it.
  return {
    ...state,
    status: DataStatus.FetchFailed,
    items: isFirstPage(request) ? [] : state.items,
    error,
    lastRequestedPage: request.page,
    pendingRequest: undefined,
  };
};

const reduceFetchNextPage = <TQuery, TItem>(
  state: InfiniteQueryState<TQuery, TItem>
): InfiniteQueryState<TQuery, TItem> => {
  const busyOrDone = state.pendingRequest !== undefined || !state.hasMore;
  return busyOrDone ? state : requestingPage(state, nextPageToRequest(state));
};

/** Every no-op returns the state it was given, so React bails out without a render. */
export const reduceInfiniteQuery = <TQuery, TItem>(
  state: InfiniteQueryState<TQuery, TItem>,
  action: InfiniteQueryAction<TQuery, TItem>,
  policy: InfiniteQueryPolicy<TQuery, TItem>
): InfiniteQueryState<TQuery, TItem> => {
  switch (action.type) {
    case "start":
      return state.status === undefined
        ? startingOver(state, state.query, policy)
        : state;
    case "queryChanged":
      return reduceQueryChanged(state, action.query, policy);
    case "pageLoaded":
      return reducePageLoaded(state, action.request, action.page);
    case "pageFailed":
      return reducePageFailed(state, action.request, action.error);
    case "fetchNextPage":
      return reduceFetchNextPage(state);
    case "refetch":
      return startingOver(state, state.query, policy);
    // no default
  }
};
