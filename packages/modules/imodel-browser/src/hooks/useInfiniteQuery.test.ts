/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { act, renderHook } from "@testing-library/react-hooks";

import { deferred } from "../tests/helpers";
import { DataStatus } from "../types";
import { LoadedPage, PageRequest } from "./infiniteQueryReducer";
import { useInfiniteQuery, UseInfiniteQueryOptions } from "./useInfiniteQuery";

describe("useInfiniteQuery", () => {
  interface Query {
    text: string;
  }
  type Options = UseInfiniteQueryOptions<Query, string>;

  const restarting = {
    resolveLocally: () => undefined,
    decideOnQueryChange: () => "restart" as const,
  };

  const renderWith = (initialProps: Options) =>
    renderHook<Options, ReturnType<typeof useInfiniteQuery<Query, string>>>(
      (props) => useInfiniteQuery(props),
      { initialProps }
    );

  const page = (items: string[], hasMore = false): LoadedPage<string> => ({
    items,
    hasMore,
  });

  it("has no status on the first render, then fetches the first page", async () => {
    const fetchPage = jest.fn(async () => page(["one"]));

    const { result, waitForNextUpdate } = renderWith({
      query: { text: "" },
      fetchPage,
      ...restarting,
    });
    expect(result.all[0]).toHaveProperty("status", undefined);
    await waitForNextUpdate();

    expect(result.current.status).toEqual(DataStatus.Complete);
    expect(result.current.items).toEqual(["one"]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(fetchPage.mock.calls[0][0]).toMatchObject({ page: 0 });
  });

  it("resolves locally without a request", async () => {
    const fetchPage = jest.fn(async () => page(["never"]));

    const { result } = renderWith({
      query: { text: "" },
      fetchPage,
      decideOnQueryChange: () => "restart",
      resolveLocally: () => ({ status: DataStatus.TokenRequired }),
    });
    await act(async () => undefined);

    expect(result.current.status).toEqual(DataStatus.TokenRequired);
    expect(result.current.hasMore).toBe(false);
    expect(fetchPage).not.toHaveBeenCalled();
  });

  it("aborts the in-flight request when the query changes", async () => {
    const signals: AbortSignal[] = [];
    const neverSettles = deferred<LoadedPage<string>>();
    const fetchPage = jest.fn(
      async (_request: PageRequest<Query>, signal: AbortSignal) => {
        signals.push(signal);
        return neverSettles.promise;
      }
    );
    const first: Query = { text: "" };
    const second: Query = { text: "next" };

    const { rerender } = renderWith({ query: first, fetchPage, ...restarting });
    await act(async () => undefined);
    // Still in flight, so nothing has touched its signal yet.
    expect(signals).toHaveLength(1);
    expect(signals[0].aborted).toBe(false);

    rerender({ query: second, fetchPage, ...restarting });
    await act(async () => undefined);

    expect(signals).toHaveLength(2);
    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
  });

  it("ignores a page that arrives after its query was replaced", async () => {
    const stale = deferred<LoadedPage<string>>();
    const live = deferred<LoadedPage<string>>();
    const pages = [stale.promise, live.promise];
    const fetchPage = jest.fn(
      () => pages.shift() ?? Promise.reject(new Error("unexpected request"))
    );

    const { result, rerender, waitFor } = renderWith({
      query: { text: "" },
      fetchPage,
      ...restarting,
    });
    rerender({ query: { text: "next" }, fetchPage, ...restarting });
    stale.resolve(page(["stale"]));
    live.resolve(page(["live"]));
    await waitFor(() => expect(result.current.items).toEqual(["live"]));
    await act(async () => undefined);

    expect(result.current.items).toEqual(["live"]);
  });

  it("ignores a failure that arrives after its query was replaced", async () => {
    const stale = deferred<LoadedPage<string>>();
    const live = deferred<LoadedPage<string>>();
    const pages = [stale.promise, live.promise];
    const fetchPage = jest.fn(
      () => pages.shift() ?? Promise.reject(new Error("unexpected request"))
    );

    const { result, rerender, waitFor } = renderWith({
      query: { text: "" },
      fetchPage,
      ...restarting,
    });
    rerender({ query: { text: "next" }, fetchPage, ...restarting });
    stale.reject(new Error("stale failure"));
    live.resolve(page(["live"]));
    await waitFor(() => expect(result.current.items).toEqual(["live"]));
    await act(async () => undefined);

    expect(result.current.status).toEqual(DataStatus.Complete);
    expect(result.current.error).toBeUndefined();
  });

  it("keeps the items when the policy keeps the query", async () => {
    const fetchPage = jest.fn(async () => page(["one"]));

    const { result, rerender, waitForNextUpdate } = renderWith({
      query: { text: "" },
      fetchPage,
      resolveLocally: () => undefined,
      decideOnQueryChange: () => "keep",
    });
    await waitForNextUpdate();
    rerender({
      query: { text: "next" },
      fetchPage,
      resolveLocally: () => undefined,
      decideOnQueryChange: () => "keep",
    });
    await act(async () => undefined);

    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(result.current.items).toEqual(["one"]);
  });

  it("keeps one identity for fetchNextPage and refetch", async () => {
    const fetchPage = jest.fn(async () => page(["one"], true));

    const { result, rerender, waitForNextUpdate } = renderWith({
      query: { text: "" },
      fetchPage,
      ...restarting,
    });
    await waitForNextUpdate();
    const { fetchNextPage, refetch } = result.current;
    rerender({
      query: { text: "" },
      fetchPage: async () => page([]),
      ...restarting,
    });

    expect(result.current.fetchNextPage).toBe(fetchNextPage);
    expect(result.current.refetch).toBe(refetch);
  });

  it("does not restart a request when only fetchPage's identity changed", async () => {
    const calls: number[] = [];
    const countingFetchPage = () => async (request: PageRequest<Query>) => {
      calls.push(request.page);
      return page(["one"], true);
    };
    // One query object, reused. The hook's contract is that the query is memoized, so holding it
    // fixed is what isolates a change of fetchPage's identity on its own.
    const query: Query = { text: "" };

    const { rerender, waitForNextUpdate } = renderWith({
      query,
      fetchPage: countingFetchPage(),
      ...restarting,
    });
    await waitForNextUpdate();
    rerender({ query, fetchPage: countingFetchPage(), ...restarting });
    rerender({ query, fetchPage: countingFetchPage(), ...restarting });
    await act(async () => undefined);

    expect(calls).toEqual([0]);
  });

  it("fetches the next page and appends it", async () => {
    const fetchPage = jest.fn(async (request: PageRequest<Query>) =>
      page([`page${request.page}`], request.page === 0)
    );

    const { result, waitForNextUpdate, waitFor } = renderWith({
      query: { text: "" },
      fetchPage,
      ...restarting,
    });
    await waitForNextUpdate();
    act(() => result.current.fetchNextPage());
    await waitFor(() => expect(result.current.hasMore).toBe(false));

    expect(result.current.items).toEqual(["page0", "page1"]);
  });

  it("refetches the same query from the first page", async () => {
    let round = 0;
    const fetchPage = jest.fn(async () => page([`round${(round += 1)}`]));

    const { result, waitForNextUpdate, waitFor } = renderWith({
      query: { text: "" },
      fetchPage,
      ...restarting,
    });
    await waitForNextUpdate();
    act(() => result.current.refetch());
    await waitFor(() => expect(result.current.items).toEqual(["round2"]));

    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it("reports a failure and stops fetching", async () => {
    const fetchPage = jest.fn(async () => {
      throw new Error("boom");
    });

    const { result, waitForValueToChange } = renderWith({
      query: { text: "" },
      fetchPage,
      ...restarting,
    });
    await waitForValueToChange(() => result.current.status);

    expect(result.current.status).toEqual(DataStatus.FetchFailed);
    expect(result.current.error).toEqual(new Error("boom"));
    expect(result.current.isFetching).toBe(false);
  });
});
