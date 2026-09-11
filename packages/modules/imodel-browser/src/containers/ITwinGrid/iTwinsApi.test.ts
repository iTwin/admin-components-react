/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { rest } from "msw";

import { server } from "../../tests/mocks/server";
import { ITwinFull } from "../../types";
import {
  buildITwinsPageUrl,
  fetchITwinsPage,
  ITwinQueryParams,
  ITWINS_PAGE_SIZE,
} from "./iTwinsApi";

describe("iTwinsApi", () => {
  const baseQuery: ITwinQueryParams = {
    requestType: "",
    filterText: "",
    iTwinSubClass: "Project",
    orderby: undefined,
    credentialKey: "accessToken",
  };

  describe("buildITwinsPageUrl", () => {
    it("pages the default request", () => {
      expect(buildITwinsPageUrl({ query: baseQuery, page: 2 })).toEqual(
        "https://api.bentley.com/itwins/?subClass=Project&$skip=200&$top=100"
      );
    });

    it("uses the endpoint of a client side filtered request type", () => {
      expect(
        buildITwinsPageUrl({
          query: { ...baseQuery, requestType: "favorites" },
          page: 0,
        })
      ).toContain("/itwins/favorites?subClass=Project");
    });

    it("sends an empty subClass for All", () => {
      expect(
        buildITwinsPageUrl({
          query: { ...baseQuery, iTwinSubClass: "All" },
          page: 0,
        })
      ).toContain("?subClass=&");
    });

    it("uses the server environment prefix", () => {
      expect(
        buildITwinsPageUrl({
          query: { ...baseQuery, serverEnvironmentPrefix: "dev" },
          page: 0,
        })
      ).toContain("https://dev-api.bentley.com/itwins/");
    });

    it("searches with the filter text, encoded and trimmed", () => {
      expect(
        buildITwinsPageUrl({
          query: { ...baseQuery, filterText: "  a b+c  " },
          page: 0,
        })
      ).toContain("&$search=a%20b%2Bc");
    });

    it("orders with the orderby, encoded", () => {
      expect(
        buildITwinsPageUrl({
          query: { ...baseQuery, orderby: "displayName ASC" },
          page: 0,
        })
      ).toContain("&$orderby=displayName%20ASC");
    });

    it("drops search and orderby for a client side filtered request type", () => {
      const url = buildITwinsPageUrl({
        query: {
          ...baseQuery,
          requestType: "recents",
          filterText: "ignored",
          orderby: "displayName ASC",
        },
        page: 0,
      });

      expect(url).not.toContain("$search");
      expect(url).not.toContain("$orderby");
    });
  });

  describe("fetchITwinsPage", () => {
    const iTwins: ITwinFull[] = [{ id: "alpha", displayName: "alpha" }];
    const requestWatcher = jest.fn();

    beforeAll(() => server.listen());
    afterEach(() => {
      server.resetHandlers();
      jest.clearAllMocks();
    });
    afterAll(() => server.close());

    const pinResponse = ({
      status = 200,
      body = { iTwins },
      totalCount,
      text,
    }: {
      status?: number;
      body?: unknown;
      totalCount?: string;
      text?: string;
    }) =>
      server.use(
        rest.get("https://api.bentley.com/itwins/", (req, res, ctx) => {
          requestWatcher({
            authorization: req.headers.get("Authorization"),
            cacheControl: req.headers.get("Cache-Control"),
            accept: req.headers.get("Accept"),
            prefer: req.headers.get("Prefer"),
            totalCount: req.headers.get("x-total-count"),
          });
          return res(
            ctx.status(status),
            ...(text === undefined ? [ctx.json(body)] : [ctx.text(text)]),
            ...(totalCount === undefined
              ? []
              : [ctx.set("x-total-count", totalCount)])
          );
        })
      );

    const fetchWith = (
      overrides: Partial<Parameters<typeof fetchITwinsPage>[0]> = {}
    ) =>
      fetchITwinsPage({
        query: baseQuery,
        page: 0,
        accessToken: "accessToken",
        bypassCache: false,
        signal: new AbortController().signal,
        ...overrides,
      });

    it("returns the page and no total count when the response carries none", async () => {
      pinResponse({});

      await expect(fetchWith()).resolves.toEqual({
        items: iTwins,
        hasMore: false,
        totalCount: undefined,
      });
    });

    it("reads the total count header", async () => {
      pinResponse({ totalCount: "42" });

      await expect(fetchWith()).resolves.toMatchObject({ totalCount: 42 });
    });

    it("has more pages when the page is full", async () => {
      const fullPage = Array.from(
        { length: ITWINS_PAGE_SIZE },
        (_unused, index) => ({ id: `id${index}` })
      );
      pinResponse({ body: { iTwins: fullPage } });

      await expect(fetchWith()).resolves.toMatchObject({ hasMore: true });
    });

    it("sends the platform headers and no Cache-Control by default", async () => {
      pinResponse({});

      await fetchWith();

      expect(requestWatcher).toHaveBeenCalledWith({
        authorization: "accessToken",
        cacheControl: null,
        accept: "application/vnd.bentley.itwin-platform.v1+json",
        prefer: "return=representation",
        totalCount: "true",
      });
    });

    it("sends no-cache when told to bypass the cache", async () => {
      pinResponse({});

      await fetchWith({ bypassCache: true });

      expect(requestWatcher).toHaveBeenCalledWith(
        expect.objectContaining({ cacheControl: "no-cache" })
      );
    });

    it("resolves a token provider at request time", async () => {
      pinResponse({});

      await fetchWith({ accessToken: async () => "fresh" });

      expect(requestWatcher).toHaveBeenCalledWith(
        expect.objectContaining({ authorization: "fresh" })
      );
    });

    it("throws what the api answered", async () => {
      pinResponse({ status: 401, text: "no soup for you" });

      await expect(fetchWith()).rejects.toEqual(new Error("no soup for you"));
    });
  });
});
