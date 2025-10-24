/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { renderHook } from "@testing-library/react-hooks";
import { act } from "react";

import { useIModelFavorites } from "./useIModelFavorites";

export function mockFetch(data: any, status = 200) {
  return jest.fn().mockImplementation(async () =>
    Promise.resolve({
      status,
      ok: true,
      json: () => data,
    })
  );
}

const accessToken = "test-access-token";
const iTwinId = "iTwinId";

describe("useIModelFavorites", () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with empty Set", () => {
    const { result } = renderHook(() =>
      useIModelFavorites(iTwinId, accessToken)
    );
    window.fetch = mockFetch({ iModels: [] });

    expect(result.current.iModelFavorites).toBeInstanceOf(Set);
    expect(result.current.iModelFavorites.size).toBe(0);
  });

  test("should fetch favorites on mount", async () => {
    const mockFavorites = [
      { id: "1", name: "iModel1" },
      { id: "2", name: "iModel2" },
    ];

    window.fetch = mockFetch({ iModels: mockFavorites });
    const { result, waitForNextUpdate } = renderHook(() =>
      useIModelFavorites(iTwinId, accessToken)
    );

    await waitForNextUpdate();
    expect(result.current.iModelFavorites.has("1")).toBe(true);
    expect(result.current.iModelFavorites.has("2")).toBe(true);
    expect(result.current.iModelFavorites.size).toBe(2);
  });

  test("should handle empty response from API", async () => {
    window.fetch = mockFetch({ iModels: [] });

    const { result, waitForNextUpdate } = renderHook(() =>
      useIModelFavorites(iTwinId, accessToken)
    );

    await waitForNextUpdate();
    expect(result.current.iModelFavorites.size).toBe(0);
  });

  test("should add and remove an iModel from favorites", async () => {
    window.fetch = mockFetch({});
    const { result } = renderHook(() =>
      useIModelFavorites(iTwinId, accessToken)
    );
    const iModelId = "test-iModel-id";
    await act(async () => {
      await result.current.addIModelToFavorites(iModelId);
    });
    expect(result.current.iModelFavorites.has(iModelId)).toBe(true);

    await act(async () => {
      await result.current.removeIModelFromFavorites(iModelId);
    });
    expect(result.current.iModelFavorites.has(iModelId)).toBe(false);
  });
});
