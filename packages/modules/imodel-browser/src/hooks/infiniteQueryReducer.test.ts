/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { DataStatus } from "../types";
import {
  InfiniteQueryPolicy,
  InfiniteQueryState,
  initialUndecidedState,
  reduceInfiniteQuery,
} from "./infiniteQueryReducer";

describe("infiniteQueryReducer", () => {
  interface Query {
    text: string;
    scope: string;
  }
  type State = InfiniteQueryState<Query, string>;

  const fetching: InfiniteQueryPolicy<Query, string> = {
    resolveLocally: () => undefined,
    decideOnQueryChange: () => "restart",
  };
  const keeping: InfiniteQueryPolicy<Query, string> = {
    ...fetching,
    decideOnQueryChange: () => "keep",
  };

  const query: Query = { text: "", scope: "all" };
  const other: Query = { text: "a", scope: "all" };

  const reduce = (
    state: State,
    action: Parameters<typeof reduceInfiniteQuery<Query, string>>[1],
    policy = fetching
  ) => reduceInfiniteQuery(state, action, policy);

  const started = (policy = fetching) =>
    reduce(
      initialUndecidedState<Query, string>(query),
      { type: "start" },
      policy
    );

  /** Loads the page the state is waiting for, and says so loudly if it waits for none. */
  const loaded = (state: State, items: string[], hasMore: boolean) => {
    const request = state.pendingRequest;
    if (request === undefined) {
      throw new Error("the state has no pending request to load");
    }
    return reduce(state, {
      type: "pageLoaded",
      request,
      page: { items, hasMore },
    });
  };

  describe("initialUndecidedState", () => {
    it("has no status and no request", () => {
      expect(initialUndecidedState<Query, string>(query)).toEqual({
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
    });
  });

  describe("start", () => {
    it("asks for the first page", () => {
      expect(started()).toMatchObject({
        status: DataStatus.Fetching,
        items: [],
        hasMore: true,
        pendingRequest: { id: 1, query, page: 0 },
        requestCount: 1,
      });
    });

    it("is idempotent, so a double dispatch asks once", () => {
      const state = started();

      expect(reduce(state, { type: "start" })).toBe(state);
    });

    it("resolves locally instead of requesting when the policy answers", () => {
      const provided: InfiniteQueryPolicy<Query, string> = {
        ...fetching,
        resolveLocally: () => ({
          status: DataStatus.Complete,
          items: ["given"],
        }),
      };

      expect(started(provided)).toMatchObject({
        status: DataStatus.Complete,
        items: ["given"],
        hasMore: false,
        pendingRequest: undefined,
        requestCount: 0,
      });
    });

    it("resolves a missing precondition with no items", () => {
      const noToken: InfiniteQueryPolicy<Query, string> = {
        ...fetching,
        resolveLocally: () => ({ status: DataStatus.TokenRequired }),
      };

      expect(started(noToken)).toMatchObject({
        status: DataStatus.TokenRequired,
        items: [],
        hasMore: false,
        pendingRequest: undefined,
      });
    });
  });

  describe("queryChanged", () => {
    it("only retargets while nothing has been decided", () => {
      const undecided = initialUndecidedState<Query, string>(query);

      expect(reduce(undecided, { type: "queryChanged", query: other })).toEqual(
        {
          ...undecided,
          query: other,
        }
      );
    });

    it("returns the same state for the same query", () => {
      const state = started();

      expect(reduce(state, { type: "queryChanged", query })).toBe(state);
    });

    it("restarts when the policy says so", () => {
      const complete = loaded(started(), ["one"], false);

      expect(
        reduce(complete, { type: "queryChanged", query: other })
      ).toMatchObject({
        query: other,
        status: DataStatus.Fetching,
        items: [],
        hasMore: true,
        pendingRequest: { id: 2, query: other, page: 0 },
      });
    });

    it("keeps the items and the pending request when the policy says keep", () => {
      const complete = loaded(started(), ["one"], false);

      expect(
        reduce(complete, { type: "queryChanged", query: other }, keeping)
      ).toEqual({ ...complete, query: other });
    });

    it("carries the in-flight request object through unchanged when keeping", () => {
      const inFlight = started();

      const kept = reduce(
        inFlight,
        { type: "queryChanged", query: other },
        keeping
      );

      // Identity, not equality: useInfiniteQuery uses this object as an effect dependency, so a
      // rebuilt-but-equal request would abort and restart a request that is still in flight.
      expect(kept.pendingRequest).toBe(inFlight.pendingRequest);
      expect(kept.query).toBe(other);
    });
  });

  describe("pageLoaded", () => {
    it("replaces the items of the first page", () => {
      expect(loaded(started(), ["one"], false)).toMatchObject({
        status: DataStatus.Complete,
        items: ["one"],
        hasMore: false,
        lastRequestedPage: 0,
        pendingRequest: undefined,
      });
    });

    it("appends a later page and keeps the earlier total count", () => {
      const first = reduce(started(), {
        type: "pageLoaded",
        request: { id: 1, query, page: 0 },
        page: { items: ["one"], hasMore: true, totalCount: 7 },
      });
      const asking = reduce(first, { type: "fetchNextPage" });
      const second = reduce(asking, {
        type: "pageLoaded",
        request: { id: 2, query, page: 1 },
        page: { items: ["two"], hasMore: false },
      });

      expect(second).toMatchObject({
        items: ["one", "two"],
        hasMore: false,
        totalCount: 7,
        lastRequestedPage: 1,
      });
    });

    it("ignores a page that belongs to a superseded request", () => {
      const state = started();

      expect(
        reduce(state, {
          type: "pageLoaded",
          request: { id: 99, query, page: 0 },
          page: { items: ["stale"], hasMore: false },
        })
      ).toBe(state);
    });

    it("clears an earlier error", () => {
      const failed = reduce(started(), {
        type: "pageFailed",
        request: { id: 1, query, page: 0 },
        error: new Error("boom"),
      });
      const retrying = reduce(failed, { type: "fetchNextPage" });

      expect(
        reduce(retrying, {
          type: "pageLoaded",
          request: { id: 2, query, page: 0 },
          page: { items: ["one"], hasMore: false },
        })
      ).toMatchObject({ status: DataStatus.Complete, error: undefined });
    });
  });

  describe("pageFailed", () => {
    it("clears the items of a failed first page and keeps hasMore", () => {
      expect(
        reduce(started(), {
          type: "pageFailed",
          request: { id: 1, query, page: 0 },
          error: "boom",
        })
      ).toMatchObject({
        status: DataStatus.FetchFailed,
        items: [],
        hasMore: true,
        error: "boom",
        pendingRequest: undefined,
      });
    });

    it("keeps the items of earlier pages when a later page fails", () => {
      const first = loaded(started(), ["one"], true);
      const asking = reduce(first, { type: "fetchNextPage" });

      expect(
        reduce(asking, {
          type: "pageFailed",
          request: { id: 2, query, page: 1 },
          error: "boom",
        })
      ).toMatchObject({
        status: DataStatus.FetchFailed,
        items: ["one"],
        lastRequestedPage: 1,
      });
    });

    it("ignores a failure that belongs to a superseded request", () => {
      const state = started();

      expect(
        reduce(state, {
          type: "pageFailed",
          request: { id: 99, query, page: 0 },
          error: "boom",
        })
      ).toBe(state);
    });
  });

  describe("fetchNextPage", () => {
    it("asks for the page after the last one", () => {
      const first = loaded(started(), ["one"], true);

      expect(reduce(first, { type: "fetchNextPage" })).toMatchObject({
        status: DataStatus.Complete,
        pendingRequest: { id: 2, query, page: 1 },
      });
    });

    it("is ignored while a request is pending", () => {
      const state = started();

      expect(reduce(state, { type: "fetchNextPage" })).toBe(state);
    });

    it("is ignored once every page is loaded", () => {
      const state = loaded(started(), ["one"], false);

      expect(reduce(state, { type: "fetchNextPage" })).toBe(state);
    });

    it("asks for the failed page again instead of leaving a hole", () => {
      const first = loaded(started(), ["one"], true);
      const asking = reduce(first, { type: "fetchNextPage" });
      const failed = reduce(asking, {
        type: "pageFailed",
        request: { id: 2, query, page: 1 },
        error: "boom",
      });

      expect(reduce(failed, { type: "fetchNextPage" })).toMatchObject({
        pendingRequest: { id: 3, query, page: 1 },
      });
    });
  });

  describe("refetch", () => {
    it("starts the same query over", () => {
      const complete = loaded(started(), ["one"], false);

      expect(reduce(complete, { type: "refetch" })).toMatchObject({
        query,
        status: DataStatus.Fetching,
        items: [],
        hasMore: true,
        pendingRequest: { id: 2, query, page: 0 },
      });
    });
  });
});
