/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { renderHook } from "@testing-library/react-hooks";
import { rest } from "msw";

import { server } from "../../tests/mocks/server";
import { useIModelData } from "./useIModelData";

describe("useIModelData hook", () => {
  // Establish API mocking before all tests.
  beforeAll(() => server.listen());
  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  afterEach(() => server.resetHandlers());
  // Clean up after the tests are finished.
  afterAll(() => server.close());

  it("returns the data and proper status on successful call", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useIModelData("projectId", "", "accessToken")
    );

    await waitForNextUpdate();
    expect(result.current.iModels).toContainEqual({
      id: "fakeId",
      displayName: "fakeName",
    });
    expect(result.current.status).toEqual("complete");
  });

  it("returns error status and no data on failure", async () => {
    server.use(
      rest.get("https://api.bentley.com/imodels/", (req, res, ctx) => {
        return res(ctx.status(401));
      })
    );

    const { result, waitForValueToChange } = renderHook(() =>
      useIModelData("projectId", "", "accessToken")
    );

    await waitForValueToChange(() => result.current.status);
    expect(result.current.iModels).toEqual([]);
    expect(result.current.status).toEqual("fetch_error");
  });

  it("returns apiOverrides.data without fetching when it is provided", async () => {
    const watcher = jest.fn();
    server.use(
      rest.get("https://api.bentley.com/imodels/", (req, res, ctx) => {
        watcher();
        return res(ctx.status(200), ctx.json({ iModels: [] }));
      })
    );

    const { result, rerender, waitForNextUpdate } = renderHook<
      Parameters<typeof useIModelData>,
      ReturnType<typeof useIModelData>
    >((initialValue) => useIModelData(...initialValue), {
      initialProps: ["projectId", "", "accessToken"],
    });

    await waitForNextUpdate();

    expect(result.current.iModels).toEqual([]);
    expect(result.current.status).toEqual("complete");
    expect(watcher).toHaveBeenCalledTimes(1);

    rerender([
      "projectId",
      "",
      "accessToken",
      { data: [{ id: "rerenderedId", displayName: "rerenderedDisplayName" }] },
    ]);

    expect(result.current.iModels).toEqual([
      { id: "rerenderedId", displayName: "rerenderedDisplayName" },
    ]);
    expect(result.current.status).toEqual("override");
    expect(watcher).toHaveBeenCalledTimes(1);

    rerender(["projectId", "", "accessToken"]);
    await waitForNextUpdate();

    expect(result.current.iModels).toEqual([]);
    expect(result.current.status).toEqual("complete");
    expect(watcher).toHaveBeenCalledTimes(2);
  });
});
