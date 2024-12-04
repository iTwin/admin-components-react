/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { renderHook } from "@testing-library/react-hooks";
import { act } from "react";

import { useITwinFavorites } from "./useITwinFavorites";

export function mockFetch(data: any, status = 200) {
  return jest.fn().mockImplementationOnce(async () =>
    Promise.resolve({
      status,
      ok: true,
      json: () => data,
    })
  );
}

const accessToken = "test-access-token";

describe("useITwinFavorites", () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with empty Set", () => {
    const { result } = renderHook(() => useITwinFavorites(accessToken));
    window.fetch = mockFetch({ iTwins: [] });

    expect(result.current.iTwinFavorites).toBeInstanceOf(Set);
    expect(result.current.iTwinFavorites.size).toBe(0);
  });

  test("should fetch favorites on mount", async () => {
    const mockFavorites = [
      { id: "1", name: "iTwin1" },
      { id: "2", name: "iTwin2" },
    ];

    window.fetch = mockFetch({ iTwins: mockFavorites });
    const { result, waitForNextUpdate } = renderHook(() =>
      useITwinFavorites(accessToken)
    );

    await waitForNextUpdate();
    expect(result.current.iTwinFavorites.has("1")).toBe(true);
    expect(result.current.iTwinFavorites.has("2")).toBe(true);
    expect(result.current.iTwinFavorites.size).toBe(2);
  });

  test("should handle empty response from API", async () => {
    window.fetch = mockFetch({ iTwins: [] });

    const { result, waitForNextUpdate } = renderHook(() =>
      useITwinFavorites(accessToken)
    );

    await waitForNextUpdate();
    expect(result.current.iTwinFavorites.size).toBe(0);
  });

  test("should add and remove an iTwin from favorites", async () => {
    const { result } = renderHook(() => useITwinFavorites(accessToken));
    const iTwinId = "test-itwin-id";
    await act(async () => {
      window.fetch = mockFetch({});
      await result.current.addITwinToFavorites(iTwinId);
    });
    expect(result.current.iTwinFavorites.has(iTwinId)).toBe(true);

    await act(async () => {
      window.fetch = mockFetch({});
      await result.current.removeITwinFromFavorites(iTwinId);
    });
    expect(result.current.iTwinFavorites.has(iTwinId)).toBe(false);
  });
});
