/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { renderHook } from "@testing-library/react-hooks";
import { rest } from "msw";

import { server } from "../../tests/mocks/server";
import { DataStatus, ProjectSortOptionsKeys } from "../../types";
import { useProjectData } from "./useProjectData";

describe("useProjectData hook", () => {
  // Establish API mocking before all tests.
  beforeAll(() => server.listen());
  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  afterEach(() => server.resetHandlers());
  // Clean up after the tests are finished.
  afterAll(() => server.close());

  it("returns all projects and proper status on successful call", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useProjectData({ accessToken: "accessToken" })
    );

    await waitForNextUpdate();
    expect(result.current.projects).toContainEqual({
      id: "my1",
      displayName: "myName1",
    });
    expect(result.current.status).toEqual(DataStatus.Complete);
  });
  it("returns searched projects and proper status on successful call", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useProjectData({
        accessToken: "accessToken",
        requestType: "search=searched",
      })
    );

    await waitForNextUpdate();
    expect(result.current.projects).toContainEqual({
      id: "my1",
      displayName: "mySearchediModel",
    });
    expect(result.current.status).toEqual(DataStatus.Complete);
  });

  it("returns favorite projects and proper status on successful call", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useProjectData({ accessToken: "accessToken", requestType: "favorites" })
    );

    await waitForNextUpdate();
    expect(result.current.projects).toContainEqual({
      id: "favorite1",
      displayName: "favoriteName1",
    });
    expect(result.current.status).toEqual(DataStatus.Complete);
  });
  it("returns recent projects and proper status on successful call", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useProjectData({ accessToken: "accessToken", requestType: "recents" })
    );

    await waitForNextUpdate();
    expect(result.current.projects).toContainEqual({
      id: "recent1",
      displayName: "recentName1",
    });
    expect(result.current.status).toEqual(DataStatus.Complete);
  });

  it("returns error status and no data on failure", async () => {
    server.use(
      rest.get("https://api.bentley.com/projects/", (req, res, ctx) => {
        return res(ctx.status(401));
      })
    );

    const { result, waitForValueToChange } = renderHook(() =>
      useProjectData({ accessToken: "accessToken" })
    );

    await waitForValueToChange(() => result.current.status);
    expect(result.current.projects).toEqual([]);
    expect(result.current.status).toEqual(DataStatus.FetchFailed);
  });

  it("returns apiOverrides.data without fetching when it is provided", async () => {
    const data = [{ id: "rerenderedId", displayName: "rerenderedDisplayName" }];
    const fetchData = [{ id: "fetchedId", displayName: "fetchedDisplayName" }];
    const watcher = jest.fn();
    server.use(
      rest.get("https://api.bentley.com/projects/", (req, res, ctx) => {
        watcher();
        return res(ctx.status(200), ctx.json({ projects: fetchData }));
      })
    );

    const { result, rerender, waitForNextUpdate } = renderHook<
      Parameters<typeof useProjectData>,
      ReturnType<typeof useProjectData>
    >((initialValue) => useProjectData(...initialValue), {
      initialProps: [{ accessToken: "accessToken" }],
    });

    await waitForNextUpdate();

    expect(watcher).toHaveBeenCalledTimes(1);
    expect(result.current.status).toEqual(DataStatus.Complete);
    expect(result.current.projects).toEqual(fetchData);

    rerender([
      {
        apiOverrides: {
          data,
        },
      },
    ]);

    expect(result.current.projects).toEqual([
      { id: "rerenderedId", displayName: "rerenderedDisplayName" },
    ]);
    expect(result.current.status).toEqual(DataStatus.Complete);
    expect(watcher).toHaveBeenCalledTimes(1);

    rerender([{ accessToken: "accessToken" }]);
    await waitForNextUpdate();

    expect(result.current.projects).toEqual(fetchData);
    expect(result.current.status).toEqual(DataStatus.Complete);
    expect(watcher).toHaveBeenCalledTimes(2);
  });

  it("returns proper error if no accessToken is provided without data override", async () => {
    const { result } = renderHook(() => useProjectData({}));

    expect(result.current.projects).toEqual([]);
    expect(result.current.status).toEqual(DataStatus.TokenRequired);
  });

  it("apply sorting", async () => {
    const expectedSortOrder = ["2", "4", "5", "1", "3"];
    const options = {
      apiOverrides: {
        data: [
          {
            id: "1",
            displayName: "d",
          },
          {
            id: "2",
            displayName: "a",
          },
          {
            id: "3",
            displayName: "e",
          },
          {
            id: "4",
            displayName: "b",
          },
          {
            id: "5",
            displayName: "c",
          },
        ],
      },
      sortOptions: {
        sortType: "displayName" as ProjectSortOptionsKeys,
        descending: false,
      },
    };
    const { result } = renderHook(() => useProjectData(options));

    expect(result.current.projects.map((project) => project.id)).toEqual(
      expectedSortOrder
    );
  });

  it("apply filtering", async () => {
    const expected = ["2", "5"];
    const options = {
      apiOverrides: {
        data: [
          {
            id: "1",
            displayName: "d",
            projectNumber: "e",
          },
          {
            id: "2",
            displayName: "a",
            projectNumber: "d",
          },
          {
            id: "3",
            displayName: "e",
            projectNumber: "c",
          },
          {
            id: "4",
            displayName: "b",
            projectNumber: "b",
          },
          {
            id: "5",
            displayName: "c",
            projectNumber: "a",
          },
        ],
      },
      filterOptions: "a",
    };
    const { result } = renderHook(() => useProjectData(options));

    expect(result.current.projects.map((project) => project.id)).toEqual(
      expected
    );
  });

  it("returns proper status if unknown requestType is provided", async () => {
    const { result } = renderHook(() =>
      useProjectData({
        accessToken: "accessToken",
        requestType: "searched" as any,
      })
    );

    expect(result.current.projects).toEqual([]);
    expect(result.current.status).toEqual(DataStatus.ContextRequired);
  });
});
