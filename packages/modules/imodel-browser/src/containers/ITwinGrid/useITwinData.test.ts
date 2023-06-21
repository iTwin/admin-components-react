/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { renderHook } from "@testing-library/react-hooks";
import { rest } from "msw";

import { server } from "../../tests/mocks/server";
import { DataStatus } from "../../types";
import { useITwinData } from "./useITwinData";

describe("useITwinData hook", () => {
  // Establish API mocking before all tests.
  beforeAll(() => server.listen());
  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  afterEach(() => server.resetHandlers());
  // Clean up after the tests are finished.
  afterAll(() => server.close());

  it("returns all iTwins and proper status on successful call", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useITwinData({ accessToken: "accessToken" })
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
      useITwinData({ accessToken: "accessToken", requestType: "favorites" })
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
      useITwinData({ accessToken: "accessToken", requestType: "recents" })
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
      useITwinData({ accessToken: "accessToken", filterOptions: "searched" })
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
      useITwinData({ accessToken: "accessToken" })
    );

    await waitForValueToChange(() => result.current.status);
    expect(result.current.iTwins).toEqual([]);
    expect(result.current.status).toEqual(DataStatus.FetchFailed);
  });

  it("returns apiOverrides.data without fetching when it is provided", async () => {
    const data = [{ id: "rerenderedId", displayName: "rerenderedDisplayName" }];
    const fetchData = [{ id: "fetchedId", displayName: "fetchedDisplayName" }];
    const watcher = jest.fn();
    server.use(
      rest.get("https://api.bentley.com/itwins/", (req, res, ctx) => {
        watcher();
        return res(ctx.status(200), ctx.json({ iTwins: fetchData }));
      })
    );

    const { result, rerender, waitForNextUpdate } = renderHook<
      Parameters<typeof useITwinData>,
      ReturnType<typeof useITwinData>
    >((initialValue) => useITwinData(...initialValue), {
      initialProps: [{ accessToken: "accessToken" }],
    });

    await waitForNextUpdate();

    expect(watcher).toHaveBeenCalledTimes(1);
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
    expect(watcher).toHaveBeenCalledTimes(1);

    rerender([{ accessToken: "accessToken" }]);
    await waitForNextUpdate();

    expect(result.current.iTwins).toEqual(fetchData);
    expect(result.current.status).toEqual(DataStatus.Complete);
    expect(watcher).toHaveBeenCalledTimes(2);
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
});
