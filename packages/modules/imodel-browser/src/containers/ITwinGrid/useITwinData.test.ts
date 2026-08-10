/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { act, renderHook } from "@testing-library/react-hooks";
import {
  type ResponseComposition,
  type RestContext,
  type RestRequest,
  rest,
} from "msw";

import { server } from "../../tests/mocks/server";
import { DataStatus } from "../../types";
import { useITwinData } from "./useITwinData";

describe("useITwinData hook", () => {
  const accessToken = "accessToken";
  const urlWatcher = jest.fn();

  // Establish API mocking before all tests.
  beforeAll(() => server.listen());
  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  // Clean up after the tests are finished.
  afterAll(() => server.close());

  it("returns all iTwins and proper status on successful call", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useITwinData({ accessToken })
    );

    await waitForNextUpdate();
    expect(result.current.iTwins).toContainEqual({
      id: "my1",
      displayName: "myName1",
    });
    expect(result.current.status).toEqual(DataStatus.Complete);
  });
  it("returns favorite iTwins and proper status on successful call", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useITwinData({ accessToken, requestType: "favorites" })
    );

    await waitForNextUpdate();
    expect(result.current.iTwins).toContainEqual({
      id: "favorite1",
      displayName: "favoriteName1",
    });
    expect(result.current.status).toEqual(DataStatus.Complete);
  });
  it("returns recent iTwins and proper status on successful call", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useITwinData({ accessToken, requestType: "recents" })
    );

    await waitForNextUpdate();
    expect(result.current.iTwins).toContainEqual({
      id: "recent1",
      displayName: "recentName1",
    });
    expect(result.current.status).toEqual(DataStatus.Complete);
  });
  it("returns searched iTwins and proper status on successful call", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useITwinData({ accessToken, filterOptions: "searched" })
    );

    await waitForNextUpdate();
    expect(result.current.iTwins).toContainEqual({
      id: "mySearched1",
      displayName: "mySearchedName1",
    });
    expect(result.current.status).toEqual(DataStatus.Complete);
  });

  it("returns error status and no data on failure", async () => {
    server.use(
      rest.get("https://api.bentley.com/itwins/", (req, res, ctx) => {
        return res(ctx.status(401));
      })
    );

    const { result, waitForValueToChange } = renderHook(() =>
      useITwinData({ accessToken })
    );

    await waitForValueToChange(() => result.current.status);
    expect(result.current.iTwins).toEqual([]);
    expect(result.current.status).toEqual(DataStatus.FetchFailed);
  });

  it("returns apiOverrides.data without fetching when it is provided", async () => {
    const data = [{ id: "rerenderedId", displayName: "rerenderedDisplayName" }];
    const fetchData = [{ id: "fetchedId", displayName: "fetchedDisplayName" }];

    server.use(
      rest.get("https://api.bentley.com/itwins/", (req, res, ctx) => {
        urlWatcher(req.url.toString());
        return res(ctx.status(200), ctx.json({ iTwins: fetchData }));
      })
    );

    const { result, rerender, waitForNextUpdate } = renderHook<
      Parameters<typeof useITwinData>,
      ReturnType<typeof useITwinData>
    >((initialValue) => useITwinData(...initialValue), {
      initialProps: [{ accessToken }],
    });

    await waitForNextUpdate();

    expect(urlWatcher).toHaveBeenCalledTimes(1);
    expect(result.current.status).toEqual(DataStatus.Complete);
    expect(result.current.iTwins).toEqual(fetchData);

    rerender([
      {
        apiOverrides: {
          data,
        },
      },
    ]);

    expect(result.current.iTwins).toEqual([
      { id: "rerenderedId", displayName: "rerenderedDisplayName" },
    ]);
    expect(result.current.status).toEqual(DataStatus.Complete);
    expect(urlWatcher).toHaveBeenCalledTimes(1);

    rerender([{ accessToken }]);
    await waitForNextUpdate();

    expect(result.current.iTwins).toEqual(fetchData);
    expect(result.current.status).toEqual(DataStatus.Complete);
    expect(urlWatcher).toHaveBeenCalledTimes(2);
  });

  it("returns proper error if no accessToken is provided without data override", async () => {
    const { result } = renderHook(() => useITwinData({}));

    expect(result.current.iTwins).toEqual([]);
    expect(result.current.status).toEqual(DataStatus.TokenRequired);
  });

  it("apply filtering", async () => {
    const expected = ["2", "5"];
    const options = {
      apiOverrides: {
        data: [
          {
            id: "1",
            displayName: "d",
            number: "e",
          },
          {
            id: "2",
            displayName: "a",
            number: "d",
          },
          {
            id: "3",
            displayName: "e",
            number: "c",
          },
          {
            id: "4",
            displayName: "b",
            number: "b",
          },
          {
            id: "5",
            displayName: "c",
            number: "a",
          },
        ],
      },
      filterOptions: "a",
    };
    const { result } = renderHook(() => useITwinData(options));

    expect(result.current.iTwins.map((iTwin) => iTwin.id)).toEqual(expected);
  });

  describe("orderByOptions", () => {
    const orderbyOptions = "displayName DESC";
    const fetchedITwins = [
      { id: "fetchedId", displayName: "fetchedDisplayName" },
    ];

    const handleRequest = (
      req: RestRequest,
      res: ResponseComposition,
      ctx: RestContext
    ) => {
      urlWatcher(req.url.toString());
      return res(ctx.status(200), ctx.json({ iTwins: fetchedITwins }));
    };

    it("returns ordered iTwins and proper status on successful call", async () => {
      server.use(rest.get("https://api.bentley.com/itwins/", handleRequest));
      const { result, waitForNextUpdate } = renderHook(() =>
        useITwinData({ accessToken, orderbyOptions: "displayName ASC" })
      );

      await waitForNextUpdate();

      expect(result.current.iTwins).toEqual(fetchedITwins);
      expect(urlWatcher).toHaveBeenCalledWith(
        expect.stringContaining("$orderby=displayName%20ASC")
      );
      expect(result.current.status).toEqual(DataStatus.Complete);
    });

    it("ignores orderBy options for favorites request", async () => {
      server.use(
        rest.get("https://api.bentley.com/itwins/favorites", handleRequest)
      );

      const { result, waitForNextUpdate } = renderHook(() =>
        useITwinData({ accessToken, requestType: "favorites", orderbyOptions })
      );

      await waitForNextUpdate();
      expect(urlWatcher).toHaveBeenCalledWith(
        expect.not.stringContaining("$orderby")
      );
      expect(result.current.status).toEqual(DataStatus.Complete);
    });

    it("ignores orderBy options for recents request", async () => {
      server.use(
        rest.get("https://api.bentley.com/itwins/recents", handleRequest)
      );

      const { result, waitForNextUpdate } = renderHook(() =>
        useITwinData({ accessToken, requestType: "recents", orderbyOptions })
      );

      await waitForNextUpdate();
      expect(urlWatcher).toHaveBeenCalledWith(
        expect.not.stringContaining("$orderby")
      );
      expect(result.current.status).toEqual(DataStatus.Complete);
    });

    it("properly encodes orderBy options with special characters", async () => {
      server.use(rest.get("https://api.bentley.com/itwins/", handleRequest));

      const { result, waitForNextUpdate } = renderHook(() =>
        useITwinData({ accessToken, orderbyOptions })
      );

      await waitForNextUpdate();
      expect(urlWatcher).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(orderbyOptions))
      );
      expect(result.current.status).toEqual(DataStatus.Complete);
    });

    it("refetches data when orderBy options change", async () => {
      server.use(rest.get("https://api.bentley.com/itwins/", handleRequest));

      const { rerender, waitForNextUpdate } = renderHook<
        Parameters<typeof useITwinData>,
        ReturnType<typeof useITwinData>
      >((initialValue) => useITwinData(...initialValue), {
        initialProps: [{ accessToken, orderbyOptions }],
      });

      await waitForNextUpdate();
      expect(urlWatcher).toHaveBeenCalledTimes(1);

      rerender([{ accessToken, orderbyOptions: "somethingDifferent" }]);
      await waitForNextUpdate();
      expect(urlWatcher).toHaveBeenCalledTimes(2);
    });
  });

  describe("fetchMore", () => {
    it("ignores fetchMore until the initial request settles", async () => {
      const requestedPages: (string | null)[] = [];
      server.use(
        rest.get("https://api.bentley.com/itwins/", (req, res, ctx) => {
          const skip = req.url.searchParams.get("$skip");
          requestedPages.push(skip);
          return res(
            ctx.status(200),
            ctx.json({
              iTwins: [{ id: `id-${skip}`, displayName: `name-${skip}` }],
            })
          );
        })
      );

      const { result, waitForNextUpdate } = renderHook(() =>
        useITwinData({ accessToken })
      );

      // fetchMore is available immediately but must be ignored until the first request completes.
      act(() => {
        result.current.fetchMore?.();
        result.current.fetchMore?.();
      });

      await waitForNextUpdate();

      expect(result.current.status).toEqual(DataStatus.Complete);
      // Only the first page should have been requested
      expect(requestedPages).toEqual(["0"]);
      expect(result.current.iTwins).toEqual([
        { id: "id-0", displayName: "name-0" },
      ]);
    });

    it("fetches the next page once the previous request has settled", async () => {
      const firstPage = Array.from({ length: 100 }, (_, i) => ({
        id: `first-${i}`,
        displayName: `first-${i}`,
      }));
      const secondPage = [{ id: "second-0", displayName: "second-0" }];
      server.use(
        rest.get("https://api.bentley.com/itwins/", (req, res, ctx) => {
          const skip = req.url.searchParams.get("$skip");
          return res(
            ctx.status(200),
            ctx.json({ iTwins: skip === "0" ? firstPage : secondPage })
          );
        })
      );

      const { result, waitForNextUpdate } = renderHook(() =>
        useITwinData({ accessToken })
      );

      await waitForNextUpdate();
      expect(result.current.status).toEqual(DataStatus.Complete);
      expect(result.current.iTwins).toHaveLength(100);
      expect(result.current.fetchMore).toBeDefined();

      act(() => {
        result.current.fetchMore?.();
      });
      await waitForNextUpdate();

      expect(result.current.iTwins).toHaveLength(101);
      expect(result.current.iTwins).toContainEqual({
        id: "second-0",
        displayName: "second-0",
      });
    });

    it("keeps the pages already loaded when a later page fails", async () => {
      const firstPage = Array.from({ length: 100 }, (_, i) => ({
        id: `first-${i}`,
        displayName: `first-${i}`,
      }));
      server.use(
        rest.get("https://api.bentley.com/itwins/", (req, res, ctx) =>
          req.url.searchParams.get("$skip") === "0"
            ? res(ctx.status(200), ctx.json({ iTwins: firstPage }))
            : res(ctx.status(500))
        )
      );

      const { result, waitForNextUpdate, waitForValueToChange } = renderHook(
        () => useITwinData({ accessToken })
      );

      await waitForNextUpdate();
      expect(result.current.iTwins).toHaveLength(100);

      act(() => {
        result.current.fetchMore?.();
      });
      await waitForValueToChange(() => result.current.status);

      expect(result.current.status).toEqual(DataStatus.FetchFailed);
      expect(result.current.iTwins).toHaveLength(100);
      // morePages is deliberately untouched, because favorites and recents read it as
      // "everything is loaded" and would stop refetching entirely.
      expect(result.current.fetchMore).toBeDefined();
    });

    it("retries the failed page instead of advancing past it", async () => {
      const pageOf = (start: number) =>
        Array.from({ length: 100 }, (_, i) => ({
          id: `it-${start + i}`,
          displayName: `it-${start + i}`,
        }));
      const requested: (string | null)[] = [];
      let failSecondPage = true;
      server.use(
        rest.get("https://api.bentley.com/itwins/", (req, res, ctx) => {
          const skip = req.url.searchParams.get("$skip");
          requested.push(skip);
          if (skip === "100" && failSecondPage) {
            return res(ctx.status(500));
          }
          return res(
            ctx.status(200),
            ctx.json({ iTwins: pageOf(Number(skip)) })
          );
        })
      );

      const { result, waitForNextUpdate, waitForValueToChange } = renderHook(
        () => useITwinData({ accessToken })
      );

      await waitForNextUpdate();
      act(() => {
        result.current.fetchMore?.();
      });
      await waitForValueToChange(() => result.current.status);
      expect(result.current.status).toEqual(DataStatus.FetchFailed);
      expect(requested).toEqual(["0", "100"]);

      failSecondPage = false;
      act(() => {
        result.current.fetchMore?.();
      });
      await waitForValueToChange(() => result.current.status);

      expect(requested).toEqual(["0", "100", "100"]);
      expect(result.current.status).toEqual(DataStatus.Complete);
      expect(result.current.iTwins.map((iTwin) => iTwin.id)).toContain(
        "it-150"
      );
    });

    it("advances normally when the query changed after a failed page", async () => {
      const requested: { skip: string | null; search: string | null }[] = [];
      let failSecondPage = true;
      server.use(
        rest.get("https://api.bentley.com/itwins/", (req, res, ctx) => {
          const skip = req.url.searchParams.get("$skip");
          requested.push({ skip, search: req.url.searchParams.get("$search") });
          if (skip === "100" && failSecondPage) {
            return res(ctx.status(500));
          }
          return res(
            ctx.status(200),
            ctx.json({
              iTwins: Array.from({ length: 100 }, (_, i) => ({
                id: `id-${skip}-${i}`,
              })),
            })
          );
        })
      );

      const { result, rerender, waitForNextUpdate, waitForValueToChange } =
        renderHook<
          Parameters<typeof useITwinData>,
          ReturnType<typeof useITwinData>
        >((args) => useITwinData(...args), {
          initialProps: [{ accessToken }],
        });

      await waitForNextUpdate();
      act(() => {
        result.current.fetchMore?.();
      });
      await waitForValueToChange(() => result.current.status);
      expect(result.current.status).toEqual(DataStatus.FetchFailed);

      failSecondPage = false;
      rerender([{ accessToken, filterOptions: "next" }]);
      await waitForValueToChange(() => result.current.status);
      expect(result.current.status).toEqual(DataStatus.Complete);

      act(() => {
        result.current.fetchMore?.();
      });
      await waitForNextUpdate();

      // The pending retry belonged to the previous query, so this must page forward.
      expect(requested[requested.length - 1]).toEqual({
        skip: "100",
        search: "next",
      });
    });

    it("recovers from a failure when the favorites filter changes", async () => {
      let shouldFail = true;
      let requests = 0;
      server.use(
        rest.get(
          "https://api.bentley.com/itwins/favorites",
          (_req, res, ctx) => {
            requests += 1;
            return shouldFail
              ? res(ctx.status(500))
              : res(
                  ctx.status(200),
                  ctx.json({ iTwins: [{ id: "fav1", displayName: "alpha" }] })
                );
          }
        )
      );

      const { result, rerender, waitForValueToChange, waitFor } = renderHook<
        Parameters<typeof useITwinData>,
        ReturnType<typeof useITwinData>
      >((args) => useITwinData(...args), {
        initialProps: [{ accessToken, requestType: "favorites" }],
      });

      await waitForValueToChange(() => result.current.status);
      expect(result.current.status).toEqual(DataStatus.FetchFailed);
      expect(requests).toEqual(1);

      shouldFail = false;
      rerender([
        { accessToken, requestType: "favorites", filterOptions: "alpha" },
      ]);

      await waitFor(() => result.current.status === DataStatus.Complete);
      expect(requests).toEqual(2);
      expect(result.current.iTwins).toEqual([
        { id: "fav1", displayName: "alpha" },
      ]);
    });

    it("clears the results when the first page fails", async () => {
      server.use(
        rest.get("https://api.bentley.com/itwins/", (_req, res, ctx) =>
          res(ctx.status(500))
        )
      );

      const { result, waitForValueToChange } = renderHook(() =>
        useITwinData({ accessToken })
      );

      await waitForValueToChange(() => result.current.status);
      expect(result.current.status).toEqual(DataStatus.FetchFailed);
      expect(result.current.iTwins).toEqual([]);
    });
  });

  describe("totalCount", () => {
    const respondWithTotal = (total: string) =>
      server.use(
        rest.get("https://api.bentley.com/itwins/", (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set("x-total-count", total),
            ctx.json({ iTwins: [{ id: "my1", displayName: "myName1" }] })
          )
        )
      );

    it("reports the total from the response header", async () => {
      respondWithTotal("250");

      const { result, waitForNextUpdate } = renderHook(() =>
        useITwinData({ accessToken })
      );

      await waitForNextUpdate();
      expect(result.current.totalCount).toEqual(250);
    });

    it("does not report the previous query's total while the next one is fetching", async () => {
      respondWithTotal("250");

      const { result, rerender, waitForNextUpdate } = renderHook<
        Parameters<typeof useITwinData>,
        ReturnType<typeof useITwinData>
      >((args) => useITwinData(...args), {
        initialProps: [{ accessToken, orderbyOptions: "first" }],
      });

      await waitForNextUpdate();
      expect(result.current.totalCount).toEqual(250);

      respondWithTotal("7");
      rerender([{ accessToken, orderbyOptions: "second" }]);

      expect(result.current.status).toEqual(DataStatus.Fetching);
      expect(result.current.totalCount).toBeUndefined();

      await waitForNextUpdate();
      expect(result.current.totalCount).toEqual(7);
    });
  });

  describe("refetchITwins", () => {
    it("refetches when the first page filled the page size", async () => {
      const fullPage = Array.from({ length: 100 }, (_, i) => ({
        id: `id-${i}`,
        displayName: `name-${i}`,
      }));
      const requestedPages: (string | null)[] = [];
      server.use(
        rest.get("https://api.bentley.com/itwins/", (req, res, ctx) => {
          requestedPages.push(req.url.searchParams.get("$skip"));
          return res(ctx.status(200), ctx.json({ iTwins: fullPage }));
        })
      );

      const { result, waitForNextUpdate } = renderHook(() =>
        useITwinData({ accessToken })
      );

      await waitForNextUpdate();
      expect(requestedPages).toEqual(["0"]);
      expect(result.current.fetchMore).toBeDefined();

      act(() => {
        result.current.refetchITwins();
      });
      expect(result.current.status).toEqual(DataStatus.Fetching);

      await waitForNextUpdate();
      expect(requestedPages).toEqual(["0", "0"]);
      expect(result.current.status).toEqual(DataStatus.Complete);
      expect(result.current.iTwins).toHaveLength(100);
    });

    it("refetches when the first page did not fill the page size", async () => {
      const requestedPages: (string | null)[] = [];
      server.use(
        rest.get("https://api.bentley.com/itwins/", (req, res, ctx) => {
          requestedPages.push(req.url.searchParams.get("$skip"));
          return res(
            ctx.status(200),
            ctx.json({ iTwins: [{ id: "my1", displayName: "myName1" }] })
          );
        })
      );

      const { result, waitForNextUpdate } = renderHook(() =>
        useITwinData({ accessToken })
      );

      await waitForNextUpdate();
      expect(requestedPages).toEqual(["0"]);

      act(() => {
        result.current.refetchITwins();
      });

      await waitForNextUpdate();
      expect(requestedPages).toEqual(["0", "0"]);
      expect(result.current.status).toEqual(DataStatus.Complete);
    });

    it("issues a single request when refetching after fetching more pages", async () => {
      const fullPage = Array.from({ length: 100 }, (_, i) => ({
        id: `id-${i}`,
        displayName: `name-${i}`,
      }));
      const requestedPages: (string | null)[] = [];
      server.use(
        rest.get("https://api.bentley.com/itwins/", (req, res, ctx) => {
          requestedPages.push(req.url.searchParams.get("$skip"));
          return res(ctx.status(200), ctx.json({ iTwins: fullPage }));
        })
      );

      const { result, waitForNextUpdate } = renderHook(() =>
        useITwinData({ accessToken })
      );

      await waitForNextUpdate();
      act(() => {
        result.current.fetchMore?.();
      });
      await waitForNextUpdate();
      expect(requestedPages).toEqual(["0", "100"]);

      act(() => {
        result.current.refetchITwins();
      });
      await waitForNextUpdate();

      expect(requestedPages).toEqual(["0", "100", "0"]);
    });
  });

  describe("superseded requests", () => {
    // globalThis.fetch is already a jest mock, and jest.spyOn returns an existing mock as-is
    // without registering a restore, so restoreAllMocks would not undo a mockImplementation.
    const originalFetch = globalThis.fetch;

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    // These fakes ignore the abort signal, so only the request id can keep a superseded result out.
    const resolveAfter = (body: unknown, delayMs: number) =>
      new Promise<Response>((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              json: async () => body,
              headers: { get: () => null },
            } as unknown as Response),
          delayMs
        )
      );

    const respondByUrl = (impl: (url: string) => Promise<Response>) => {
      globalThis.fetch = ((input: RequestInfo | URL) =>
        impl(String(input))) as typeof globalThis.fetch;
    };

    const settle = async () => {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });
    };

    it("ignores a response that resolves after its query was replaced", async () => {
      respondByUrl((url) =>
        url.includes("superseded")
          ? resolveAfter({ iTwins: [{ id: "superseded" }] }, 80)
          : resolveAfter({ iTwins: [{ id: "current" }] }, 0)
      );

      const { result, rerender, waitFor } = renderHook<
        Parameters<typeof useITwinData>,
        ReturnType<typeof useITwinData>
      >((args) => useITwinData(...args), {
        initialProps: [{ accessToken, orderbyOptions: "superseded" }],
      });

      rerender([{ accessToken, orderbyOptions: "current" }]);
      await waitFor(() => result.current.status === DataStatus.Complete);
      expect(result.current.iTwins).toEqual([{ id: "current" }]);

      await settle();
      expect(result.current.iTwins).toEqual([{ id: "current" }]);
      expect(result.current.status).toEqual(DataStatus.Complete);
    });

    it("ignores a failure that rejects after its query was replaced", async () => {
      respondByUrl((url) =>
        url.includes("failing")
          ? new Promise<Response>((_resolve, reject) =>
              setTimeout(() => reject(new Error("superseded failure")), 80)
            )
          : resolveAfter({ iTwins: [{ id: "current" }] }, 0)
      );

      const { result, rerender, waitFor } = renderHook<
        Parameters<typeof useITwinData>,
        ReturnType<typeof useITwinData>
      >((args) => useITwinData(...args), {
        initialProps: [{ accessToken, orderbyOptions: "failing" }],
      });

      rerender([{ accessToken, orderbyOptions: "current" }]);
      await waitFor(() => result.current.status === DataStatus.Complete);

      await settle();
      expect(result.current.status).toEqual(DataStatus.Complete);
      expect(result.current.iTwins).toEqual([{ id: "current" }]);
    });
  });

  describe("client side filtering", () => {
    const favorites = [
      { id: "fav1", displayName: "alpha" },
      { id: "fav2", displayName: "beta" },
    ];

    it("does not refetch favorites when the filter changes after all pages are loaded", async () => {
      let requests = 0;
      server.use(
        rest.get(
          "https://api.bentley.com/itwins/favorites",
          (_req, res, ctx) => {
            requests += 1;
            return res(ctx.status(200), ctx.json({ iTwins: favorites }));
          }
        )
      );

      const { result, rerender, waitFor, waitForNextUpdate } = renderHook<
        Parameters<typeof useITwinData>,
        ReturnType<typeof useITwinData>
      >((args) => useITwinData(...args), {
        initialProps: [{ accessToken, requestType: "favorites" }],
      });

      await waitForNextUpdate();
      expect(requests).toEqual(1);
      expect(result.current.fetchMore).toBeUndefined();

      rerender([
        { accessToken, requestType: "favorites", filterOptions: "alpha" },
      ]);
      await waitFor(() => result.current.iTwins.length === 1);

      expect(requests).toEqual(1);
      expect(result.current.iTwins).toEqual([favorites[0]]);
    });

    it("refetches favorites when the filter changes while more pages remain", async () => {
      const fullPage = Array.from({ length: 100 }, (_, i) => ({
        id: `fav-${i}`,
        displayName: `alpha-${i}`,
      }));
      let requests = 0;
      server.use(
        rest.get(
          "https://api.bentley.com/itwins/favorites",
          (_req, res, ctx) => {
            requests += 1;
            return res(ctx.status(200), ctx.json({ iTwins: fullPage }));
          }
        )
      );

      const { result, rerender, waitForNextUpdate } = renderHook<
        Parameters<typeof useITwinData>,
        ReturnType<typeof useITwinData>
      >((args) => useITwinData(...args), {
        initialProps: [{ accessToken, requestType: "favorites" }],
      });

      await waitForNextUpdate();
      expect(requests).toEqual(1);
      expect(result.current.fetchMore).toBeDefined();

      rerender([
        { accessToken, requestType: "favorites", filterOptions: "alpha" },
      ]);
      await waitForNextUpdate();

      expect(requests).toEqual(2);
    });
  });
});
